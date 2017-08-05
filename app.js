const express = require('express');
const fs = require('fs');
const path = require('path');
const Busboy = require('busboy');
const app = express();
//app.use(busboy());
app.get('/', function (req, res) {
  res.sendFile(__dirname + '/index.html');
});

app.post('/new', function(req, res) {
     var busboy = new Busboy({headers: req.headers});
     busboy.on('file', function(fieldname, file, filename, encoding, mimetype) {
       var saveTo = path.join('./appdata', filename);
       console.log('logged');
       file.pipe(fs.createWriteStream(saveTo));
     });
     busboy.on('finish', function(){
       res.writeHead(200, {'Connection': 'close'});
       res.end('complete');
     });
     return req.pipe(busboy);
});

app.listen(3000, function () {
  console.log('Example app listening on port 3000!')
});
