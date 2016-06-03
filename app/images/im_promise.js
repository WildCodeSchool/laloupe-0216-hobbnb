/* Promise based */
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
            wdth = 200,
            hgth = 200,
            path = 'junk',
            id = '',
            whatAmI = 'trash',
            new_location = 'public/uploads/';

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
                        if (!fs.existsSync(new_location)) {
                            fs.mkdirSync(new_location);
                        }
                        if (!fs.existsSync(new_location + whatAmI)) {
                            fs.mkdirSync(new_location + whatAmI);
                        }
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
            if (howManyFileProcessed < 8 && (whatAmI == 'places' || whatAmI == 'users' || whatAmI == 'spots')) {
                // Temporary location of our uploaded file //
                var temp_path = f.path;
                // The file name of the uploaded file //
                var file_name = f.name;
                if (!fs.existsSync(new_location)) {
                    fs.mkdirSync(new_location);
                }
                if (!fs.existsSync(new_location + 'thumb')) {
                    fs.mkdirSync(new_location + 'thumb');
                }
                if (!fs.existsSync(new_location + 'large')) {
                    fs.mkdirSync(new_location + 'large');
                }
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
                                            im.crop({
                                                srcPath: new_location + file_name,
                                                dstPath: new_location + 'thumb/img_' + file_name,
                                                width: Number(wdth) / 4,
                                                height: Number(hgth) / 4,
                                                quality: 1,
                                                gravity: "North"
                                            }, function(err, stdout, stderr) {
                                                if (err) {
                                                    console.log(err);
                                                } else {
                                                    console.log('One file uploaded & croped with success');
                                                    im.crop({
                                                        srcPath: new_location + file_name,
                                                        dstPath: new_location + 'large/img_' + file_name,
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
            var timeBlock = new Promise(function(resolve, reject) {
                var interValeuh = setInterval(function() {
                    fs.readdir(new_location + 'large', function(err, files) {
                        if (!err) {
                            if (files.length == howManyFileProcessed) {
                                clearInterval(interValeuh);
                                fs.stat(new_location + 'large', function(err, stats) {
                                    if (!err) {
                                        var processed = 0;
                                        fs.readdir(new_location, function(error, files) {
                                            var caption = [];
                                            files.forEach(function(file) {
                                                if (file.indexOf('.') != -1) {
                                                    caption.push(processed + file.substr(file.lastIndexOf('.')));
                                                    fs.renameSync(new_location + file, new_location + processed + file.substr(file.lastIndexOf('.')));
                                                    fs.renameSync(new_location + 'thumb/img_' + file, new_location + 'thumb/img_' + processed + file.substr(file.lastIndexOf('.')));
                                                    fs.renameSync(new_location + 'large/img_' + file, new_location + 'large/img_' + processed + file.substr(file.lastIndexOf('.')));
                                                    processed++;
                                                }
                                            });
                                            console.log("File processing ended - " + processed + " files done");
                                            console.log(caption);
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
                                            if (whatAmI == 'places' || whatAmI == 'spots') {
                                                var DBase = require('../models/' + whatAmI + '.js');
                                                DBase.updateAndDontUpdate(req2, res);
                                            }
                                            resolve(1);
                                        });
                                    }
                                });
                            }
                        }
                    });
                }, 500);
            }).then(function() {
                if (whatAmI == 'places' || whatAmI == 'spots') {
                    if (!res.headersSent) {
                        var interValeuh2 = setInterval(function() {
                            fs.readdir(new_location + 'large', function(err, files) {
                                if (!err) {
                                    if (files.length == howManyFileProcessed) {
                                        clearInterval(interValeuh2);
                                        if (files.length == 1) {
                                            res.redirect('/#/picture/' + whatAmI + '/1/' + id);
                                        } else {
                                            res.redirect('/#/' + whatAmI.substr(0, whatAmI.length - 1) + '/' + id);
                                        }
                                        res.end();
                                    }
                                }
                            });
                        }, 500);
                    }
                } else if (whatAmI == 'users') {
                    res.redirect('/#/user/' + id);
                    res.end();
                } else if (!res.headersSent) {
                    res.sendStatus(403);
                }
            });
            return;
        });
    });
};
