// db/pool.js
const { Pool } = require('pg');
require('dotenv').config();

// Create a new Postgres pool using DATABASE_URL for production (Render)
// or fall back to local environment variables for development
const pool = new Pool({
  connectionString: process.env.DATABASE_URL || undefined,
  user: process.env.DB_USER || 'josh2333',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'video_game_inventory',
  password: process.env.DB_PASSWORD || 'Hunter_2333',
  port: process.env.DB_PORT || 5432,
  ssl: process.env.DATABASE_URL
    ? { rejectUnauthorized: false } // required for Render
    : false,
});

module.exports = pool;
