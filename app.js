const express = require('express');
const fs = require('fs');
const path = require('path');
const Busboy = require('busboy');
const app = express();

app.get('/', function (req, res) {
  res.sendFile(__dirname + '/index.html');
});

const photoMimeTypes = [
    'image/png',
    // 'image/jpeg',
    'image/gif',
];

app.post('/new', function(req, res) {
     var busboy = new Busboy({headers: req.headers, limits: { files: 1, fileSize: 50000}});
     var invalidFile = false;

     busboy.on('file', function(fieldname, file, filename, encoding, mimetype) {
       var saveTo = path.join('./appdata', filename);

       file.on('limit', function() {
           console.log('file too large');
           invalidFile = true;
           file.resume();
           return;
       });

       if (!photoMimeTypes.includes(mimetype)){
           console.log('wrong file type');
           invalidFile = true;
           file.resume();
       }

       if(invalidFile) {
           return;
       }

       console.log('logged');
       file.pipe(fs.createWriteStream(saveTo));
     });

     busboy.on('finish', function(){
         console.log(invalidFile);
         if (invalidFile) {
             res.writeHead(400, {'Connection': 'close'});
         } else {
            res.writeHead(200, {'Connection': 'close'});
         }
       res.end('complete');
     });
     return req.pipe(busboy);
});

app.listen(3000, function () {
  console.log('Example app listening on port 3000!')
});
