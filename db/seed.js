// db/seed.js
require('dotenv').config();
const {
  insertCategory,
  insertItem,
  insertItemPlatform,
  pool
} = require('./queries');

(async () => {
  try {
    console.log('Seeding database...');

    // --- CATEGORIES ---
    const categories = [
      // Game genres (keep all your existing types)
      { name: 'RPG', description: 'Role-playing games' },
      { name: 'Action', description: 'Fast-paced action games' },
      { name: 'Sports', description: 'Sports simulation games' },
      { name: 'Adventure', description: 'Exploration and puzzle games' },
      { name: 'Shooter', description: 'First-person and third-person shooters' },
      { name: 'Strategy', description: 'Strategy and simulation games' },
      { name: 'Accessories', description: 'Controllers, headsets, and peripherals' },

      // Homepage main categories
      { name: 'Consoles', description: 'Gaming consoles of all generations' },
      { name: 'Games', description: 'All video games' }
    ];

    const categoryMap = {};
    for (const cat of categories) {
      const res = await pool.query('SELECT * FROM categories WHERE name=$1', [cat.name]);
      let createdCat;
      if (res.rows.length) {
        createdCat = res.rows[0];
      } else {
        createdCat = await insertCategory(cat.name, cat.description);
      }
      categoryMap[cat.name] = createdCat.id;
      console.log(`Category ready: ${createdCat.name} (ID: ${createdCat.id})`);
    }

    // --- PLATFORMS ---
    const allPlatforms = ['PS3', 'PS4', 'PS5', 'Xbox', 'Switch', 'PC'];
    const platformRes = await pool.query('SELECT * FROM platforms');
    const platformMap = {};
    for (const row of platformRes.rows) platformMap[row.name] = row.id;

    for (const platform of allPlatforms) {
      if (!platformMap[platform]) {
        const res = await pool.query('INSERT INTO platforms (name) VALUES ($1) RETURNING id', [platform]);
        platformMap[platform] = res.rows[0].id;
        console.log(`Inserted platform: ${platform}`);
      }
    }

    // --- CLEAR OLD ITEMS ---
    await pool.query('DELETE FROM item_platforms');
    await pool.query('DELETE FROM items');
    console.log('Cleared old items and item-platform links.');

    // --- ITEMS ---
    const items = [
      // RPG
      { name: 'Final Fantasy XV', price: 59.99, quantity: 10, category: 'RPG', genre: 'RPG', platforms: ['PS4','PC'], item_condition: 'New', release_date: '2016-11-29' },
      { name: 'Elden Ring', price: 69.99, quantity: 8, category: 'RPG', genre: 'RPG', platforms: ['Xbox','PS5','PC'], item_condition: 'New', release_date: '2022-02-25' },
      { name: 'Persona 5', price: 49.99, quantity: 5, category: 'RPG', genre: 'RPG', platforms: ['PS5'], item_condition: 'New', release_date: '2020-04-04' },
      { name: 'Baldur\'s Gate 3', price: 59.99, quantity: 12, category: 'RPG', genre: 'RPG', platforms: ['PC'], item_condition: 'New', release_date: '2023-08-03' },
      { name: 'Divinity: Original Sin 2', price: 44.99, quantity: 10, category: 'RPG', genre: 'RPG', platforms: ['PC'], item_condition: 'New', release_date: '2017-09-14' },
      { name: 'The Witcher 3: Wild Hunt', price: 39.99, quantity: 15, category: 'RPG', genre: 'RPG', platforms: ['PC'], item_condition: 'New', release_date: '2015-05-19' },
      { name: 'Yakuza 0', price: 39.99, quantity: 8, category: 'RPG', genre: 'RPG', platforms: ['PS4'], item_condition: 'New', release_date: '2015-03-12' },
      { name: 'Yakuza Kiwami', price: 39.99, quantity: 8, category: 'RPG', genre: 'RPG', platforms: ['PS4'], item_condition: 'New', release_date: '2016-01-21' },
      { name: 'Yakuza Kiwami 2', price: 49.99, quantity: 8, category: 'RPG', genre: 'RPG', platforms: ['PS4'], item_condition: 'New', release_date: '2017-12-07' },
      { name: 'Yakuza 3', price: 29.99, quantity: 6, category: 'RPG', genre: 'RPG', platforms: ['PS3'], item_condition: 'New', release_date: '2009-02-26' },
      { name: 'Yakuza 4', price: 29.99, quantity: 6, category: 'RPG', genre: 'RPG', platforms: ['PS3'], item_condition: 'New', release_date: '2010-03-18' },
      { name: 'Yakuza 5', price: 29.99, quantity: 6, category: 'RPG', genre: 'RPG', platforms: ['PS3'], item_condition: 'New', release_date: '2012-12-06' },
      { name: 'Yakuza 6: The Song of Life', price: 59.99, quantity: 8, category: 'RPG', genre: 'RPG', platforms: ['PS4'], item_condition: 'New', release_date: '2016-12-08' },
      { name: 'Yakuza: Like a Dragon', price: 59.99, quantity: 8, category: 'RPG', genre: 'RPG', platforms: ['PS5'], item_condition: 'New', release_date: '2020-11-10' },
      { name: 'Like a Dragon Gaiden: The Man Who Erased His Name', price: 49.99, quantity: 6, category: 'RPG', genre: 'RPG', platforms: ['PS5'], item_condition: 'New', release_date: '2025-03-28' },

      // Action
      { name: 'Assassin\'s Creed: Shadows', price: 59.99, quantity: 15, category: 'Action', genre: 'Action', platforms: ['PC'], item_condition: 'New', release_date: '2023-03-21' },
      { name: 'God of War', price: 69.99, quantity: 7, category: 'Action', genre: 'Action', platforms: ['PS5'], item_condition: 'New', release_date: '2022-01-14' },
      { name: 'Hollow Knight', price: 29.99, quantity: 20, category: 'Action', genre: 'Action', platforms: ['PC'], item_condition: 'New', release_date: '2017-02-24' },
      { name: 'Hollow Knight: Silksong', price: 39.99, quantity: 12, category: 'Action', genre: 'Action', platforms: ['PC'], item_condition: 'New', release_date: '2025-01-01' },
      { name: 'Clair Obscur: Expedition 33', price: 49.99, quantity: 10, category: 'Action', genre: 'Action', platforms: ['PS5'], item_condition: 'New', release_date: '2024-06-15' },
      { name: 'Stellar Blade', price: 69.99, quantity: 8, category: 'Action', genre: 'Action', platforms: ['PS5'], item_condition: 'New', release_date: '2024-10-01' },

      // Shooter
      { name: 'Bioshock', price: 29.99, quantity: 8, category: 'Shooter', genre: 'Shooter', platforms: ['PC'], item_condition: 'New', release_date: '2007-08-21' },
      { name: 'Bioshock 2', price: 29.99, quantity: 8, category: 'Shooter', genre: 'Shooter', platforms: ['PC'], item_condition: 'New', release_date: '2010-02-09' },
      { name: 'Bioshock Infinite', price: 39.99, quantity: 8, category: 'Shooter', genre: 'Shooter', platforms: ['PC'], item_condition: 'New', release_date: '2013-03-26' },

      // Sports
      { name: 'FIFA 23', price: 49.99, quantity: 20, category: 'Sports', genre: 'Sports', platforms: ['PS5','Xbox'], item_condition: 'New', release_date: '2022-09-30' },
      { name: 'NBA 2K23', price: 59.99, quantity: 12, category: 'Sports', genre: 'Sports', platforms: ['Xbox'], item_condition: 'New', release_date: '2022-09-09' },
      { name: 'Mario Kart', price: 59.99, quantity: 15, category: 'Sports', genre: 'Sports', platforms: ['Switch'], item_condition: 'New', release_date: '2023-03-10' },
      { name: 'Super Smash Bros. Ultimate', price: 59.99, quantity: 12, category: 'Sports', genre: 'Sports', platforms: ['Switch'], item_condition: 'New', release_date: '2018-12-07' },

      // Adventure
      { name: 'The Legend of Zelda: Breath of the Wild', price: 59.99, quantity: 12, category: 'Adventure', genre: 'Adventure', platforms: ['Switch'], item_condition: 'New', release_date: '2017-03-03' },
      { name: 'Tomb Raider: Definitive Edition', price: 39.99, quantity: 10, category: 'Adventure', genre: 'Adventure', platforms: ['PC'], item_condition: 'New', release_date: '2016-01-28' },

      // Strategy
      { name: 'Civilization VI', price: 49.99, quantity: 9, category: 'Strategy', genre: 'Strategy', platforms: ['PC'], item_condition: 'New', release_date: '2016-10-21' },
      { name: 'Age of Empires IV', price: 59.99, quantity: 6, category: 'Strategy', genre: 'Strategy', platforms: ['PC'], item_condition: 'New', release_date: '2021-10-28' },

      // Accessories
      { name: 'DualSense Controller', price: 69.99, quantity: 25, category: 'Accessories', genre: 'Accessories', platforms: ['PS5'], item_condition: 'New', release_date: '2020-11-12' },
      { name: 'Xbox Elite Controller Series 2', price: 179.99, quantity: 10, category: 'Accessories', genre: 'Accessories', platforms: ['Xbox'], item_condition: 'New', release_date: '2019-11-04' },
      { name: 'Nintendo Switch Pro Controller', price: 69.99, quantity: 15, category: 'Accessories', genre: 'Accessories', platforms: ['Switch'], item_condition: 'New', release_date: '2017-03-03' },
      { name: 'Gaming Headset', price: 49.99, quantity: 20, category: 'Accessories', genre: 'Accessories', platforms: ['PC'], item_condition: 'New', release_date: '2021-08-15' },
    ];

    // --- INSERT ITEMS & PLATFORM MAPPING ---
    for (const item of items) {
      // Map game items to homepage "Games", accessories stay as Accessories
      let categoryId = categoryMap[item.category];
      if (['RPG','Action','Sports','Adventure','Shooter','Strategy'].includes(item.category)) {
        categoryId = categoryMap['Games'];
      }
      if (!categoryId) {
        console.warn(`⚠️ Skipping item, category not found: ${item.name}`);
        continue;
      }

      const insertedItem = await insertItem(
        item.name,
        item.price,
        item.quantity,
        categoryId,
        item.item_condition,
        item.release_date,
        item.genre
      );

      for (const platformName of item.platforms) {
        const platformId = platformMap[platformName];
        if (!platformId) {
          console.warn(`⚠️ Platform missing: ${platformName} for item ${item.name}`);
          continue;
        }
        await insertItemPlatform(insertedItem.id, platformId);
        console.log(`Mapped ${insertedItem.name} to platform ${platformName}`);
      }
    }

    console.log('All items seeded successfully!');
    process.exit(0);

  } catch (err) {
    console.error('Error seeding database:', err);
    process.exit(1);
  }
})();
