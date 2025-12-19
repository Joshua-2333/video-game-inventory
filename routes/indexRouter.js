const express = require('express');
const router = express.Router();
const { getAllCategories } = require('../db/queries');

router.get('/', async (req, res) => {
  try {
    const categories = await getAllCategories();
    res.render('index', { categories });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

module.exports = router;
