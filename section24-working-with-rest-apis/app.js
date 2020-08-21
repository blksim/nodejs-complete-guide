const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const multer = require('multer');
const uuidv4 = require('uuid/v4')
 
const feedRoutes = require('./routes/feed');
const authRoutes = require('./routes/auth');

const app = express();

const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, 'images');
    },
    filename: function(req, file, cb) {
        cb(null, uuidv4())
    }
});

const fileFilter = (req, file, cb) => {
  if (
    file.mimeType === 'image/png' || 
    file.mimetype === 'image/jpg' || 
    file.mimetype === 'image/jpeg') {
    cb(null, true);
  } else {
    cb(null, false);
  }
}

const MONGODB_URI =
'mongodb+srv://testuser:DeIHBgxdMlns0QEv@cluster0.yqyyj.mongodb.net/messages';

//app.use(bodyParser.urlencoded()); // x-www-form-urlencoded <form>
app.use(bodyParser.json()); // application/json
app.use(multer({storage: storage}).single('image'));
// now every incoming request is parsed for that file or for such files.
app.use('/images', express.static(path.join(__dirname, 'images')));
/**
 * This is how you communicate btw client and server, of course the client code differs depending on the client you're using.
 * fetch API, axios, or APIs from other platforms(android, ios) ....
 * this client code differs, server side code does not really differ. 
 */
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*'); // allows access from any client.
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
});

app.use('/feed', feedRoutes);
app.use('/auth', authRoutes);

app.use((err, req, next) => {
  console.log(error);
  const status = error.statusCode || 500;
  const message = error.message;
  const data = error.data;
  res.status(status).json({ message: message, data: data });
});

mongoose
.set('useNewUrlParser', true)
.set('useUnifiedTopology', true)
.connect(MONGODB_URI)
.then(result => {
  const server = app.listen(8080); // returns new node http server.
  // it actually exposes a function which reqruies our created server as an argument
  const io = require('./socket').init(server); // this sets up socket.io
  // Now this gives us an socket.io object which does set up all the web socket stuff behind the scenes
  io.on('connection', socket => {
    console.log('Client connected');
  });
})
.catch(err => console.log(err));

