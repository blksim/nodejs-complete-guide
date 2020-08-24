const fs = require('fs');
const path = require('path');
const {
  validationResult
} = require('express-validator');

const io = require('../socket');
const Post = require('../models/post');
const User = require('../models/user');

exports.getPosts = async (req, res, next) => {
  // not use res.renders() anymore!
  // we can send a normal js obj to json and it will be converted to the json format and sent back as a response to the client whosent the request
  const currentPage = req.query.page || 1;
  const perPage = 2;
  let totalItems;
  // Always keep in mind, await just does some behind the scenes transformation of your code,
  // it tkaes your code and adds then after it gets the result of that operation and them stores it in total items
  // and then moves onto the next line, executes that inside of that then block it creates here implicitly 
  try {
    const totalItems = await Post.find().countDocuments();
    const posts = await Post.find()
      .populate('creator')
      .sort({ createdAt: -1 })
      .skip((currentPage - 1) * perPage)
      .limit(perPage);

    res.status(200).json({
      message: 'Fetched posts successfully.',
      posts: posts,
      totalItems: totalItems
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  };
}

exports.createPost = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error('Validation failed, entered data is incorrectg');
    error.statusCode = 422;
    throw error; // it will automatically exit funciton execution here,
    // and try to reach the next error handling function or error handling middleware provided in the express application

    //    return res.status(422).json({message: 'Validation failed, enter data is incorrect.', errors: errors.array()});
  }
  if (!req.file) {
    const error = new Error('No image provided.');
    error.statusCode = 422;
    throw error;
  }
  const imageUrl = req.file.path.replace("\\", "/");
  const title = req.body.title;
  const content = req.body.content;

  const post = new Post({
    title: title,
    content: content,
    imageUrl: imageUrl,
    creator: req.userId
  });
  try {
    await post.save()
    const user = await User.findById(req.userId);
    user.posts.push(post);
    await user.save();
    io.getIO().emit('posts', {
      action: 'create',
      post: {
        ...post._doc,
        creator: {
          _id: req.userId,
          name: user.name
        }
      }
    }); // send it to all clients
    res.status(201).json({
      message: 'Post created successfully!',
      post: post,
      creator: {
        _id: user._id,
        name: user.name
      }
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err); // this will now go and reach thge next error handling express middleware.
  }
};

exports.getPost = async (req, res, next) => {
  const postId = req.params.postId;
  const post = await Post.findById(postId);
  try {
    if (!post) {
      const error = new Error('Could not find post.');
      error.statusCode = 404;
      throw error; // -> catch
    }
    res.status(200).json({
      message: 'Post fetched.',
      post: post
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err); // this will now go and reach thge next error handling express middleware.
  }
}

exports.updatePost = async (req, res, next) => {
  const errors = validationResult(req);
  const postId = req.params.postId;
  const title = req.body.title;
  const content = req.body.content;
  let imageUrl = req.body.image;
  if (!errors.isEmpty()) {
    const error = new Error('Validation failed, entered data is incorrectg');
    error.statusCode = 422;
    throw error; // it will automatically exit funciton execution here,
  }
  if (req.file) {
    imageUrl = req.file.path;
  }
  if (!imageUrl) {
    const error = new Error('No file picked.');
    error.statusCode = 422;
    throw error;
  }
  const post = await Post.findById(postId).populate('creator');
  try {
    if (!post) {
      const error = new Error('Could not find post.');
      error.statusCode = 404;
      throw error; // -> catch
    }
    if (post.creator._id.toString() !== req.userId) {
      const error = new Error('Not authorized!');
      error.statusCode = 403;
      throw error;
    }
    if (imageUrl !== post.imageUrl) {
      clearImage(post.imageUrl);
    }
    post.title = title;
    post.imageUrl = imageUrl;
    post.content = content;
    const result = await post.save();
    // establish io connection
    io.getIO().emit('posts', { action: 'update', post: result });
    res.status(200).json({
      message: 'Post updated!',
      post: result
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err); // this will now go and reach thge next error handling express middleware.
  }
};

exports.deletePost = async (req, res, next) => {
  const postId = req.params.postId;
  const post = await Post.findById(postId)
  try {
    if (!post) {
      const error = new Error('Could not find post.');
      error.statusCode = 404;
      throw error; // -> catch
    }
    if (post.creator.toString() !== req.userId) {
      const error = new Error('Not authorized!');
      error.statusCode = 403;
      throw error;
    }
    // checked looged in user
    clearImage(post.imageUrl);
    await Post.findByIdAndRemove(postId);
    const user = await User.findById(req.userId);
    user.posts.pull(postId);
    await user.save();
    io.getIO().emit('posts', { action: 'delete', post: postId });
    res.status(200).json({
      message: 'Deleted post.'
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err); // this will now go and reach thge next error handling express middleware.
  }
};
