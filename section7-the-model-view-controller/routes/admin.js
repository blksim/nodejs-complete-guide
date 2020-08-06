const express = require('express');
const router = express.Router();
const adminController = require('../controllers/admin');

// prefix /admin is added in app.js

router.get('/add-product', adminController.getAddProduct);

router.get('/products', adminController.getProducts);

router.post('/add-product', adminController.postAddProduct);

module.exports = router;