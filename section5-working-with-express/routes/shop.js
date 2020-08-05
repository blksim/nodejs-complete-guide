const express = require('express');
const router = express.Router();
const adminData = require('./admin');

router.get('/', (req, res) => {
//  res.sendFile(path.join(rootDir, '../', 'views', 'shop.html')); 
  // we use path.join() because this will automatically build the path 
  // in a way that works  on both Linux and Windows systems.
  const products = adminData.products;
  res.render('shop', {prods: products, pageTitle: 'Shop', path:'/shop'});
});

module.exports = router;
