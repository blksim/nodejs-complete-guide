const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const multer = require('multer');
const uuidv4 = require('uuid/v4')

const { graphqlHTTP } = require('express-graphql');

const graphqlSchema = require('./graphql/schema');
const graphqlResolver = require('./graphql/resolvers');
const auth = require('./middleware/auth');

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
  if (req.method === 'OPTIONS') {
    // because express-graphql automatically declines anything which isn't a post or get request
    return res.sendStatus(200); // send an empty response with a statusCode of 200
    // so this code is not executed and therefore OPTIONS requests never make it to the graphql endpoint 
    // but still get a valid response.
  }
  next(); 
});

/**
 * This middleware will now run on every request that
 * reaches my graphql endpoint but it will not deny the request
 * if there is no token, the only thing it will do is 
 * it will set isAuth=false and then I can decide in my resolver
 * whether I want to continue or not
 */
app.use(auth);

app.use('/graphql', graphqlHTTP({
  schema: graphqlSchema,
  rootValue: graphqlResolver,
  graphiql: true, // this gives you a special tool for testing
  customFormatErrorFn(err) { // you can add another config option which is actually a method which receives the error detected by grapqhql and allows you to return your own format.
    if (!err.originalError) {
    return err;
  }
  const data = err.originalError.data;
  const message= err.message || 'An error occurred';
  const code = err.originalError.code || 500;
  // now if you just return error, you keep the default format which is exactly the format we see here but you can change that of course.
  return { message: message, status: code, data: data };
}
}));

app.use((req, res, next) => {
  const status = req.statusCode || 500;
  const message = req.message;
  const data = req.data;
  return res.status(status).json({ message: message, data: data });
});

mongoose
.set('useNewUrlParser', true)
.set('useUnifiedTopology', true)
.connect(MONGODB_URI)
.then(result => {
  app.listen(8080);
})
.catch(err => console.log(err));

