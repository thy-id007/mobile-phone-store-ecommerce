const fs = require('fs');
const path = require('path');
const { Client } = require('pg');
const dotenv = require('dotenv');

dotenv.config();

async function createDatabaseIfNotExists() {
    // Only attempt auto-create if using local individual connection parameters
    if (process.env.DATABASE_URL) return;

    const targetDb = process.env.PGDATABASE || 'mobilestore_db';
    const maintenanceClient = new Client({
        host: process.env.PGHOST || 'localhost',
        port: parseInt(process.env.PGPORT || '5432', 10),
        user: process.env.PGUSER || 'postgres',
        password: process.env.PGPASSWORD || 'postgres',
        database: 'postgres', // default maintenance db
    });

    try {
        await maintenanceClient.connect();
        const checkDb = await maintenanceClient.query(
            `SELECT 1 FROM pg_database WHERE datname = $1`,
            [targetDb]
        );

        if (checkDb.rowCount === 0) {
            console.log(`Database "${targetDb}" does not exist. Creating...`);
            await maintenanceClient.query(`CREATE DATABASE "${targetDb}"`);
            console.log(`Database "${targetDb}" created successfully.`);
        } else {
            console.log(`Database "${targetDb}" already exists.`);
        }
    } catch (err) {
        console.warn(`Could not connect to maintenance database "postgres": ${err.message}`);
        console.warn(`Proceeding to connect directly to "${targetDb}"...`);
    } finally {
        await maintenanceClient.end().catch(() => {});
    }
}

async function runMigrations() {
    console.log('--- Initializing Mobile Phone Store Database ---');
    await createDatabaseIfNotExists();

    const { pool } = require('../config/db');

    try {
        const client = await pool.connect();
        console.log('Connected to PostgreSQL successfully.');

        const schemaPath = path.join(__dirname, 'schema.sql');
        const seedsPath = path.join(__dirname, 'seeds.sql');

        console.log('Executing schema.sql...');
        const schemaSql = fs.readFileSync(schemaPath, 'utf8');
        await client.query(schemaSql);
        console.log('Schema tables created successfully.');

        console.log('Executing seeds.sql...');
        const seedsSql = fs.readFileSync(seedsPath, 'utf8');
        await client.query(seedsSql);
        console.log('Seed data inserted successfully.');

        // Quick verification summary
        const userCount = await client.query('SELECT COUNT(*) FROM users');
        const productCount = await client.query('SELECT COUNT(*) FROM products');
        const variantCount = await client.query('SELECT COUNT(*) FROM product_variants');

        console.log('\n--- Database Stats ---');
        console.log(`Users: ${userCount.rows[0].count}`);
        console.log(`Products: ${productCount.rows[0].count}`);
        console.log(`Variants: ${variantCount.rows[0].count}`);
        console.log('------------------------\n');

        client.release();
        await pool.end();
        console.log('Database initialization completed successfully!');
    } catch (error) {
        console.error('Database initialization failed:');
        console.error(error.message);
        console.log('\nTroubleshooting Checklist:');
        console.log('1. Is PostgreSQL installed and running?');
        console.log('2. Check your backend/.env settings (PGHOST, PGPORT, PGUSER, PGPASSWORD, PGDATABASE).');
        console.log('3. Or supply a DATABASE_URL from a free cloud provider (e.g. Supabase, Neon).');
        process.exit(1);
    }
}

runMigrations();
