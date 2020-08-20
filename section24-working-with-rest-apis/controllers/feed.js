const fs = require('fs');
const path = require('path');
const { validationResult } = require('express-validator');

const Post = require('../models/post');
const User = require('../models/user');

exports.getPosts = (req, res, next) => {
  // not use res.renders() anymore!
  // we can send a normal js obj to json and it will be converted to the json format and sent back as a response to the client whosent the request
  const currentPage = req.query.page || 1;
  const perPage = 2;
  let totalItems;
  Post.find()
  .countDocuments()
  .then(count => {
    totalItems = count;
    return Post.find()
    .skip((currentPage - 1) * perPage)
    .limit(perPage);
  })
  .then(posts => {
    res
      .status(200)
      .json({
        message: 'Fetched posts successfully.',
        posts: posts,
        totalItems: totalItems
      });
  })
  .catch(err => {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  });
};

exports.createPost = (req, res, next) => {
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
  const imageUrl =  req.file.path.replace("\\" ,"/");
  const title = req.body.title;
  const content = req.body.content;

  const post = new Post({
    title: title,
    content: content,
    imageUrl: imageUrl,
    creator: req.userId
  });
  post
  .save()
  .then(result => {
    return User.findById(req.userId);
  })
  .then(user => {
    creator = user;
    user.posts.push(post);
    return user.save();
  })
  .then(result => {
    res.status(201).json({
      message: 'Post created successfully!',
      post: post,
      creator: {_id: creator._id, name: creator.name}
    });
  })
  .catch(err => {
    if (!err.statusCode) {
      err.statusCode = 500;
    } 
     next(err); // this will now go and reach thge next error handling express middleware.
  });
};

exports.getPost = (req, res, next) => {
  const postId = req.params.postId;
  Post.findById(postId)
    .then(post => {
      if (!post) {
        const error = new Error('Could not find post.');
        error.statusCode = 404;
        throw error; // -> catch
      }
      res.status(200).json({ message: 'Post fetched.', post: post });
    })
    .catch(err => {
      if (!err.statusCode) {
        err.statusCode = 500;
      } 
      next(err); // this will now go and reach thge next error handling express middleware.
    });
}

exports.updatePost = (req, res, next) => {
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
  Post.findById(postId)
    .then(post => {
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
      if (imageUrl !== post.imageUrl) {
        clearImage(post.imageUrl);
      }
      post.title = title;
      post.imageUrl = imageUrl;
      post.content = content;
      return post.save();
    })
    .then(result => {
      res.status(200).json({ message: 'Post updated!', post: result });
    })
    .catch(err => {
      console.log(err);
      next(err);
    }) 
};

exports.deletePost = (req, res, next) => {
  const postId = req.params.postId;
  Post.findById(postId)
    .then(post => {
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
      return Post.findByIdAndRemove(postId);
    })
    .then(result => {
      // clear relation
      return User.findById(req.userId);
    })
    .then(user => {
      user.posts.pull(postId);
      return user.save();
    })
    .then(result => {
      console.log(result);
      res.status(200).json({ message: 'Deleted post.' });
    })
    .catch(err => {
      console.log(err);
      next(err);
    })
};

const clearImage = filePath => {
  filePath = path.join(__dirname, '..', filePath);
  fs.unlink(filePath, err => console.log(err));
}