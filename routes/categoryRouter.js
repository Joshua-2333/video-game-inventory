// routes/categoryRouter.js
const express = require('express');
const router = express.Router();

const {
  getAllCategories,
  getCategoryById,
  getItemsByCategory,
  insertCategory,
  updateCategory,
  deleteCategory,
} = require('../db/queries');

//LIST ALL CATEGORIES
router.get('/', async (req, res) => {
  try {
    const categories = await getAllCategories();

    res.render('layout', {
      content: 'categories/categoryList',
      categories,
    });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

//SHOW CREATE CATEGORY FORM
router.get('/new', (req, res) => {
  res.render('layout', {
    content: 'categories/categoryForm',
    category: null,
  });
});

//HANDLE CREATE CATEGORY
router.post('/new', async (req, res) => {
  try {
    const { name, description } = req.body;
    await insertCategory(name, description);
    res.redirect('/categories');
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

//SHOW EDIT CATEGORY FORM
router.get('/:id/edit', async (req, res) => {
  try {
    const category = await getCategoryById(req.params.id);

    if (!category) {
      return res.status(404).send('Category not found');
    }

    res.render('layout', {
      content: 'categories/categoryForm',
      category,
    });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

//HANDLE UPDATE CATEGORY
router.post('/:id/edit', async (req, res) => {
  try {
    const { name, description } = req.body;
    await updateCategory(req.params.id, name, description);
    res.redirect(`/categories/${req.params.id}`);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

// CATEGORY DETAIL PAGE
router.get('/:id', async (req, res) => {
  try {
    const categoryId = req.params.id;

    const category = await getCategoryById(categoryId);
    const items = await getItemsByCategory(categoryId);

    if (!category) {
      return res.status(404).send('Category not found');
    }

    res.render('layout', {
      content: 'categories/categoryDetail',
      category,
      items,
    });
  } catch (err) {
    console.error('ERROR in category detail route:', err);
    res.status(500).send('Server error');
  }
});

module.exports = router;
