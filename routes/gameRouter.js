// routes/gameRouter.js
const express = require('express');
const router = express.Router();
const { getAllGames } = require('../db/queries');

/**
 * GET /games
 * Optional query params:
 *   ?genre=RPG
 *   ?platform=PC | Xbox | PS | Switch
 */
router.get('/', async (req, res) => {
  try {
    const { genre, platform } = req.query;

    // Fetch all games
    let games = await getAllGames();

    // Normalize data to prevent errors in EJS
    games = games.map(game => ({
      ...game,
      genre: game.genre || 'Unknown',
      platforms: Array.isArray(game.platforms) ? game.platforms : [],
      price: game.price || 0,
      item_condition: game.item_condition || 'New',
    }));

    // SERVER-SIDE FILTERING
    if (genre && genre !== 'all') {
      games = games.filter(game => game.genre === genre);
    }

    if (platform && platform !== 'all') {
      games = games.filter(game => {
        if (!game.platforms.length) return false;

        // Handle PlayStation as alias for PS3, PS4, PS5
        if (platform === 'PS') {
          return game.platforms.some(p => ['PS3', 'PS4', 'PS5'].includes(p));
        }

        return game.platforms.includes(platform);
      });
    }

    // Respond with JSON if requested (useful for future AJAX)
    if (req.headers.accept?.includes('application/json')) {
      return res.json({ games });
    }

    // Render the EJS page
    res.render('games', { games, genre: genre || 'all', platform: platform || 'all' });

  } catch (err) {
    console.error('Error fetching games:', err);
    res.status(500).send('Server error');
  }
});

module.exports = router;
