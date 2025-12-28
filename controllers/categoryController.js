// controllers/categoryController.js
const {
  getAllCategories,
  getCategoryById,
  getItemsByCategory,
  insertCategory,
  updateCategory,
  deleteCategory,
  pool
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
    res.status(500).render('500', { message: 'Server error', error: err });
  }
};

// Show a single category or virtual category (Games/Consoles) with items
exports.categoryDetail = async (req, res) => {
  try {
    const categoryId = req.params.id;

    let items = [];
    let category = null;
    let categoryName = '';

    const allCategories = await getAllCategories();
    const gameCategoryNames = ['RPG', 'Action', 'Sports', 'Adventure', 'Shooter', 'Strategy'];

    if (categoryId === 'games') {
      // Virtual "Games" category: aggregate items from all game-related categories
      const gameCategoryIds = allCategories
        .filter(c => gameCategoryNames.includes(c.name))
        .map(c => c.id);

      for (const catId of gameCategoryIds) {
        const catItems = await getItemsByCategory(catId);
        items = items.concat(catItems);
      }
      categoryName = 'Games';

    } else if (categoryId === 'consoles') {
      // Consoles category: explicitly fetch items in category id = 2
      category = await getCategoryById(2);
      if (!category) return res.status(404).render('404', { message: 'Category not found' });

      // Query to get items only in the consoles category (id=2) with their platforms
      const resQuery = await pool.query(`
        SELECT i.id, i.name, i.price, i.genre, i.item_condition,
               ARRAY_AGG(p.name) FILTER (WHERE p.name IS NOT NULL) AS platforms
        FROM items i
        LEFT JOIN item_platforms ip ON i.id = ip.item_id
        LEFT JOIN platforms p ON ip.platform_id = p.id
        WHERE i.category_id = $1
        GROUP BY i.id
        ORDER BY i.name
      `, [2]);

      items = resQuery.rows;
      categoryName = category.name;

    } else {
      // Normal category by numeric ID
      category = await getCategoryById(categoryId);
      if (!category) {
        return res.status(404).render('404', { message: 'Category not found' });
      }
      items = await getItemsByCategory(categoryId);
      categoryName = category.name;
    }

    // Normalize items
    items = items.map(item => ({
      ...item,
      genre: item.genre || 'Unknown',
      platforms: Array.isArray(item.platforms) ? item.platforms : [],
      price: item.price || 0,
      item_condition: item.item_condition || 'New',
    }));

    // Render layout
    res.render('layout', {
      content: 'categories/categoryDetail',
      category,
      categoryName,
      items,
    });

  } catch (err) {
    console.error('Error loading category detail:', err);
    res.status(500).render('500', { message: 'Server error', error: err });
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
    res.status(500).render('500', { message: 'Server error', error: err });
  }
};

// Show edit form
exports.categoryEditForm = async (req, res) => {
  try {
    const category = await getCategoryById(req.params.id);
    if (!category) return res.status(404).render('404', { message: 'Category not found' });

    res.render('layout', {
      content: 'categories/categoryForm',
      category,
    });
  } catch (err) {
    console.error('Error showing edit form:', err);
    res.status(500).render('500', { message: 'Server error', error: err });
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
    res.status(500).render('500', { message: 'Server error', error: err });
  }
};

// Delete a category
exports.categoryDelete = async (req, res) => {
  try {
    const { admin_password } = req.body;
    if (admin_password !== process.env.ADMIN_PASSWORD) {
      return res.status(403).render('500', { message: 'Invalid admin password' });
    }

    const categoryId = req.params.id;
    const items = await getItemsByCategory(categoryId);
    if (items.length > 0) {
      return res.status(400).render('500', { message: 'Cannot delete category with items. Delete items first or move them.' });
    }

    await deleteCategory(categoryId);
    res.redirect('/categories');
  } catch (err) {
    console.error('Error deleting category:', err);
    res.status(500).render('500', { message: 'Server error', error: err });
  }
};
