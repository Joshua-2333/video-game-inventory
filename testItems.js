// testItems.js
const { getItemsByCategory } = require('./db/queries');

(async () => {
  try {
    const categoryId = 1; // Change this to the ID of a category you want to test, e.g., RPG
    const items = await getItemsByCategory(categoryId);

    console.log(`Items in category ID ${categoryId}:`);
    for (const item of items) {
      console.log(`- ${item.name} | Platforms: ${item.platforms.join(', ')}`);
    }
  } catch (err) {
    console.error(err);
  } finally {
    process.exit(0);
  }
})();
