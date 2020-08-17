const express = require('express');
const { check, body } = require('express-validator/check');

const authController = require('../controllers/auth');
const User = require('../models/user');

const router = express.Router();

router.get('/login', authController.getLogin);

router.get('/signup', authController.getSignup);

router.post('/login', [
  body('email')
    .isEmail()
    .withMessage('Please enter a valid email')
    .normalizeEmail(),
  body('password', 
    'Please enter a password with only number and text at least 5 characters')
    .isLength({min: 5})
    .isAlphanumeric()
    .trim()
], authController.postLogin);

router.post('/signup', 
[check('email')
.isEmail()
.withMessage('Please enter a valid email')
.normalizeEmail()
  .custom((value, { req }) => {
    return User.findOne({ email: email }).then(userDoc => {
        if (userDoc) {
          return Promise.reject('Email exists already, please pick a different one.');
        }
    });
  }),
  body(
  'password', 
  'Please enter a passwrod with only number and ttext at least 5 cahracters.'
  )
  .isLength({ min: 5 })
  .isAlphanumeric()
  .trim(),
  body('confirmPassword').custom((value, { req }) => {
    if (value !== req.body.password) {
      throw new Error('Passwords have to match!');
    }
    return true;
  })
], 
authController.postSignup); // check function return a middleware.

router.post('/logout', authController.postLogout);

router.get('/reset', authController.getReset);

router.post('/reset', authController.postReset);

router.get('/reset/:token', authController.getNewPassword);

router.post('/new-password', authController.postNewPassword);

module.exports = router;
