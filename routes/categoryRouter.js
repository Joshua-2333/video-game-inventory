const express = require('express');
const router = express.Router();
const { getCategoryById, getItemsByCategory } = require('../db/queries');

router.get('/:id', async (req, res) => {
  try {
    const category = await getCategoryById(req.params.id);
    const items = await getItemsByCategory(req.params.id);
    res.render('categories/show', { category, items });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

module.exports = router;
