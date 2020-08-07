const mysql = require('mysql2');

const pool = mysql.createPool({
  host: 'localhost', 
  user: 'root',
  database: 'node_complete',
  password: 'nodecomplete'
});

/* allow us to use pomise when working with these connections
which of course handle asyncronous tasks, asynchronous data 
instead of callbacks because promises allow us to write code a bit more structured way.
 */
module.exports = pool.promise(); 