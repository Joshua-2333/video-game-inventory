// db/queries.js
const pool = require('./pool');

// ===========================
// CATEGORY QUERIES
// ===========================

// Get all categories
const getAllCategories = async () => {
  const res = await pool.query('SELECT * FROM categories ORDER BY name');
  return res.rows;
};

// Get a single category by id
const getCategoryById = async (id) => {
  const res = await pool.query('SELECT * FROM categories WHERE id = $1', [id]);
  return res.rows[0];
};

// Create a new category
const insertCategory = async (name, description) => {
  const res = await pool.query(
    'INSERT INTO categories (name, description) VALUES ($1, $2) RETURNING *',
    [name, description]
  );
  return res.rows[0];
};

// Update a category
const updateCategory = async (id, name, description) => {
  const res = await pool.query(
    'UPDATE categories SET name=$1, description=$2 WHERE id=$3 RETURNING *',
    [name, description, id]
  );
  return res.rows[0];
};

// Delete a category
const deleteCategory = async (id) => {
  const res = await pool.query('DELETE FROM categories WHERE id=$1 RETURNING *', [id]);
  return res.rows[0];
};

// ===========================
// ITEM QUERIES
// ===========================

// Get all items in a category
const getItemsByCategory = async (categoryId) => {
  const res = await pool.query(
    'SELECT * FROM items WHERE category_id=$1 ORDER BY name',
    [categoryId]
  );
  return res.rows;
};

// Get a single item by id
const getItemById = async (id) => {
  const res = await pool.query('SELECT * FROM items WHERE id=$1', [id]);
  return res.rows[0];
};

// Create a new item
const insertItem = async (name, price, quantity, categoryId, platform, item_condition, release_date) => {
  const res = await pool.query(
    `INSERT INTO items
    (name, price, quantity, category_id, platform, item_condition, release_date)
    VALUES ($1, $2, $3, $4, $5, $6, $7)
    RETURNING *`,
    [name, price, quantity, categoryId, platform, item_condition, release_date]
  );
  return res.rows[0];
};

// Update an item
const updateItem = async (id, name, price, quantity, categoryId, platform, item_condition, release_date) => {
  const res = await pool.query(
    `UPDATE items SET
    name=$1, price=$2, quantity=$3, category_id=$4, platform=$5, item_condition=$6, release_date=$7
    WHERE id=$8 RETURNING *`,
    [name, price, quantity, categoryId, platform, item_condition, release_date, id]
  );
  return res.rows[0];
};

// Delete an item
const deleteItem = async (id) => {
  const res = await pool.query('DELETE FROM items WHERE id=$1 RETURNING *', [id]);
  return res.rows[0];
};

module.exports = {
  // Categories
  getAllCategories,
  getCategoryById,
  insertCategory,
  updateCategory,
  deleteCategory,
  // Items
  getItemsByCategory,
  getItemById,
  insertItem,
  updateItem,
  deleteItem,
};
