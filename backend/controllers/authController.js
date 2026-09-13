const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { query } = require('../config/db');

const JWT_SECRET = process.env.JWT_SECRET || 'super_secret_jwt_key_university_mobile_store_2026';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

const generateToken = (user) => {
    return jwt.sign(
        { id: user.id, email: user.email, role: user.role },
        JWT_SECRET,
        { expiresIn: JWT_EXPIRES_IN }
    );
};

// POST /api/auth/register
const register = async (req, res, next) => {
    try {
        const { full_name, email, password, phone } = req.body;

        if (!full_name || !email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Please provide full name, email, and password.'
            });
        }

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid email address format.'
            });
        }

        if (password.length < 6) {
            return res.status(400).json({
                success: false,
                message: 'Password must be at least 6 characters.'
            });
        }

        // Check if user exists
        const userExists = await query('SELECT id FROM users WHERE email = $1', [email.toLowerCase()]);
        if (userExists.rowCount > 0) {
            return res.status(409).json({
                success: false,
                message: 'An account with this email already exists.'
            });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const password_hash = await bcrypt.hash(password, salt);

        // Insert new user
        const result = await query(
            `INSERT INTO users (full_name, email, password_hash, phone, role)
             VALUES ($1, $2, $3, $4, 'customer')
             RETURNING id, full_name, email, phone, role, created_at`,
            [full_name.trim(), email.toLowerCase().trim(), password_hash, phone || null]
        );

        const newUser = result.rows[0];
        const token = generateToken(newUser);

        res.status(201).json({
            success: true,
            message: 'Account registered successfully.',
            data: {
                user: newUser,
                token
            }
        });
    } catch (error) {
        next(error);
    }
};

// POST /api/auth/login
const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Please provide email and password.'
            });
        }

        const result = await query(
            'SELECT id, full_name, email, password_hash, phone, role, avatar_url FROM users WHERE email = $1',
            [email.toLowerCase().trim()]
        );

        if (result.rowCount === 0) {
            return res.status(401).json({
                success: false,
                message: 'Invalid email or password.'
            });
        }

        const user = result.rows[0];
        const isMatch = await bcrypt.compare(password, user.password_hash);

        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: 'Invalid email or password.'
            });
        }

        const token = generateToken(user);
        delete user.password_hash;

        res.json({
            success: true,
            message: 'Logged in successfully.',
            data: {
                user,
                token
            }
        });
    } catch (error) {
        next(error);
    }
};

// GET /api/auth/me
const getMe = async (req, res, next) => {
    try {
        const result = await query(
            `SELECT u.id, u.full_name, u.email, u.phone, u.role, u.avatar_url, u.created_at,
                    COALESCE(
                        (SELECT json_agg(a.*) FROM addresses a WHERE a.user_id = u.id), '[]'
                    ) AS addresses
             FROM users u
             WHERE u.id = $1`,
            [req.user.id]
        );

        if (result.rowCount === 0) {
            return res.status(404).json({
                success: false,
                message: 'User profile not found.'
            });
        }

        res.json({
            success: true,
            data: result.rows[0]
        });
    } catch (error) {
        next(error);
    }
};

// PUT /api/auth/profile
const updateProfile = async (req, res, next) => {
    try {
        const { full_name, phone, avatar_url } = req.body;

        const result = await query(
            `UPDATE users 
             SET full_name = COALESCE($1, full_name),
                 phone = COALESCE($2, phone),
                 avatar_url = COALESCE($3, avatar_url),
                 updated_at = CURRENT_TIMESTAMP
             WHERE id = $4
             RETURNING id, full_name, email, phone, role, avatar_url, updated_at`,
            [full_name, phone, avatar_url, req.user.id]
        );

        res.json({
            success: true,
            message: 'Profile updated successfully.',
            data: result.rows[0]
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    register,
    login,
    getMe,
    updateProfile
};
