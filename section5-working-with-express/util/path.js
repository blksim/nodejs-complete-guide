const path = require('path');
// function that helps construct a path to the parent directory
module.exports = path.dirname(module.filename); 
// this gives us the path to the file that is responsible for the fact that our application is running
// and this file name is what we put into dirname() to get a path to that direcgtory.
