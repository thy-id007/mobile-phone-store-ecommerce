const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');

dotenv.config();

const connectionString = process.env.DATABASE_URL;
let poolConfig = {};

if (connectionString) {
    const isRemote = connectionString.includes('sslmode=require') || 
                     connectionString.includes('neon.tech') || 
                     connectionString.includes('supabase') ||
                     connectionString.includes('render.com');

    poolConfig = {
        connectionString,
        ssl: isRemote ? { rejectUnauthorized: false } : false
    };
} else {
    const isRemoteHost = (process.env.PGHOST || '').includes('supabase') ||
                         (process.env.PGHOST || '').includes('neon.tech') ||
                         (process.env.PGHOST || '').includes('render.com') ||
                         process.env.PGSSL === 'true';

    poolConfig = {
        host: process.env.PGHOST || 'localhost',
        port: parseInt(process.env.PGPORT || '5432', 10),
        user: process.env.PGUSER || 'postgres',
        password: process.env.PGPASSWORD || 'postgres',
        database: process.env.PGDATABASE || 'mobilestore_db',
        ssl: isRemoteHost ? { rejectUnauthorized: false } : false
    };
}

const realPool = new Pool({
    ...poolConfig,
    max: 20,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 3000
});

// State tracking
let isUsingFallback = false;
let memDbInstance = null;
let memPool = null;

function initInMemoryFallback() {
    if (memPool) return memPool;

    console.log('\n[PostgreSQL Fallback] Initializing in-memory PostgreSQL instance for local development/demo...');
    const { newDb } = require('pg-mem');
    memDbInstance = newDb();

    // Register uuid_generate_v4 on public schema with impure: true for multi-row inserts
    memDbInstance.public.registerFunction({
        name: 'uuid_generate_v4',
        returns: memDbInstance.public.getType('uuid'),
        impure: true,
        implementation: () => {
            return require('crypto').randomUUID();
        }
    });

    // Register round function
    memDbInstance.public.registerFunction({
        name: 'round',
        implementation: (val, decimals = 0) => {
            if (val === null || val === undefined) return 0;
            return Number(Number(val).toFixed(decimals || 0));
        }
    });

    try {
        const schemaPath = path.join(__dirname, '../database/pgmem_schema.sql');
        const seedsPath = path.join(__dirname, '../database/seeds.sql');

        const schemaSql = fs.readFileSync(schemaPath, 'utf8');
        memDbInstance.public.none(schemaSql);

        const seedsSql = fs.readFileSync(seedsPath, 'utf8')
            .replace(/ON CONFLICT \(id\) DO NOTHING;/g, ';');

        memDbInstance.public.none(seedsSql);

        const pgMock = memDbInstance.adapters.createPg();
        memPool = new pgMock.Pool();
        console.log('[PostgreSQL Fallback] In-memory PostgreSQL loaded successfully with schema & seeds.\n');
        return memPool;
    } catch (err) {
        console.error('[PostgreSQL Fallback] Failed to initialize in-memory database:', err);
        throw err;
    }
}

// Unified query executor
const query = async (text, params) => {
    if (isUsingFallback) {
        const poolInstance = initInMemoryFallback();
        return poolInstance.query(text, params);
    }

    try {
        return await realPool.query(text, params);
    } catch (err) {
        if (err.code === 'ECONNREFUSED' || err.code === 'ETIMEDOUT' || err.code === '28P01' || err.message.includes('connect')) {
            console.warn(`\n⚠️  [PostgreSQL Notice] Could not connect to real PostgreSQL at ${poolConfig.host || 'remote'}: ${err.message}`);
            console.warn(`👉 Switching seamlessly to in-memory PostgreSQL mode so you can continue building and testing without disruption!`);
            isUsingFallback = true;
            const poolInstance = initInMemoryFallback();
            return poolInstance.query(text, params);
        }
        throw err;
    }
};

const getClient = async () => {
    if (isUsingFallback) {
        const poolInstance = initInMemoryFallback();
        return poolInstance.connect();
    }

    try {
        return await realPool.connect();
    } catch (err) {
        if (err.code === 'ECONNREFUSED' || err.code === 'ETIMEDOUT' || err.message.includes('connect')) {
            isUsingFallback = true;
            const poolInstance = initInMemoryFallback();
            return poolInstance.connect();
        }
        throw err;
    }
};

module.exports = {
    pool: {
        query,
        connect: getClient,
        end: () => (isUsingFallback ? Promise.resolve() : realPool.end())
    },
    query,
    getClient
};
