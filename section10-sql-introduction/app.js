const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');

const errorController = require('./controllers/error');
const sequelize = require('./util/database');
const Product = require('./models/product');
const User = require('./models/user');
const Cart = require('./models/cart');
const CartItem = require('./models/cart-item');
const Order = require('./models/order');
const OrderItem = require('./models/order-item');

const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use((req, res, next) => {
  User.findByPk(1)
    .then(user => {
      req.user = user; 
      // sequelize object with the value stored in the db and with all utility methods sequelize added like destory.
      // so we're storing this sequelize object here in the request and not just a js object with the field values, it is that we got the extended version here
      // and therfore whenever we call request user in the future in our app, we can also execute methods like destroy.
      next();
      // now with that, we've got the user setup and retrieved.
    })
    .catch(err => console.log(err));
});

app.use('/admin', adminRoutes);
app.use(shopRoutes);

app.use(errorController.get404);

User.hasOne(Cart);
User.hasMany(Product);
User.hasMany(Order);
Product.belongsTo(User, {constraints: true, onDelete: 'CASCADE'});
Product.belongsToMany(Cart, { through: CartItem });
Cart.belongsTo(User); 
Cart.belongsToMany(Product, { through: CartItem });
Order.belongsTo(User);
Order.belongsToMany(Product, { through: OrderItem });

// it syncs your models to the database by creating the appropriate tables and if you have tghem, relations.
sequelize
  //.sync({ force: true }) // override it with the new information
  .sync()
  .then(result => {
    return User.findByPk(1);
 // console.log(result);
  })
  .then(user => {
    if (!user) {
      User.create({ name: 'max', email: 'test@test.com' });
    }
    return user;
  })
  .then(user => {
    return user.createCart();
  })
  .then(cart => {
    app.listen(3000);
  })
  .catch(err => {
    console.log(err);
  });