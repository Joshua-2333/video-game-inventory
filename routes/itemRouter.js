// routes/itemRouter.js
const express = require('express');
const router = express.Router();

const {
  getItemById,
  getItemsByCategory,
  insertItem,
  updateItem,
  deleteItem,
  getAllCategories,
} = require('../db/queries');

// SHOW CREATE ITEM FORM
router.get('/new/:categoryId', async (req, res) => {
  try {
    const categoryId = req.params.categoryId;
    const categories = await getAllCategories();

    res.render('layout', {
      content: 'items/itemForm',
      item: null,
      categories,
      selectedCategoryId: categoryId,
    });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

// HANDLE CREATE ITEM
router.post('/new', async (req, res) => {
  try {
    const {
      name,
      price,
      quantity,
      category_id,
      platform,
      item_condition,
      release_date,
    } = req.body;

    await insertItem(
      name,
      price,
      quantity,
      category_id,
      platform,
      item_condition,
      release_date
    );

    res.redirect(`/categories/${category_id}`);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

// SHOW EDIT ITEM FORM
router.get('/:id/edit', async (req, res) => {
  try {
    const item = await getItemById(req.params.id);
    const categories = await getAllCategories();

    if (!item) return res.status(404).send('Item not found');

    res.render('layout', {
      content: 'items/itemForm',
      item,
      categories,
      selectedCategoryId: item.category_id,
    });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

// HANDLE UPDATE ITEM
router.post('/:id/edit', async (req, res) => {
  try {
    const {
      name,
      price,
      quantity,
      category_id,
      platform,
      item_condition,
      release_date,
    } = req.body;

    await updateItem(
      req.params.id,
      name,
      price,
      quantity,
      category_id,
      platform,
      item_condition,
      release_date
    );

    res.redirect(`/categories/${category_id}`);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

// ITEM DETAIL PAGE
router.get('/:id', async (req, res) => {
  try {
    const item = await getItemById(req.params.id);
    if (!item) return res.status(404).send('Item not found');

    res.render('layout', {
      content: 'items/itemDetail',
      item,
    });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

// DELETE ITEM
router.post('/:id/delete', async (req, res) => {
  try {
    const item = await getItemById(req.params.id);
    if (!item) return res.status(404).send('Item not found');

    await deleteItem(req.params.id);
    res.redirect(`/categories/${item.category_id}`);
  } catch (err) {
    console.error('ERROR deleting item:', err);
    res.status(500).send('Server error');
  }
});

module.exports = router;
