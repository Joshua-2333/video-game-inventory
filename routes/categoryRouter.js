// routes/categoryRouter.js
const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoryController');
const pool = require('../db/queries').pool;

// STANDARD CATEGORY ROUTES
router.get('/', categoryController.categoryList);
router.get('/new', categoryController.categoryCreateForm);
router.post('/new', categoryController.categoryCreate);
router.get('/:id/edit', categoryController.categoryEditForm);
router.post('/:id/edit', categoryController.categoryUpdate);
router.get('/:id', categoryController.categoryDetail);
router.post('/:id/delete', categoryController.categoryDelete);

// CUSTOM CATEGORY PAGES

// Games page with filters
router.get('/games', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT i.id, i.name, i.price, c.name as category_name,
        ARRAY_AGG(p.name) as platforms
      FROM items i
      JOIN categories c ON i.category_id = c.id
      LEFT JOIN item_platforms ip ON i.id = ip.item_id
      LEFT JOIN platforms p ON ip.platform_id = p.id
      GROUP BY i.id, c.name
      ORDER BY i.name
    `);

    const games = result.rows.map(game => ({
      ...game,
      platforms: game.platforms.filter(Boolean), // remove nulls
      genre: game.genre || 'Unknown',
      item_condition: game.item_condition || 'New'
    }));

    console.log(games); // <-- check server console

    res.render('categoryDetail', { category: { name: 'Games', description: 'All games' }, games });
  } catch (err) {
    console.error(err);
    res.send('Error loading games.');
  }
});

// Accessories page
router.get('/accessories', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT i.id, i.name, i.price, ARRAY_AGG(p.name) as platforms
      FROM items i
      JOIN categories c ON i.category_id = c.id
      LEFT JOIN item_platforms ip ON i.id = ip.item_id
      LEFT JOIN platforms p ON ip.platform_id = p.id
      WHERE c.name='Accessories'
      GROUP BY i.id
      ORDER BY i.name
    `);
    res.render('categories/categoryList', { items: result.rows, categoryName: 'Accessories' });
  } catch (err) {
    console.error(err);
    res.send('Error loading accessories.');
  }
});

// Consoles page
router.get('/consoles', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT i.id, i.name, i.price, ARRAY_AGG(p.name) as platforms
      FROM items i
      JOIN categories c ON i.category_id = c.id
      LEFT JOIN item_platforms ip ON i.id = ip.item_id
      LEFT JOIN platforms p ON ip.platform_id = p.id
      WHERE c.name='Consoles'
      GROUP BY i.id
      ORDER BY i.name
    `);
    res.render('categories/categoryList', { items: result.rows, categoryName: 'Consoles' });
  } catch (err) {
    console.error(err);
    res.send('Error loading consoles.');
  }
});

module.exports = router;
