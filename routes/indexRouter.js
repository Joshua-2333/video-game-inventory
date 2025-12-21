const express = require('express');
const router = express.Router();
const { getAllCategories } = require('../db/queries');

router.get('/', async (req, res) => {
  try {
    const categories = await getAllCategories();

    res.render('layout', {
      content: 'index',
      categories
    });
  } catch (err) {
    console.error('ERROR in / route:', err);
    res.status(500).send('Server error');
  }
});

module.exports = router;
