const path = require('path');
const express = require('express');
const rootDir = require('../util/path');
const router = express.Router(); // This router is like a mini express app tied to the other express app or pluggable into the other express app

// /admin/add-product => GET
router.get('/add-product', (req, res, next) => {
  res.sendFile(path.join(rootDir, '../', 'views', 'add-product.html'));
});

// /admin/add-product => POST
router.post('/add-product', (req, res, next) => {
  console.log(req.url, req.body);
  res.redirect('/');
});

module.exports = router;