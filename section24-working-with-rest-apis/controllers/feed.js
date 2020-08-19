exports.getPosts = (req, res, next) => {
  // not use res.renders() anymore!
  // we can send a normal js obj to json and it will be converted to the json format and sent back as a response to the client whosent the request
  res.status(200).json({
    posts: [{ title: 'First post', comment: 'This is the first post!' }]
  });
};

exports.createPost = (req, res, next) => {
  const title = req.body.title;
  const content = req.body.content;
  console.log(title, content);
  // Create post in db
  res.status(201).json({
    message: 'Post created successfully!',
    post: { id: new Date().toISOString(), title: title, content: content }
  });
};

