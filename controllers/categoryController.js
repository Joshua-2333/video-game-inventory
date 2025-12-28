// controllers/categoryController.js
const {
  getAllCategories,
  getCategoryById,
  getItemsByCategory,
  insertCategory,
  updateCategory,
  deleteCategory,
} = require('../db/queries');

// Show all categories
exports.categoryList = async (req, res) => {
  try {
    const categories = await getAllCategories();
    res.render('layout', {
      content: 'categories/categoryList',
      categories,
    });
  } catch (err) {
    console.error('Error loading categories:', err);
    res.status(500).send('Server error');
  }
};

// Show a single category and its items
exports.categoryDetail = async (req, res) => {
  try {
    const categoryId = req.params.id;
    const category = await getCategoryById(categoryId);
    if (!category) return res.status(404).send('Category not found');

    let items = await getItemsByCategory(categoryId);
    items = items || [];

    // For Games, normalize items for dropdown filtering
    if (category.name === 'Games') {
      items = items.map(item => ({
        ...item,
        genre: item.genre || 'Unknown',
        platforms: Array.isArray(item.platforms) ? item.platforms : [],
        price: item.price || 0,
        item_condition: item.item_condition || 'New',
      }));

      return res.render('layout', {
        content: 'categories/categoryDetail',
        category,
        items,   // send all games
      });
    }

    // All other categories
    res.render('layout', {
      content: 'categories/categoryDetail',
      category,
      items,
    });

  } catch (err) {
    console.error('Error loading category detail:', err);
    res.status(500).send('Server error');
  }
};

// Show new category form
exports.categoryCreateForm = (req, res) => {
  res.render('layout', {
    content: 'categories/categoryForm',
    category: null,
  });
};

// Create a category
exports.categoryCreate = async (req, res) => {
  try {
    const { name, description } = req.body;
    await insertCategory(name, description);
    res.redirect('/categories');
  } catch (err) {
    console.error('Error creating category:', err);
    res.status(500).send('Server error');
  }
};

// Show edit form
exports.categoryEditForm = async (req, res) => {
  try {
    const category = await getCategoryById(req.params.id);
    if (!category) return res.status(404).send('Category not found');

    res.render('layout', {
      content: 'categories/categoryForm',
      category,
    });
  } catch (err) {
    console.error('Error showing edit form:', err);
    res.status(500).send('Server error');
  }
};

// Update a category
exports.categoryUpdate = async (req, res) => {
  try {
    const { name, description } = req.body;
    await updateCategory(req.params.id, name, description);
    res.redirect(`/categories/${req.params.id}`);
  } catch (err) {
    console.error('Error updating category:', err);
    res.status(500).send('Server error');
  }
};

// Delete a category
exports.categoryDelete = async (req, res) => {
  try {
    const { admin_password } = req.body;
    if (admin_password !== process.env.ADMIN_PASSWORD) {
      return res.status(403).send('Invalid admin password');
    }

    const categoryId = req.params.id;
    const items = await getItemsByCategory(categoryId);
    if (items.length > 0) {
      return res.status(400).send('Cannot delete category with items. Delete items first or move them.');
    }

    await deleteCategory(categoryId);
    res.redirect('/categories');
  } catch (err) {
    console.error('Error deleting category:', err);
    res.status(500).send('Server error');
  }
};
