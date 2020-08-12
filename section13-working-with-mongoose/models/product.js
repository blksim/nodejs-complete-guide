const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const productSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  imageUrl: {
    type: String,
    required: true
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
    // we can add a special ref configuration and ref takes a string where we tell mongoose hey which other mongoose model is actually related to the data in that field.
  }
}); // please note that don't add _id here becuase this will still be added automatically as an ObjectID.

/**
 * Now mode lis a function I call and a model basically is important for mongoose behind the scenes to connect a schema,
 * so here you give that model a name. 
 * you name it here like this with a capital string character and then simply just well the name of the entity this reflects in yor project or in your app
 * 
 * mongoose takes your model name and turns it to all lowercase and takes the plural form of that
 * and it will be used as the collection name.
 */
module.exports = mongoose.model('Product', productSchema);
// const mongodb = require('mongodb');
// const getDb = require('../util/database').getDb;

// class Product {
//   constructor(title, price, description, imageUrl, id, userId) {
//     this.title = title;
//     this.price = price;
//     this.description = description;
//     this.imageUrl = imageUrl;
//     this._id = id ? new mongodb.ObjectId(id) : null;
//     this.userId = userId;
//   }  

//   save() {
//     const db = getDb();
//     let dbOp;
//     if (this._id) {
//       // find one with _id then update
//       // you can pass an object as a second argument, and here we can describe the changes we want
//       // to make to ths existing document which we found with this filter. 
//       console.log('***UPDATED***');
//       dbOp = db
//         .collection('products')
//         .updateOne({_id: this._id}, {$set: this}); // you could actually say 'this' and you would instruct mongodb to simply set these key values fields which you have in your object here to the document it found in the database
//     } else {
//       // dbOp is equal to my connection to the database and then connecting to collection
//       // and then inserting one and then down there, I can use dbOp to follow along and actually return that.
//       console.log('***INSERTED***');
//       dbOp = db
//         .collection('products')
//         .insertOne(this);
//     }
//     return dbOp
//       .then(result => {
//         console.log(result);
//       })
//       .catch(err => {
//         console.log(err);
//       }); 
//   }

//   static fetchAll() {
//     const db = getDb();
//     return db
//     .collection('products')
//     .find()
//     .toArray()
//     .then(products => {
//       console.log(products);
//       return products;
//     })
//     .catch(err => {
//       console.log(err);
//     }); 
// /*  find() could be configured to also use a filter.
//     it returns a cursor, not promise object. cursor is an object provided by mongodb,
//     which allows us to go through our elements, our documents step by step because theoretically in a collection,
//     find() could of course return millions of documents and you don't want to transfer them over the wire all at once.

//     so instead find() gives you a handle which you can use to tell mongodb, "Ok, give me the next document, ok, give me the next document and so on"
//  */  
//   }

//   static findById(prodId) {
//     const db = getDb();
//     // look for a product where _id is equal to prodId 
//     // next() returns the last document by find here
//     return db
//     .collection('products')
//     // you cannot compare prodId to mongodb _id because it's BSON format(not js type), so you have to import mongodb and call objectId() as a consturctor to wrap _id and create new objectId
//     .find({_id: new mongodb.ObjectID(prodId)}) 
//     .next()
//     .then(product => {
//       console.log(product);
//       return product;
//     })
//     .catch(err => { 
//       console.log(err); 
//     });
//   };

//   static deleteById(prodId) {
//     const db = getDb();
//     return db
//       .collection('products')
//       .deleteOne({_id: new mongodb.ObjectId(prodId)})
//         .then(result => {
//           console.log(result);
//         })
//         .catch(err => {
//           console.log(err);
//         });
//   };

// }

// module.exports = Product;
