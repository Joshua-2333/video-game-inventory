// routes/itemRouter.js
const express = require('express');
const router = express.Router();
const itemController = require('../controllers/itemController');

// Show create item form
router.get('/new/:categoryId', itemController.itemCreateForm);

// Handle create item
router.post('/new', itemController.itemCreate);

// Show edit item form
router.get('/:id/edit', itemController.itemEditForm);

// Handle update item
router.post('/:id/edit', itemController.itemUpdate);

// Item detail page
router.get('/:id', itemController.itemDetail);

// Handle delete item (with admin password protection)
router.post('/:id/delete', itemController.itemDelete);

module.exports = router;
