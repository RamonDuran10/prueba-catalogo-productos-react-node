const express = require('express');
const router = express.Router();
const {
  getCategories,
  getCategoryById,
  createCategory
} = require('../../../controllers/categoryController');

router.get('/', getCategories);
router.get('/:id', getCategoryById);
router.post('/', createCategory);

module.exports = router;
