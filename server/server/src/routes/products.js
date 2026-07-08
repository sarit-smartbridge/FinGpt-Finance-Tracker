const express = require('express');
const productController = require('../controllers/product.controller');

const router = express.Router();

router.post('/api/admin/add-product', productController.addProduct);

module.exports = router;
