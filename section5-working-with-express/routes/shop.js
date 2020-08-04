const path = require('path'); // we can send a file where we create a path with the help of this module by calling join()
const express = require('express');
const router = express.Router();
const rootDir = require('../util/path');

router.get('/', (req, res) => {
  res.sendFile(path.join(rootDir, '../', 'views', 'shop.html')); 
  // we use path.join() because this will automatically build the path 
  // in a way that works on both Linux and Windows systems.
});

module.exports = router;
