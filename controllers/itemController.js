// controllers/itemController.js
const {
  getItemById,
  getAllCategories,
  insertItem,
  updateItem,
  deleteItem,
} = require('../db/queries');

// Show create item form
exports.itemCreateForm = async (req, res) => {
  try {
    const categoryId = req.params.categoryId;
    const categories = await getAllCategories();

    res.render('layout', {
      content: 'items/itemForm',
      item: null,
      categories,
      selectedCategoryId: categoryId,
    });
  } catch (err) {
    console.error('ERROR showing item create form:', err);
    res.status(500).send('Server error');
  }
};

// Handle create item
exports.itemCreate = async (req, res) => {
  try {
    const {
      name,
      price,
      quantity,
      category_id,
      platform,
      item_condition,
      release_date,
    } = req.body;

    await insertItem(
      name,
      price,
      quantity,
      category_id,
      platform,
      item_condition,
      release_date
    );

    res.redirect(`/categories/${category_id}`);
  } catch (err) {
    console.error('ERROR creating item:', err);
    res.status(500).send('Server error');
  }
};

// Show edit item form
exports.itemEditForm = async (req, res) => {
  try {
    const item = await getItemById(req.params.id);
    const categories = await getAllCategories();

    if (!item) return res.status(404).send('Item not found');

    res.render('layout', {
      content: 'items/itemForm',
      item,
      categories,
      selectedCategoryId: item.category_id,
    });
  } catch (err) {
    console.error('ERROR showing item edit form:', err);
    res.status(500).send('Server error');
  }
};

// Handle update item
exports.itemUpdate = async (req, res) => {
  try {
    const {
      name,
      price,
      quantity,
      category_id,
      platform,
      item_condition,
      release_date,
    } = req.body;

    await updateItem(
      req.params.id,
      name,
      price,
      quantity,
      category_id,
      platform,
      item_condition,
      release_date
    );

    res.redirect(`/categories/${category_id}`);
  } catch (err) {
    console.error('ERROR updating item:', err);
    res.status(500).send('Server error');
  }
};

// Item detail page
exports.itemDetail = async (req, res) => {
  try {
    const item = await getItemById(req.params.id);
    if (!item) return res.status(404).send('Item not found');

    res.render('layout', {
      content: 'items/itemDetail',
      item,
    });
  } catch (err) {
    console.error('ERROR in item detail:', err);
    res.status(500).send('Server error');
  }
};

// Handle delete item
exports.itemDelete = async (req, res) => {
  try {
    const { admin_password } = req.body;

    // Admin password validation
    if (admin_password !== process.env.ADMIN_PASSWORD) {
      return res.status(403).send('Invalid admin password');
    }

    const item = await getItemById(req.params.id);
    if (!item) return res.status(404).send('Item not found');

    await deleteItem(req.params.id);
    res.redirect(`/categories/${item.category_id}`);
  } catch (err) {
    console.error('ERROR deleting item:', err);
    res.status(500).send('Server error');
  }
};
