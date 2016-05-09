module.exports = function(app) {
	'use strict';
    var formidable = require('formidable'); // package for image resizing
    var util = require('util'); // package for test and inspect
    var fs = require('fs-extra'); // package for image resizing
    var qt = require('quickthumb'); // package for image resizing
    var im = require('imagemagick'); // package for image resizing
    app.use(qt.static(__dirname + '/'));
    app.post('/upload', function(req, res) {
        var form = new formidable.IncomingForm();

          var wdth = 0, hgth = 0;
        form.parse(req, function(err, fields, files) {
            wdth = fields.width, hgth = fields.height;
            if (err) {
                console.error(err);
            } else {
            res.writeHead(200, {
                'content-type': 'text/plain'
            });
          }
            res.write('received upload:\n\n');
            res.end(util.inspect({
                fields: fields,
                files: files
            }));
        });

        form.on('progress', function(bytesReceived, bytesExpected) {
            var percent_complete = (bytesReceived / bytesExpected) * 100;
            console.log('Progress so far: ' + percent_complete.toFixed(2) + " %");
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
                                dstPath: new_location + 'thumb/thumb_' + file_name,
                                width: Number(wdth),
                                height: Number(hgth),
                                quality: 1,
                                gravity: "North"
                            }, function(err, stdout, stderr) {
                              if(err) {
                                console.log(err);
                              }
                            });
                        }
                    });
                }
            });
        });
    });
};
