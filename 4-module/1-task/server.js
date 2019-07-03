const url = require('url');
const http = require('http');
const path = require('path');
const fs = require('fs');

const server = new http.Server();

server.on('request', (req, res) => {
  const pathname = url.parse(req.url).pathname.slice(1);
  const pathExtLength = pathname.split('/');
  const filepath = path.join(__dirname, 'files', pathname);

  switch (req.method) {
    case 'GET':
      if (fs.existsSync(filepath)) {
        const readStream = fs.createReadStream(filepath);
        res.statusCode = 200;
        readStream.pipe(res);
      } else if (pathExtLength.length > 1) {
        res.statusCode = 400;
        res.end('no ext directory');
      } else {
        res.statusCode = 404;
        res.end('no such directory');
      }
      break;

    default:
      res.statusCode = 501;
      res.end('Not implemented');
  }
});

module.exports = server;
