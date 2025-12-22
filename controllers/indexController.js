// controllers/indexController.js
const { getAllCategories } = require('../db/queries');

exports.index = async (req, res) => {
  try {
    const categories = await getAllCategories();

    res.render('layout', {
      content: 'index',
      categories,
    });
  } catch (err) {
    console.error('ERROR loading homepage:', err);
    res.status(500).send('Server error');
  }
};
