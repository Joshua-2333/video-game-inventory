// controllers/categoryController.js
const {
  getAllCategories,
  getCategoryById,
  getItemsByCategory,
  insertCategory,
  updateCategory,
  deleteCategory,
  getAllGamesWithPlatforms,
} = require('../db/queries');

//LIST ALL CATEGORIES
exports.categoryList = async (req, res) => {
  try {
    const categories = await getAllCategories();

    res.render('layout', {
      content: 'categories/categoryList',
      categories,
    });
  } catch (err) {
    console.error('ERROR loading categories:', err);
    res.status(500).send('Server error');
  }
};

//CATEGORY DETAIL
exports.categoryDetail = async (req, res) => {
  try {
    const categoryId = req.params.id;
    const category = await getCategoryById(categoryId);

    if (!category) {
      return res.status(404).send('Category not found');
    }

    // If this category is "Games", render the special filtered page
    if (category.name === 'Games') {
      const games = await getAllGamesWithPlatforms(categoryId);

      return res.render('layout', {
        content: 'games', // renders views/games.ejs
        games,
      });
    }

    // Otherwise, render normal category detail
    const items = await getItemsByCategory(categoryId);

    res.render('layout', {
      content: 'categories/categoryDetail',
      category,
      items,
    });
  } catch (err) {
    console.error('ERROR in category detail:', err);
    res.status(500).send('Server error');
  }
};

//CREATE CATEGORY
exports.categoryCreateForm = (req, res) => {
  res.render('layout', {
    content: 'categories/categoryForm',
    category: null,
  });
};

exports.categoryCreate = async (req, res) => {
  try {
    const { name, description } = req.body;
    await insertCategory(name, description);
    res.redirect('/categories');
  } catch (err) {
    console.error('ERROR creating category:', err);
    res.status(500).send('Server error');
  }
};

//EDIT CATEGORY
exports.categoryEditForm = async (req, res) => {
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
    console.error('ERROR showing edit form:', err);
    res.status(500).send('Server error');
  }
};

exports.categoryUpdate = async (req, res) => {
  try {
    const { name, description } = req.body;
    await updateCategory(req.params.id, name, description);
    res.redirect(`/categories/${req.params.id}`);
  } catch (err) {
    console.error('ERROR updating category:', err);
    res.status(500).send('Server error');
  }
};

// DELETE CATEGORY
exports.categoryDelete = async (req, res) => {
  try {
    const { admin_password } = req.body;

    if (admin_password !== process.env.ADMIN_PASSWORD) {
      return res.status(403).send('Invalid admin password');
    }

    const categoryId = req.params.id;
    const items = await getItemsByCategory(categoryId);

    if (items.length > 0) {
      return res.status(400).send(
        'Cannot delete category with items. Delete items first or move them.'
      );
    }

    await deleteCategory(categoryId);
    res.redirect('/categories');
  } catch (err) {
    console.error('ERROR deleting category:', err);
    res.status(500).send('Server error');
  }
};
