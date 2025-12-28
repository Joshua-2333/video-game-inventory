-- Drop tables if they exist (safe for re-runs)
DROP TABLE IF EXISTS item_platforms;
DROP TABLE IF EXISTS items;
DROP TABLE IF EXISTS platforms;
DROP TABLE IF EXISTS categories;

-- CATEGORIES
CREATE TABLE categories (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  description TEXT
);

-- PLATFORMS
CREATE TABLE platforms (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL UNIQUE
);

-- ITEMS
CREATE TABLE items (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  price NUMERIC(10,2) NOT NULL,
  quantity INTEGER NOT NULL,
  category_id INTEGER REFERENCES categories(id) ON DELETE CASCADE,
  item_condition TEXT NOT NULL,
  release_date DATE,
  genre TEXT
);

-- ITEM ↔ PLATFORM JOIN TABLE
CREATE TABLE item_platforms (
  item_id INTEGER REFERENCES items(id) ON DELETE CASCADE,
  platform_id INTEGER REFERENCES platforms(id) ON DELETE CASCADE,
  PRIMARY KEY (item_id, platform_id)
);
