// routes/categoryRouter.js
const express = require('express');
const router = express.Router();
const { pool } = require('../db/queries');
const categoryController = require('../controllers/categoryController');

// ------------------------
// HELPER FUNCTION TO FETCH ITEMS FOR VIRTUAL CATEGORIES
// ------------------------
async function getItemsByCategoryName(categoryName) {
  const result = await pool.query(`
    SELECT i.id, i.name, i.price, i.genre, i.item_condition,
           ARRAY_AGG(p.name) FILTER (WHERE p.name IS NOT NULL) AS platforms
    FROM items i
    JOIN categories c ON i.category_id = c.id
    LEFT JOIN item_platforms ip ON i.id = ip.item_id
    LEFT JOIN platforms p ON ip.platform_id = p.id
    WHERE c.name = $1
    GROUP BY i.id
    ORDER BY i.name
  `, [categoryName]);

  return result.rows.map(item => ({
    ...item,
    platforms: item.platforms || [],
    genre: item.genre || 'Unknown',
    item_condition: item.item_condition || 'New',
    price: item.price || 0
  }));
}

// ------------------------
// VIRTUAL CATEGORY ROUTES
// Must be ABOVE the wildcard route
// ------------------------

// Games page
router.get('/games', async (req, res) => {
  try {
    const gameCategoryNames = ['RPG', 'Action', 'Sports', 'Adventure', 'Shooter', 'Strategy'];

    // Get IDs of game categories
    const categoryIdsResult = await pool.query(
      `SELECT id FROM categories WHERE name = ANY($1)`,
      [gameCategoryNames]
    );
    const categoryIds = categoryIdsResult.rows.map(r => r.id);

    let items = [];
    for (const catId of categoryIds) {
      const resQuery = await pool.query(`
        SELECT i.id, i.name, i.price, i.genre, i.item_condition,
               ARRAY_AGG(p.name) FILTER (WHERE p.name IS NOT NULL) AS platforms
        FROM items i
        LEFT JOIN item_platforms ip ON i.id = ip.item_id
        LEFT JOIN platforms p ON ip.platform_id = p.id
        WHERE i.category_id = $1
        GROUP BY i.id
        ORDER BY i.name
      `, [catId]);
      items = items.concat(resQuery.rows.map(item => ({
        ...item,
        platforms: item.platforms || [],
        genre: item.genre || 'Unknown',
        item_condition: item.item_condition || 'New',
        price: item.price || 0
      })));
    }

    res.render('layout', {
      content: 'categories/categoryDetail',
      category: null,
      categoryName: 'Games',
      items
    });
  } catch (err) {
    console.error(err);
    res.status(500).send('Error loading games.');
  }
});

// Consoles page
router.get('/consoles', async (req, res) => {
  try {
    const items = await getItemsByCategoryName('Consoles');
    res.render('layout', {
      content: 'categories/categoryDetail',
      category: null,
      categoryName: 'Consoles',
      items
    });
  } catch (err) {
    console.error(err);
    res.status(500).send('Error loading consoles.');
  }
});

// Accessories page
router.get('/accessories', async (req, res) => {
  try {
    const items = await getItemsByCategoryName('Accessories');
    res.render('layout', {
      content: 'categories/categoryDetail',
      category: null,
      categoryName: 'Accessories',
      items
    });
  } catch (err) {
    console.error(err);
    res.status(500).send('Error loading accessories.');
  }
});

// ------------------------
// STANDARD CATEGORY ROUTES
// Must be AFTER virtual category routes
// ------------------------
router.get('/', categoryController.categoryList);
router.get('/new', categoryController.categoryCreateForm);
router.post('/new', categoryController.categoryCreate);
router.get('/:id/edit', categoryController.categoryEditForm);
router.post('/:id/edit', categoryController.categoryUpdate);
router.get('/:id', categoryController.categoryDetail);
router.post('/:id/delete', categoryController.categoryDelete);

module.exports = router;
