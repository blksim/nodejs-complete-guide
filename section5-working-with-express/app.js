const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const expressHbs = require('express-handlebars');

const app = express();

// assigns setting name to value. certain names can be used to configure the behavior of the server.
// becuase we installed the pug templating engine, this engine actually ships with built in express support and autoregisters itself with express.
app.engine('hbs', expressHbs({
  layoutsDir: 'views/layouts/',
  defaultLayout: 'main-layout',
  extname: 'hbs'
}));
app.set('view engine', 'hbs'); // has to match with engine key
//app.engine('pug', require('pug').__express); 
//app.set('view engine', 'pug');
//app.set('views', 'views');
app.set('views', path.join(__dirname, 'views'))

const adminData = require('./routes/admin');
const shopRoutes = require('./routes/shop');

// It will do while request body parsing we had to do manually in the previous section.
// This will not parse all kinds of possible bodies. This will parse bodies like sent trhough the form.
app.use(bodyParser.urlencoded({extended: false})); 
app.use(express.static(path.join(__dirname, 'public')));

app.use('/admin', adminData.routes);
app.use(shopRoutes);

app.use((req, res, next) => {
//  res.status(404).sendFile(path.join(__dirname, 'views', '404.html'));
  res.status(404).render('404', {pageTitle: '404 error'});
});

app.listen(3000);
