// db/pool.js
const { Pool } = require('pg');
require('dotenv').config();

// Use DATABASE_URL if provided (Render provides this), otherwise use local credentials
const pool = new Pool({
  connectionString: process.env.DATABASE_URL || undefined,
  user: process.env.DB_USER || 'josh2333',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'video_game_inventory',
  password: process.env.DB_PASSWORD || 'Hunter_2333',
  port: process.env.DB_PORT || 5432,
  ssl: process.env.DATABASE_URL ? { rejectUnauthorized: false } : false, // Required for Render Postgres
});

module.exports = pool;
