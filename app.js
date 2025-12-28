// app.js
const express = require('express');
const path = require('path');
require('dotenv').config();

const app = express();

// Import routers
const indexRouter = require('./routes/indexRouter');
const categoryRouter = require('./routes/categoryRouter');
const itemRouter = require('./routes/itemRouter');
const gameRouter = require('./routes/gameRouter');

// Set EJS as view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middleware
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: false }));
app.use(express.json()); // For JSON requests

// Routes
app.use('/', indexRouter);
app.use('/categories', categoryRouter);
app.use('/items', itemRouter);
app.use('/games', gameRouter);

// 404 handler
app.use((req, res) => {
  res.status(404).render('404', { message: 'Page not found' });
});

// 500 error handler
app.use((err, req, res, next) => {
  console.error(err.stack); // Log error stack in console
  res.status(500).render('500', { error: err });
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});

module.exports = app; // Export app for testing or future use
