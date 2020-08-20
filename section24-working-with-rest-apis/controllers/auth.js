const {
  validationResult
} = require('express-validator');
const bcrypt = require('bcryptjs');

const User = require('../models/user');

const jwt = require('jsonwebtoken');

exports.signup = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error('Validation failed.');
    error.statusCode = 422;
    error.data = errors.array();
    throw error;
  }
  const email = req.body.email;
  const name = req.body.name;
  const password = req.body.password;
  try {
    const hashedPwd = await bcrypt.hash(password, 12)
    const user = new User({
      email: email,
      password: hashedPwd,
      name: name,
    });
    const result = await user.save();
    res.status(200).json({
      message: 'User created!',
      userId: result._id
    });
  } catch (err) {
    err.statusCode = 500;
    next(err);
  }
};

exports.login = async (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  let loadedUser;
  try {
    const user = await User.findOne({
      email: email
    })
    if (!user) {
      const error = new Error('A user with this email could not be found.');
      error.statusCode = 401; // not authenticated
      throw error;
    }
    loadedUser = user;
    const isEqual = await bcrypt.compare(password, user.password);
    if (!isEqual) {
      const error = new Error('Wrong password!');
      error.statusCode = 401;
      throw error;
    }
    const token = jwt.sign({
      email: loadedUser.email,
      userId: loadedUser._id.toString()
    }, 'somesupersecretsecret', {
      expiresIn: '1h'
    }); // you need to pass a second argument which is that secret, so that private key which is used for signing and that is now only known to the server and therefore you can't fake that token on the client.
    res.status(200).json({
      token: token,
      userId: loadedUser._id.toString()
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
}

exports.getStatus = async (req, res, next) => {
  try {
    const result = await User.findById(req.userId)
    res.status(200).json({
      message: 'Status fetched!',
      status: result.status
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
}

exports.putStatus = async (req, res, next) => {
  const newStatus = req.body.status;
  try {
    const user = await User.findById(req.userId)
    if (!user) {
      const error = new Error('User not found.');
      error.statusCode = 404;
      throw error;
    }
    user.status = newStatus;
    await user.save();
    res.status(200).json({
      message: 'User updated.'
    });
  } catch (error) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
}