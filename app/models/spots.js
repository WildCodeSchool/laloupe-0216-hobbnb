// MODEL PLACES
var mongoose = require('mongoose');
var formidable = require('formidable');
var im = require('imagemagick');
var path = require('path');
var fs = require('fs');

var hobbiesListing = ["Randonnée", "VTT", "Cyclisme", "Equitation", "Pêche", "Plongée", "Golf", "Escalade", "Canoë Kayak", "Surf", "Stand up Paddle", "Kitesurf", "Windsurf", "Ski", "Alpinisme", "Parapente", "Spéléologie", "Cannoning"];

var spotsSchema = new mongoose.Schema({
    isActive: Boolean,
    owner: String,
    creation: Date,
    modification: Date,
    name: {
        type: String,
        required: [true, 'title required']
    },
    picture: String,
    caption: [String],
    latitude: Number,
    longitude: Number,
    address: {
        administrative_area_level_1: {
            type: String,
            required: [true, 'state required']
        },
        country: {
            type: String,
            required: [true, 'country required']
        },
        street_number: Number,
        route: String,
        locality: String,
        postal_code: {
            type: String,
            validate: {
                validator: function(v) {
                    return /^[0-9]{5}$/.test(Number(v));
                },
                message: '{VALUE} is not a valid postal code number!'
            },
            required: [true, 'postal code number required']
        },
        complement: String
    },
    rating: {
        quality: [{
            type: Number,
            max: 5,
            min: 0
        }],
        beauty: [{
            type: Number,
            max: 5,
            min: 0
        }],
        accessibility: [{
            type: Number,
            max: 5,
            min: 0
        }]
    },
    about: String,
    primarySports: {
        type: String,
        enum: hobbiesListing
    },
    secondarySports: [{
        type: String,
        enum: hobbiesListing
    }],
    comments: [{
        owner: String,
        title: String,
        creation: Date,
        comment: String,
        thanks: Number
    }]
});

var Spots = {

    model: mongoose.model('Spots', spotsSchema),

    uploadImages: function(req, res) {

        var fileCount = 0,
            processedFileCount = 0,
            caption = [],
            totalFiles = 0,
            width = 1200;
        var targetPath = './public/uploads/spots/' + req.params.spotId + '/';

        if (!fs.existsSync('./public/uploads/spots/')) fs.mkdirSync('./public/uploads/spots/');
        if (!fs.existsSync(targetPath)) fs.mkdirSync(targetPath);
        if (!fs.existsSync(targetPath + 'thumb')) fs.mkdirSync(targetPath + 'thumb');
        if (!fs.existsSync(targetPath + 'large')) fs.mkdirSync(targetPath + 'large');

        var form = new formidable.IncomingForm();
        form.multiples = true;
        form.on('field', function(field, value) {
            totalFiles = value;
        });
        form.on('fileBegin', function(name, file) {
            fileCount++;
            file.name = fileCount + file.name.substr(file.name.lastIndexOf('.'));
            caption.push(file.name);
        });
        form.on('file', function(name, file) {
            var tmpPath = file.path;
            im.resize({
                srcPath: tmpPath,
                dstPath: targetPath + 'large/img_' + file.name,
                width: width
            }, function(err) {
                if (err) throw err;
                im.resize({
                    srcPath: tmpPath,
                    dstPath: targetPath + 'thumb/img_' + file.name,
                    width: width / 4
                }, function(err) {
                    if (err) throw err;
                    fs.unlink(tmpPath, function(err) {
                        if (err) throw err;
                        processedFileCount++;
                        console.log("Upload complete for spot ID: " + req.params.spotId + ' an for image:' + file.name + ' ' + caption.length + ' / ' + totalFiles);
                        if (totalFiles == processedFileCount) Spots.updateAndDontUpdate(req.params.spotId, caption, res);
                    });
                });
            });
        });
        form.on('error', function(err) {
            console.log('An error has occured: \n' + err);
        });
        form.parse(req);
    },

    create: function(req, res) {
        Spots.model.create(req.body.content, function(err, data) {
            if (err) {
                res.send(err);
            } else {
                res.send(data);
            }
        });
    },

    findOne: function(req, res) {
        Spots.model.findById(req.params.id, function(err, data) {
            if (err) {
                res.send(err);
            } else {
                res.send(data);
            }
        });
    },

    findOneAndReturn: function(req, res) {
        return Spots.model.findById(req.params._id);
    },

    findSpotsOfUser: function(req, res) {
        Spots.model.find({
            owner: req.params.id
        }, function(err, data) {
            if (err) {
                res.send(err);
            } else {
                res.send(data);
            }
        })
    },

    findAll: function(req, res) {
        Spots.model.find(function(err, data) {
            if (err) {
                res.send(err);
            } else {
                res.send(data);
            }
        });
    },

    update: function(req, res) {
        Spots.model.findByIdAndUpdate(req.params.id, req.body.content, function(err, data) {
            if (err) {
                res.send(err);
            } else {
                res.send(data);
            }
        });
    },

    updateAndDontUpdate: function(placeId, caption, res) {
        Spots.model.findByIdAndUpdate(placeId, {
            $set: {
                caption: caption
            }
        }, function(err) {
            if (err) {
                console.log(err);
                res.send(err);
            } else {
                console.log('DB updates with caption!');
                res.sendStatus(200);
            }
        });
    },

    delete: function(req, res) {
        Spots.model.findByIdAndRemove(req.params.id, function(err) {
            if (err) {
                res.send(err);
            } else {
                res.sendStatus(200);
            }
        });
    }
};

module.exports = Spots;
