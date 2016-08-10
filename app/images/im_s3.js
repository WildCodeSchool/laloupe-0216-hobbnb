/* Promise based */
module.exports = function(app) {
    'use strict';

    var formidable = require('formidable'),
        fs = require('fs-extra'),
        qt = require('quickthumb'),
        im = require('imagemagick'),
        mmm = require('mmmagic').Magic,
        jwt = require('jsonwebtoken'),
        s3 = require('s3'),
        secretToken = require('../../config/secretToken.js'),
        client = s3.createClient({
            maxAsyncS3: 20,
            s3RetryCount: 3,
            s3RetryDelay: 1000,
            multipartUploadThreshold: 20971520,
            multipartUploadSize: 15728640,
            s3Options: require('../../config/s3.js').s3Options,
        });;

    app.post('/api/picture', function(req, res) {
        var deleteFolderRecursive = function(path) {
            if (fs.existsSync(path)) {
                fs.readdirSync(path).forEach(function(file, index) {
                    var curPath = path + "/" + file;
                    if (fs.lstatSync(curPath).isDirectory()) { // recurse
                        deleteFolderRecursive(curPath);
                    } else { // delete file
                        fs.unlinkSync(curPath);
                    }
                });
                fs.rmdirSync(path);
            }
        };

        var isAuth = false,
            howManyFileProcessed = 0,
            maxFiles = 7,
            wdth = 200,
            hgth = 200,
            path = 'junk',
            id = '',
            ownerTarget = 'nobody',
            whatAmI = 'trash',
            new_location = 'public/uploads/',
            promise;

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
                        whatAmI = splitMePlease[0]; //places, spots or users
                        if (!fs.existsSync(new_location)) {
                            fs.mkdirSync(new_location);
                        }
                        if (!fs.existsSync(new_location + whatAmI)) {
                            fs.mkdirSync(new_location + whatAmI);
                        }
                        if (whatAmI === 'users') {
                            maxFiles = 1; // Only one profile pic
                            ownerTarget = id;
                        }
                        if (whatAmI == 'places' || whatAmI == 'spots') {
                            var DBase = require('../models/' + whatAmI + '.js');
                            var req2 = {
                                params: {
                                    _id: id
                                }
                            };
                            promise = DBase.findOneAndReturn(req2, res).then(function(doc) {
                                var found = doc;
                                ownerTarget = found.owner;
                            });
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
                if (name == 'authorization') {
                    if (whatAmI == 'users') {
                        jwt.verify(field, secretToken, function(err, decoded) {
                            if (decoded._doc && ownerTarget && decoded._doc._id == ownerTarget) {
                                isAuth = true;
                            }
                        });
                    } else {
                        promise.then(function() {
                            jwt.verify(field, secretToken, function(err, decoded) {
                                if (decoded._doc && ownerTarget && decoded._doc._id == ownerTarget) {
                                    isAuth = true;
                                }
                            });
                        });
                    }
                }
            })

        .on('file', function(name, f) {
            if (isAuth) {
                if (howManyFileProcessed == maxFiles && whatAmI == 'users') {
                    deleteFolderRecursive(new_location);
                    howManyFileProcessed--;
                }
                howManyFileProcessed++;
                if (howManyFileProcessed <= maxFiles && (whatAmI == 'places' || whatAmI == 'users' || whatAmI == 'spots')) {
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
            }
        })

        .on('end', function(fields, files) {
            if (isAuth) {
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
                                                if (whatAmI == 'users') {
                                                    var req2 = {
                                                        body: {
                                                            content: {
                                                                picture: caption[0]
                                                            }
                                                        },
                                                        params: {
                                                            id: id
                                                        }
                                                    };
                                                }
                                                if (whatAmI == 'places' || whatAmI == 'spots' || whatAmI == 'users') {
                                                    var DBase = require('../models/' + whatAmI + '.js');
                                                    DBase.updateAndDontUpdate(req2, res);
                                                }
                                                resolve(1);
                                            });
                                        } else {
                                          console.log(err);
                                        }
                                    });
                                }
                            } else {
                              console.log(err);
                            }
                        });
                    }, 500);
                }).then(function() {
                    if (whatAmI == 'places' || whatAmI == 'spots' || whatAmI == 'users') {
                        if (!res.headersSent) {
                            var interValeuh2 = setInterval(function() {
                                fs.readdir(new_location + 'large', function(err, files) {
                                    if (!err) {
                                        if (files.length == howManyFileProcessed) {
                                            clearInterval(interValeuh2);
                                            var params = {
                                                localDir: "public/upload/",
                                                deleteRemoved: false,
                                                s3Params: require('../../config/s3.js').s3Params,
                                            };
                                            client.downloadDir(params).on('end', function(){
                                                client.uploadDir(params)
                                                .on('error', function(err) {
                                                    console.error("unable to sync:", err.stack);
                                                    res.send('Erreur de sync avec S3');
                                                    res.end();
                                                })
                                                .on('progress', function() {
                                                    console.log("progress", uploader.progressAmount, uploader.progressTotal);
                                                }).on('end', function() {
                                                    console.log("done uploading");
                                                    if (files.length == 1 && whatAmI != 'users') {
                                                        res.redirect('/#/picture/' + whatAmI + '/1/' + id);
                                                    } else {
                                                        res.redirect('/#/' + whatAmI.substr(0, whatAmI.length - 1) + '/' + id);
                                                    }
                                                    res.end();
                                                });
                                            })
                                        }
                                    }
                                });
                            }, 500);
                        }
                    } else if (!res.headersSent) {
                        res.sendStatus(403);
                    } else {
                        res.end();
                    }
                });
                return;
            } else {
                res.sendStatus(403);
            }
        });
    });
};
