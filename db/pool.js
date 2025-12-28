// db/pool.js
const { Pool } = require('pg');
require('dotenv').config();

let pool;

if (process.env.DATABASE_URL) {
  // Render or production environment
  pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }, // required for Render Postgres
  });
} else {
  // Local development
  pool = new Pool({
    user: process.env.DB_USER || 'josh2333',
    host: process.env.DB_HOST || 'localhost',
    database: process.env.DB_NAME || 'video_game_inventory',
    password: process.env.DB_PASSWORD || 'Hunter_2333',
    port: process.env.DB_PORT || 5432,
  });
}

module.exports = pool;
