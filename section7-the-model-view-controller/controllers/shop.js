const Product = require('../models/product');
const products = [];
exports.getProducts = (req, res) => {
  Product.fetchAll((products) => {
    res.render('shop/products', {
      prods: products,
      pageTitle: 'Shop',
      path: '/'
    })
  });
};

exports.getIndex = (req, res, next) => {
  Product.fetchAll((products) => {
    res.render('shop/index', {
      prods: products,
      pageTitle: 'Home',
      path: '/'
    })
  });
}

exports.getCart =(req, res, next) => {
  res.render('shop/cart', {
    prods: products,
    pageTitle: 'Cart',
    path: '/cart'
  });
}

exports.getCheckout = (req, res, next) => {
  res.render('shop/checkout', {
    pageTitle: 'Checkout',
    path: '/checkout'
  })
}

exports.getOrders = (req, res, next) => {
  res.render('shop/orders', {
    prods: products,
    pageTitle: 'Orders',
    path: '/orders'
  })
}