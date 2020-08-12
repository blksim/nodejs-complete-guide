const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const errorController = require('./controllers/error');
const User = require('./models/user');

const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');

app.use(bodyParser.urlencoded({
  extended: false
}));
app.use(express.static(path.join(__dirname, 'public')));

app.use((req, res, next) => {
  User.findById('5f3358b805e192500871e399') // findById() is provided by mongoose
    .then(user => {
      req.user = user; // this user is a full mongoose model so we can call all these mongoose model functions or methods on that user
      next();
    })
    .catch(err => console.log(err));
});

app.use('/admin', adminRoutes);
app.use(shopRoutes);

app.use(errorController.get404);

mongoose
  .set('useNewUrlParser', true)
  .set('useUnifiedTopology', true)
  .connect('mongodb+srv://testuser:DeIHBgxdMlns0QEv@cluster0.yqyyj.mongodb.net/shop?retryWrites=true&w=majority')
  .then(result => {
    User.findOne().then(user => {
      if (!user) {
        const user = new User({
          name: 'Max',
          email: 'max@test.com',
          cart: {
            itmes: []
          }
        });
        user.save();
      }
    });
  app.listen(3000);
  })
  .catch(err => {
    console.log(err);
  });