const express = require('express');
const router = express.Router();
const productRoutes = require('./products');
const categoryRoutes = require('./categories');

router.use('/products', productRoutes);
router.use('/categories', categoryRoutes);

module.exports = router;