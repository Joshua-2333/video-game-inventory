// testConsoles.js
const { pool } = require('./db/queries');

async function testConsoles() {
  try {
    // Get category ID for Consoles
    const categoryRes = await pool.query(
      'SELECT id, name FROM categories WHERE LOWER(name) = LOWER($1)',
      ['Consoles']
    );

    if (!categoryRes.rows[0]) {
      console.log('Consoles category not found.');
      return;
    }

    const categoryId = categoryRes.rows[0].id;
    console.log('Consoles category ID:', categoryId);

    // Get items in that category
    const itemsRes = await pool.query(`
      SELECT i.id, i.name, i.price, i.genre, i.item_condition,
             ARRAY_REMOVE(ARRAY_AGG(p.name), NULL) AS platforms
      FROM items i
      LEFT JOIN item_platforms ip ON i.id = ip.item_id
      LEFT JOIN platforms p ON ip.platform_id = p.id
      WHERE i.category_id = $1
      GROUP BY i.id
      ORDER BY i.name
    `, [categoryId]);

    if (itemsRes.rows.length === 0) {
      console.log('No items found in Consoles category.');
    } else {
      console.log('Items found in Consoles category:');
      console.table(itemsRes.rows);
    }

  } catch (err) {
    console.error('Error testing Consoles:', err);
  } finally {
    pool.end();
  }
}

testConsoles();
