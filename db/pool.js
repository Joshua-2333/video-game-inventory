// db/pool.js
const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  user: process.env.DB_USER || 'josh2333',
  host: 'localhost',
  database: process.env.DB_NAME || 'video_game_inventory',
  password: process.env.DB_PASSWORD || 'Hunter_2333',
  port: 5432,
});

module.exports = pool;
