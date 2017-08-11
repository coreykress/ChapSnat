const express = require('express');
const fs = require('fs');
const path = require('path');
const Busboy = require('busboy');
const Config = require('./config.js');
const app = express();
const env_vars = Config();

console.log(env_vars);

app.get('/', function (req, res) {
    res.sendFile(__dirname + '/index.html');
});

const photoMimeTypes = [
    'image/png',
    'image/jpeg',
    'image/gif',
];

app.post('/new', function (req, res, next) {
    var busboy = new Busboy({headers: req.headers, limits: {files: 1, fileSize: 50000}});
    var invalidFile = false;
    var err = null;

    busboy.on('file', function (fieldname, file, filename, encoding, mimetype) {
        var saveTo = path.join('./appdata', filename);

        //file.on('limit', function() {
        //    console.log('file too large');
        //    err = new Error();
        //    err.status = 400;
        //    err.message = 'File Too Large';
        //});

        if (!photoMimeTypes.includes(mimetype)) {
            console.log('wrong file type');
            err = new Error();
            err.status = 400;
            err.message = 'Invalid File Type';
        }

        if (err !== null) {
            next(err);
        }

        console.log('logged');
        file.pipe(fs.createWriteStream(saveTo));
    });

    busboy.on('finish', function () {
        res.status(200);

        res.end('complete');
    });
    return req.pipe(busboy);
});

app.get('*', function (req, res, next) {
    var err = new Error();
    err.status = 404;
    err.message = 'Page Not Found';
    next(err);
});

app.use(function (err, req, res, next) {
    if (!err) {
        next();
    }

    res.status(err.status);
    res.json(err);
});

app.listen(3000, function () {
    console.log('Example app listening on port 3000!')
});
