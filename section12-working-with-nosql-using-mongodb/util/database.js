const mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient;

// it would be better if we could manage one connection in our database and then simply return 
// access to the client which we set up once fro mthere or to the different place in our app that need access.
let _db; 

/* we don't need to create a database or the tables, the collections in there ahead of time.
It will be created on the fly when we first access it which is again fitting that felxibility theme mongodb gives us.
In SQL we had to prepare everything in advance, at least when not using sequelize which also had to do that but it did it for us,
here we don't need to do anything, we're just telling mongodb hey connect me to the shop database
and if that database doens't exist yet, mongodb will create it as soon as we start writing data to it.
 */
const mongoConnect = (callback) => {
  MongoClient.connect('mongodb+srv://testuser:DeIHBgxdMlns0QEv@cluster0.yqyyj.mongodb.net/shop?retryWrites=true&w=majority', {
      useUnifiedTopology: true
    })
    .then(client => { // a client object which gives us access to the database.
      console.log('***CONNECTED!***');
      _db = client.db();
      // store a connection to db variable.
      callback();
    }).catch(err => {
      console.log(err);
      throw err;
    });
};

const getDb = () => {
  if (_db) {
    return _db;
  } 
  throw 'No database found';
};

/* exporting two methods, one for connecting and then storing the connection to the database 
and therefore, this will keep on running and I have one method where I return access to that connectede database
if it exists and mongodb behind the scenses will even mange this very elegantly 
with something called *connection pooling* where mongodb will make sure it provides sufficient connections 
for multiple simultaneous interactions with the database, so this is really a good pattern we should follow.
*/
exports.mongoConnect = mongoConnect;
exports.getDb = getDb;

