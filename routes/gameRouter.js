// routes/gameRouter.js
const express = require('express');
const router = express.Router();
const { getAllGames } = require('../db/queries');

// GET /games - show all games
router.get('/', async (req, res) => {
  try {
    // Fetch all games from all categories
    const allGames = await getAllGames();

    // Render the games page with the fetched games
    res.render('games', { games: allGames });
  } catch (err) {
    console.error('Error fetching games:', err);
    res.status(500).send('Server error');
  }
});

module.exports = router;
