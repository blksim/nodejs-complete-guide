const fs = require('fs');

const requestHandler = (req, res) => {
  const url = req.url;
  const method = req.method;
  if (url === '/') {
    res.setHeader('Content-Type', 'text/html');
    res.write('<html>');
    res.write('<head>Enter a message</head>');
    res.write('<body><form action="/message" method="POST"><input type="text" name="message" placeholder="enter the message"></input><button type="submit">Send</button><form></body>');
    res.write('</html>');
    return res.end();  
   }
   if (url === '/message' && method === 'POST') {
    const body = []; 
    req.on('data', (chunk) => { // when new chunk is ready to be read
      console.log(chunk);
      body.push(chunk);
     }) 
    req.on('end', () => { // when parsing has done
      const parsedBody = Buffer.concat(body).toString();
      const message = parsedBody.split('=')[1];
      fs.writeFile('message.txt', message, (err) => {
        res.statusCode = 302; // Cannot set headers after they are sent to the client
        res.setHeader('Location', '/');
        
    // code executed too early.
  //  res.setHeader('Content-Type', 'text/html');
  //  res.write('<html>');
  //  res.write('<head><title>my first page</title></head>');
  //  res.write('<body><h1>hello from my node.js server</h1></body>');
  //  res.write('</html>');
  //  res.end();
        return res.end();
      });
    });
  }
};


// module.exports = requestHandler;

// module.exports = {
//   hnandler: requestHandler,
//   someText: 'some hard coded text'
// };

// equivalent to above
module.exports.handler = requestHandler;
module.exports.someText = 'some hardcoded text';