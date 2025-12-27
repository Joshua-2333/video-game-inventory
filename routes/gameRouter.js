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

    // Fetch all games (with platforms + genre already joined)
    let games = await getAllGames();

    // SERVER-SIDE FILTERING
    if (genre && genre !== 'all') {
      games = games.filter(game => game.genre === genre);
    }

    if (platform && platform !== 'all') {
      games = games.filter(game => {
        if (!game.platforms) return false;

        // Special handling for PlayStation
        if (platform === 'PS') {
          return game.platforms.some(p =>
            p === 'PS3' || p === 'PS4' || p === 'PS5'
          );
        }

        return game.platforms.includes(platform);
      });
    }

    // JSON MODE (for AJAX later)
    if (req.headers.accept?.includes('application/json')) {
      return res.json({ games });
    }

    // EJS RENDER
    res.render('games', { games });

  } catch (err) {
    console.error('Error fetching games:', err);
    res.status(500).send('Server error');
  }
});

module.exports = router;
