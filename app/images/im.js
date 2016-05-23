/* on a jamais fait CA ! */
module.exports = function(app) {
    'use strict';
    var formidable = require('formidable'); // package for image resizing
    var fs = require('fs-extra'); // package for image resizing
    var qt = require('quickthumb'); // package for image resizing
    var im = require('imagemagick'); // package for image resizing
    var mmm = require('mmmagic').Magic;

    app.use(qt.static(__dirname + '/'));
    app.post('/picture', function(req, res) {

        var howManyFileProcessed = 0,
            wdth = 0,
            hgth = 0,
            path = 'junk',
            id = '',
            whatAmI = 'trash',
            new_location = 'uploads/';


        new formidable.IncomingForm()
            .parse(req, function(err, fields, files) {
                if (err) {
                    console.error(err);
                }
            })
            .on('field', function(name, field) {
                if (name == 'width' && field < 2000) {
                    wdth = field;
                }
                if (name == 'height' && field < 2000) {
                    hgth = field;
                }
                if (name == 'title') {
                    id = field;

                    var splitMePlease = field.split('/');
                    if (splitMePlease.length == 2) {
                        id = splitMePlease[1];
                        whatAmI = splitMePlease[0]; //places or user
                    } else {
                        id = field;
                    }

                    path = field;
                    new_location += path + '/';
                    fs.stat(new_location + 'thumb', function(err, stats) {
                        if (!err) {
                            fs.readdir(new_location + 'thumb', function(err, files) {
                                howManyFileProcessed += files.length;
                            });
                        }
                    });
                }
            })

        .on('file', function(name, f) {
            howManyFileProcessed++;
            if (howManyFileProcessed < 8 && (whatAmI == 'places' || whatAmI == 'user')) {
                // Temporary location of our uploaded file //
                var temp_path = f.path;
                // The file name of the uploaded file //
                var file_name = f.name;
                // Location where we want to copy the uploaded file //
                var magic = new mmm();
                magic.detectFile(temp_path, function(err, result) {
                    if (err) {
                        console.log(err);
                    } else {
                        if (result.indexOf('image') != -1 && path != 'junk' && wdth !== 0 && !isNaN(Number(wdth)) && hgth !== 0 && !isNaN(Number(hgth)) && path.indexOf('..') === -1 && path !== '') {
                            fs.copy(temp_path, new_location + file_name, function(err) {
                                if (err) {
                                    console.error(err);
                                } else {
                                    // Delete the "temp" file
                                    fs.unlink(temp_path, function(err) {
                                        if (err) {
                                            console.error(err);
                                        } else {
                                            if (!fs.existsSync(new_location + 'thumb')) {
                                                fs.mkdirSync(new_location + 'thumb');
                                            }
                                            im.crop({
                                                srcPath: new_location + file_name,
                                                dstPath: new_location + 'thumb/img_' + file_name,
                                                width: Number(wdth),
                                                height: Number(hgth),
                                                quality: 1,
                                                gravity: "North"
                                            }, function(err, stdout, stderr) {
                                                if (err) {
                                                    console.log(err);
                                                } else {
                                                    console.log('One file uploaded & croped with success');
                                                }
                                            });
                                        }
                                    });
                                }
                            });
                        } else {
                            fs.unlink(temp_path);
                            console.log('Someone try to upload ' + file_name + ' with a height of ' + hgth + ' and a width of ' + wdth + ', he want to write to ' + path + ', the server denied this');
                        }
                    }
                });
            } else {
                howManyFileProcessed--;
                fs.unlink(f.path);
            }
        })

        .on('end', function(fields, files) {
            var interValeuh = setInterval(function() {
                fs.readdir(new_location + 'thumb', function(err, files) {
                    if (!err) {
                        if (files.length == howManyFileProcessed) {
                            clearInterval(interValeuh);
                            fs.stat(new_location + 'thumb', function(err, stats) {
                                if (!err) {
                                    var processed = 0;
                                    fs.readdir(new_location, function(error, files) {
                                        var caption = [];
                                        files.forEach(function(file) {
                                            if (file.indexOf('.') != -1) {
                                                caption.push(processed + file.substr(file.lastIndexOf('.')));
                                                fs.renameSync(new_location + file, new_location + processed + file.substr(file.lastIndexOf('.')));
                                                fs.renameSync(new_location + 'thumb/img_' + file, new_location + 'thumb/img_' + processed + file.substr(file.lastIndexOf('.')));
                                                processed++;
                                            }
                                        });
                                        console.log("File processing ended - " + processed + " files done");
                                        console.log(caption);
                                        var Place = require('../models/places.js');
                                        if (whatAmI == 'places') {
                                            var req2 = {
                                                body: {
                                                    content: {
                                                        picture: caption[0],
                                                        caption: caption.slice(1)
                                                    }
                                                },
                                                params: {
                                                    id: id
                                                }
                                            };
                                            Place.updateAndDontUpdate(req2, res);
                                        }
                                    });
                                }
                            });
                        }
                    }
                });
            }, 1000);
            if (whatAmI == 'places' || whatAmI == 'user') {
                if (!res.headersSent) res.send('<script>window.location="/#/picture";</script>');
            } else if (!res.headersSent) {
                res.sendStatus(403);
            }
            return;
        });
    });
};
