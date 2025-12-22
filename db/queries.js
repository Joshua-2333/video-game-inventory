//db/queries.js
const pool = require('./pool');

//CATEGORY QUERIES
// Get all categories
const getAllCategories = async () => {
  const res = await pool.query('SELECT * FROM categories ORDER BY name');
  return res.rows;
};

// Get a single category by id
const getCategoryById = async (id) => {
  const res = await pool.query(
    'SELECT * FROM categories WHERE id = $1',
    [id]
  );
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
  const res = await pool.query(
    'DELETE FROM categories WHERE id=$1 RETURNING *',
    [id]
  );
  return res.rows[0];
};

//ITEM QUERIES
// Get all items in a category (with platforms)
const getItemsByCategory = async (categoryId) => {
  const res = await pool.query(
    `
    SELECT
      i.*,
      ARRAY_AGG(p.name) FILTER (WHERE p.name IS NOT NULL) AS platforms
    FROM items i
    LEFT JOIN item_platforms ip ON i.id = ip.item_id
    LEFT JOIN platforms p ON ip.platform_id = p.id
    WHERE i.category_id = $1
    GROUP BY i.id
    ORDER BY i.name
    `,
    [categoryId]
  );
  return res.rows;
};

// Get a single item by id (with platforms)
const getItemById = async (id) => {
  const res = await pool.query(
    `
    SELECT
      i.*,
      ARRAY_AGG(p.name) FILTER (WHERE p.name IS NOT NULL) AS platforms
    FROM items i
    LEFT JOIN item_platforms ip ON i.id = ip.item_id
    LEFT JOIN platforms p ON ip.platform_id = p.id
    WHERE i.id = $1
    GROUP BY i.id
    `,
    [id]
  );
  return res.rows[0];
};

// Create a new item
const insertItem = async (
  name,
  price,
  quantity,
  categoryId,
  item_condition,
  release_date,
  genre 
) => {
  const res = await pool.query(
    `
    INSERT INTO items
      (name, price, quantity, category_id, item_condition, release_date, genre)
    VALUES ($1, $2, $3, $4, $5, $6, $7)
    RETURNING *
    `,
    [name, price, quantity, categoryId, item_condition, release_date, genre]
  );
  return res.rows[0];
};

// Update an item
const updateItem = async (
  id,
  name,
  price,
  quantity,
  categoryId,
  item_condition,
  release_date,
  genre 
) => {
  const res = await pool.query(
    `
    UPDATE items SET
      name=$1,
      price=$2,
      quantity=$3,
      category_id=$4,
      item_condition=$5,
      release_date=$6,
      genre=$7
    WHERE id=$8
    RETURNING *
    `,
    [name, price, quantity, categoryId, item_condition, release_date, genre, id]
  );
  return res.rows[0];
};

// Delete an item
const deleteItem = async (id) => {
  const res = await pool.query(
    'DELETE FROM items WHERE id=$1 RETURNING *',
    [id]
  );
  return res.rows[0];
};

//PLATFORM QUERIES
// Get platform id by name
const getPlatformId = async (name) => {
  const res = await pool.query(
    'SELECT id FROM platforms WHERE name=$1',
    [name]
  );
  return res.rows[0] ? res.rows[0].id : null;
};

// Link item to platform
const insertItemPlatform = async (itemId, platformId) => {
  const res = await pool.query(
    `
    INSERT INTO item_platforms (item_id, platform_id)
    VALUES ($1, $2)
    RETURNING *
    `,
    [itemId, platformId]
  );
  return res.rows[0];
};

//COMBINED QUERIES
// Get all games in a category (with platforms)
const getAllGamesWithPlatforms = async (categoryId) => {
  const res = await pool.query(
    `
    SELECT
      i.id,
      i.name,
      i.price,
      i.genre,
      i.item_condition,
      ARRAY_AGG(p.name) FILTER (WHERE p.name IS NOT NULL) AS platforms
    FROM items i
    LEFT JOIN item_platforms ip ON i.id = ip.item_id
    LEFT JOIN platforms p ON ip.platform_id = p.id
    WHERE i.category_id = $1
    GROUP BY i.id
    ORDER BY i.name
    `,
    [categoryId]
  );
  return res.rows;
};

// Get all games from all categories (with platforms)
const getAllGames = async () => {
  const res = await pool.query(
    `
    SELECT
      i.id,
      i.name,
      i.price,
      i.genre,
      i.item_condition,
      ARRAY_AGG(p.name) FILTER (WHERE p.name IS NOT NULL) AS platforms
    FROM items i
    LEFT JOIN item_platforms ip ON i.id = ip.item_id
    LEFT JOIN platforms p ON ip.platform_id = p.id
    GROUP BY i.id
    ORDER BY i.name
    `
  );
  return res.rows;
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

  // Platforms
  getPlatformId,
  insertItemPlatform,

  // Games
  getAllGamesWithPlatforms,
  getAllGames,

  // Export pool so seed.js can use it
  pool,
};
