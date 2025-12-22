// controllers/categoryController.js
const {
  getAllCategories,
  getCategoryById,
  getItemsByCategory,
  insertCategory,
  updateCategory,
  deleteCategory,
} = require('../db/queries');

// List all categories
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

// Category detail page
exports.categoryDetail = async (req, res) => {
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
    console.error('ERROR in category detail:', err);
    res.status(500).send('Server error');
  }
};

// Show create category form
exports.categoryCreateForm = (req, res) => {
  res.render('layout', {
    content: 'categories/categoryForm',
    category: null,
  });
};

// Handle create category
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

// Show edit category form
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

// Handle update category
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

// Handle delete category
exports.categoryDelete = async (req, res) => {
  try {
    const { admin_password } = req.body;

    // Admin password validation
    if (admin_password !== process.env.ADMIN_PASSWORD) {
      return res.status(403).send('Invalid admin password');
    }

    const categoryId = req.params.id;
    const items = await getItemsByCategory(categoryId);

    if (items.length > 0) {
      return res
        .status(400)
        .send('Cannot delete category with items. Delete the items first.');
    }

    await deleteCategory(categoryId);
    res.redirect('/categories');
  } catch (err) {
    console.error('ERROR deleting category:', err);
    res.status(500).send('Server error');
  }
};
