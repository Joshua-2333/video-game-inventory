const express = require('express');
const app = express();
const path = require('path');

// Routes
const indexRouter = require('./routes/indexRouter');
const categoryRouter = require('./routes/categoryRouter');

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));

// Use routes
app.use('/', indexRouter);
app.use('/categories', categoryRouter);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
