// routes/categoryRouter.js
const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoryController');
const pool = require('../db/queries').pool;

//STANDARD CATEGORY ROUTES
// List all categories
router.get('/', categoryController.categoryList);

// Show create category form
router.get('/new', categoryController.categoryCreateForm);

// Handle create category
router.post('/new', categoryController.categoryCreate);

// Show edit category form
router.get('/:id/edit', categoryController.categoryEditForm);

// Handle update category
router.post('/:id/edit', categoryController.categoryUpdate);

// Category detail page
router.get('/:id', categoryController.categoryDetail);

// Handle delete category (with admin password protection)
router.post('/:id/delete', categoryController.categoryDelete);

//CUSTOM CATEGORY PAGES
// Games page with filters
router.get('/games', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT i.id, i.name, i.price, c.name as category_name,
        ARRAY_AGG(p.name) as platforms
      FROM items i
      JOIN categories c ON i.category_id = c.id
      JOIN item_platforms ip ON i.id = ip.item_id
      JOIN platforms p ON ip.platform_id = p.id
      GROUP BY i.id, c.name
      ORDER BY i.name
    `);
    res.render('games', { games: result.rows });
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
      JOIN item_platforms ip ON i.id = ip.item_id
      JOIN platforms p ON ip.platform_id = p.id
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
      JOIN item_platforms ip ON i.id = ip.item_id
      JOIN platforms p ON ip.platform_id = p.id
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
