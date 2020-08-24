const fs = require('fs');
const path = require('path');
const https = require('https');

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);
const csrf = require('csurf');
const flash = require('connect-flash');
const multer = require('multer');

const errorController = require('./controllers/error');
const shopController = require('./controllers/shop');
const isAuth = require('./middleware/is-auth');
const User = require('./models/user');
const helmet = require('helmet');
const compression = require('compression');
const morgan = require('morgan');

// we can inject values by using ${} by changing string into template literals
// we can access environments variables on the process object, this is an object not defined by us
// but this is globally available in the node app. it's part of the node core runtime.
// in the process.env, there're a bunch of default environment variables but we can also set our own ones.
const MONGODB_URI =
`mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@cluster0.yqyyj.mongodb.net/${process.env.MONGO_DEFAULT_DATABASE}`;

const app = express();
const store = new MongoDBStore({
  uri: MONGODB_URI,
  collection: 'sessions'
});
const csrfProtection = csrf();

// const privateKey = fs.readFileSync('server.key');
// const certificate = fs.readFileSync('server.cert');

const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'images');
  },
  filename: (req, file, cb) => {
    cb(null, new Date().toISOString() + '-' + file.originalname);
  }
});

const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === 'image/png' ||
    file.mimetype === 'image/jpg' ||
    file.mimetype === 'image/jpeg'
  ) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

app.set('view engine', 'ejs');
app.set('views', 'views');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const authRoutes = require('./routes/auth');
// new data will appended to that file and not overwrite the existing file but add it at the end of the file
// so that we don't just have one loge statement inthe file but we continuously add them to the file
const accessLogStream = fs.createWriteStream(path.join(__dirname, 'access.log'), { flags: 'a'});
app.use(helmet());
/**
 * most hosting providers you might want to use have some support of compression built in
 * or might at least offer this compression support which you can conveniently add there.
 * so then they will compress assets on the fly and you don't have to do it with your own middleware 
 * and you actually shouldn't do it.
 * but in case your hosting provider does not support it or you're buildign your own server, 
 * then this is a nice middleware which you can add.
 */
app.use(compression());
// often logging is done by our hosting providers so then this might not matter for you.
// if you want to have to do it manually though, this is a nice package where you can of couse configure more as you can see in their official docs which allows you to log your request data to files
// so that you always know what's going on your server.
app.use(morgan('combined', { stream: accessLogStream })); // you can define which data is being logged and how it's formatted

app.use(bodyParser.urlencoded({ extended: false }));
app.use(
  multer({ storage: fileStorage, fileFilter: fileFilter }).single('image')
);
app.use(express.static(path.join(__dirname, 'public')));
app.use('/images', express.static(path.join(__dirname, 'images')));
app.use(
  session({
    secret: 'my secret',
    resave: false,
    saveUninitialized: false,
    store: store
  })
);

app.use(flash());

app.use((req, res, next) => {
  res.locals.isAuthenticated = req.session.isLoggedIn;
  next();
});

app.use((req, res, next) => {
  // throw new Error('Sync Dummy');
  if (!req.session.user) {
    return next();
  }
  User.findById(req.session.user._id)
    .then(user => {
      if (!user) {
        return next();
      }
      req.user = user;
      next();
    })
    .catch(err => {
      next(new Error(err));
    });
});

app.post('/create-order', isAuth, shopController.postOrder);

app.use(csrfProtection);
app.use((req, res, next) => {
  res.locals.csrfToken = req.csrfToken();
  next();
});

app.use('/admin', adminRoutes);
app.use(shopRoutes);
app.use(authRoutes);

app.get('/500', errorController.get500);

app.use(errorController.get404);

app.use((error, req, res, next) => {
  // res.status(error.httpStatusCode).render(...);
  // res.redirect('/500');
  res.status(500).render('500', {
    pageTitle: 'Error!',
     path: '/500',
    isAuthenticated: req.session.isLoggedIn
  });
});

mongoose
  .connect(MONGODB_URI)
  .then(result => {
    app.listen(process.env.PORT || 3000);
    //   https.createServer({ key: privateKey, cert: certificate}, app)
    //.listen(process.env.PORT || 3000); 
  })
  .catch(err => {
    console.log(err);
  });
