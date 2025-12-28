// controllers/indexController.js
const { getAllCategories } = require('../db/queries');

exports.index = async (req, res) => {
  try {
    // Only show the main homepage blocks
    const homepageCategories = ['Accessories', 'Consoles', 'Games'];

    // Fetch all categories from DB
    const categories = await getAllCategories();

    // Filter to show only the main homepage categories
    const filteredCategories = categories.filter(cat =>
      homepageCategories.includes(cat.name)
    );

    // Render homepage with filtered categories
    res.render('layout', {
      content: 'index',  // This assumes your layout checks content === 'index'
      categories: filteredCategories,
    });
  } catch (err) {
    console.error('ERROR loading homepage:', err);
    res.status(500).send('Server error loading homepage');
  }
};
