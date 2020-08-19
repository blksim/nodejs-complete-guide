const express = require('express');
const bodyParser = require('body-parser');

const feedRoutes = require('./routes/feed');

const app = express();

//app.use(bodyParser.urlencoded()); // x-www-form-urlencoded <form>
app.use(bodyParser.json()); // application/json

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

app.listen(8080);

