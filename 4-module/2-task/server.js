const url = require('url');
const http = require('http');
const path = require('path');
const fs =require('fs');
const server = new http.Server();
const LimitSize = require('./LimitSizeStream');

server.on('request', (req, res) => {
  const pathname = url.parse(req.url).pathname.slice(1);
  const filepath = path.join(__dirname, 'files', pathname);
  const limitSizeStream = new LimitSize({limit: 1048576});

  switch (req.method) {
    case 'POST':
      const writeStream = fs.createWriteStream(filepath, {flags: 'wx'});
      req.pipe(limitSizeStream).pipe(writeStream);

      writeStream.on('error', (err) => {
        if (err.code === 'EEXIST') {
          res.statusCode = 409;
          res.end('file already exists');
        } else if (err.code === 'ENOTDIR') {
          res.statusCode = 400;
          res.end('no such directory');
        } else {
          res.statusCode = 500;
          res.end('internal error');
        }
      });

      writeStream.on('close', () => {
        res.statusCode = 201;
        res.end('file saved successfully');
      });

      limitSizeStream.on('error', (err) => {
        res.statusCode = 413;
        res.end('file max size exceeded');
        fs.unlink(filepath, () => {});
      });

      res.on('close', () => {
        if (res.finished) return;
        fs.unlink(filepath, () => {
          res.end('aborted');
        });
      })

      break;

    default:
      res.statusCode = 501;
      res.end('Not implemented');
  }
});

module.exports = server;
