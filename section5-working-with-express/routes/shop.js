const express = require('express');
const router = express.Router();
const adminData = require('./admin');

router.get('/', (req, res) => {
  //  res.sendFile(path.join(rootDir, '../', 'views', 'shop.html')); 
  // we use path.join() because this will automatically build the path 
  // in a way that works  on both Linux and Windows systems.
  const products = adminData.products;
  res.render('shop', {
    prods: products,
    pageTitle: 'Shop',
    path: '/shop',
    hasProducts: products.length > 0,
    activeShop: true,
    productCSS: true,
  });
  // here in handlebars, we can't run any logic in the tmmplate.
  // we just can output single property, single variables and their value and we can only use these in if blocks too.
});

module.exports = router;
