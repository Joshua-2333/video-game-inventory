// app.js
const express = require('express');
const path = require('path');
require('dotenv').config();

const app = express();

// Routes
const indexRouter = require('./routes/indexRouter');
const categoryRouter = require('./routes/categoryRouter');
const itemRouter = require('./routes/itemRouter'); 

// View engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middleware
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: false }));

// Routes
app.use('/', indexRouter);
app.use('/categories', categoryRouter);
app.use('/items', itemRouter); 

// 404 handler 
app.use((req, res) => {
  res.status(404).send('Page not found');
});

// Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
