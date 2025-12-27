// controllers/categoryController.js
const {
  getAllCategories,
  getCategoryById,
  getItemsByCategory,
  insertCategory,
  updateCategory,
  deleteCategory,
} = require('../db/queries');

/**
 * LIST ALL CATEGORIES
 * GET /categories
 */
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

/**
 * CATEGORY DETAIL
 * GET /categories/:id
 */
exports.categoryDetail = async (req, res) => {
  try {
    const categoryId = req.params.id;

    const category = await getCategoryById(categoryId);
    if (!category) {
      return res.status(404).send('Category not found');
    }

    const items = await getItemsByCategory(categoryId);

    // Always render category detail, even if empty
    res.render('layout', {
      content: 'categories/categoryDetail',
      category,
      items: items || [],
    });
  } catch (err) {
    console.error('ERROR loading category detail:', err);
    res.status(500).send('Server error');
  }
};

/**
 * CREATE CATEGORY (FORM)
 * GET /categories/new
 */
exports.categoryCreateForm = (req, res) => {
  res.render('layout', {
    content: 'categories/categoryForm',
    category: null,
  });
};

/**
 * CREATE CATEGORY (POST)
 * POST /categories/new
 */
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

/**
 * EDIT CATEGORY (FORM)
 * GET /categories/:id/edit
 */
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

/**
 * UPDATE CATEGORY
 * POST /categories/:id/edit
 */
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

/**
 * DELETE CATEGORY
 * POST /categories/:id/delete
 */
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
