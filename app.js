const express = require('express');
const fs = require('fs');
const path = require('path');
const Busboy = require('busboy');
const Config = require('./config.js');
const app = express();
const env_vars = Config();
const Db = require('mongodb').Db;
const MongoClient = require('mongodb').MongoClient;
const Server = require('mongodb').Server;
const ReplSetServers = require('mongodb').ReplSetServers;
const ObjectID = require('mongodb').ObjectID;
const Binary = require('mongodb').Binary;
const GridStore = require('mongodb').GridStore;
const Grid = require('mongodb').Grid;
const Code = require('mongodb').Code;
const BSON = require('mongodb').BSON;
const assert = require('assert');

// start the db server, janky because it happens every time the app starts.
const db = new Db('test', new Server('localhost', 27017));

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

        // get the desired table from the db.

        db.open(function(err, db){
          var collection = db.collection("filePaths");
          collection.insert({location : saveTo});
          //collection.find().forEach(console.log());
          db.close();
        });
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
