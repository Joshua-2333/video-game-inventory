// test-db.js
const pool = require('./db/pool');

(async () => {
  try {
    const res = await pool.query('SELECT NOW()');
    console.log('Database connected:', res.rows[0]);
  } catch (err) {
    console.error('Database connection error:', err);
  } finally {
    pool.end();
  }
})();
