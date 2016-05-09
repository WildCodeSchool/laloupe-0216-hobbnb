// set up ======================================================================
var http = require('http');
var express = require('express');
var app = express(); // create our app w/ express
var formidable = require('formidable'); // package for image resizing
var util = require('util'); // package for test and inspect
var fs = require('fs-extra'); // package for image resizing
var qt = require('quickthumb'); // package for image resizing
var im = require('imagemagick'); // package for image resizing
var port = process.env.PORT || 8000; // set the port
var morgan = require('morgan');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
// configuration ===============================================================
app.use(express.static(__dirname + '/public')); // set the static files location /public/img will be /img for users
app.use(morgan('dev')); // log every request to the console
app.use(bodyParser.urlencoded({
    'extended': 'true'
})); // parse application/x-www-form-urlencoded
app.use(bodyParser.json()); // parse application/json
app.use(bodyParser.json({
    type: 'application/vnd.api+json'
})); // parse application/vnd.api+json as json
app.use(methodOverride('X-HTTP-Method-Override')); // override with the X-HTTP-Method-Override header in the request
// Use quickthumb ==================================================================
app.use(qt.static(__dirname + '/'));

app.post('/upload', function(req, res) {

    var form = new formidable.IncomingForm();

    form.parse(req, function(err, fields, files) {
        res.writeHead(200, {
            'content-type': 'text/plain'
        });
        res.write('received upload:\n\n');
        res.end(util.inspect({
            fields: fields,
            files: files
        }));
    });

    form.on('progress', function(bytesReceived, bytesExpected) {
        var percent_complete = (bytesReceived / bytesExpected) * 100;
        console.log('Progress so far: '+ percent_complete.toFixed(2) +" %");
    });

    form.on('end', function(fields, files) {
        // Temporary location of our uploaded file //
        var temp_path = this.openedFiles[0].path;
        // The file name of the uploaded file //
        var file_name = this.openedFiles[0].name;
        // Location where we want to copy the uploaded file //
        var new_location = 'uploads/';

        fs.copy(temp_path, new_location + file_name, function(err) {
            if (err) {
                console.error(err);
            } else {
                console.log("success!");
                // Delete the "temp" file
                fs.unlink(temp_path, function(err) {
                    if (err) {
                        console.error(err);
                        console.log("TROUBLE deleted temp !");
                    } else {
                        console.log("success deleted temp !");
                        im.crop({
                          srcPath: new_location + file_name,
                          dstPath: new_location + "thumb_" + file_name,
                          width: 200,
                          height: 200,
                          quality: 1,
                          gravity: "North"
                        }, function(err, stdout, stderr){
                          // foo
                        });
                    }
                });
            }
        });
    });
});
// Mongoose ====================================================================
require('./config/database');
// Serveur ===================================================================
var server = http.Server(app);
// routes ======================================================================
require('./app/routes')(app);
process.on('SIGINT', function() {
    console.log('Stopping...');
    process.exit();
});
// listen (start app with node server.js) ======================================
server.listen(port);
console.log('App listening on port ' + port);
