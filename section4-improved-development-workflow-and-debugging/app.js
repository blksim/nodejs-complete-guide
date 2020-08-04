const http = require('http');// import global module
// the file content here is actually cached by node and we can't edit it externally,
// and we can't edit it externally.
// so if we somehow would define routes as an object and we tried to add a new property on the fly here, this would not manipulate the original file.
// so this is basically locked, not accessible from outside.
const routes = require('./routes');
const server = http.createServer(routes.handler);

console.log(routes.someText);
server.listen(3000); // starts a process