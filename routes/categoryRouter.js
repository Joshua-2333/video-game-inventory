const express = require('express');
const router = express.Router();
const { getCategoryById, getItemsByCategory } = require('../db/queries');

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
      items
    });
  } catch (err) {
    console.error('ERROR in category detail route:', err);
    res.status(500).send('Server error');
  }
});

module.exports = router;
