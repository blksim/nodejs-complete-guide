const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');

// It will do while request body parsing we had to do manually in the previous section.
// This will not parse all kinds of possible bodies. This will parse bodies like sent trhough the form.
app.use(bodyParser.urlencoded({extended: false})); 
app.use('/admin', adminRoutes);

app.use(shopRoutes);
app.use(express.static(path.join(__dirname, 'public')));

app.use((req, res, next) => {
  res.status(404).sendFile(path.join(__dirname, 'views', '404.html'));
});

app.listen(3000);
