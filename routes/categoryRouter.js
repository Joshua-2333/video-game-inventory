// routes/categoryRouter.js
const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoryController');

// List all categories
router.get('/', categoryController.categoryList);

// Show create category form
router.get('/new', categoryController.categoryCreateForm);

// Handle create category
router.post('/new', categoryController.categoryCreate);

// Show edit category form
router.get('/:id/edit', categoryController.categoryEditForm);

// Handle update category
router.post('/:id/edit', categoryController.categoryUpdate);

// Category detail page
router.get('/:id', categoryController.categoryDetail);

// Handle delete category (with admin password protection)
router.post('/:id/delete', categoryController.categoryDelete);

module.exports = router;
