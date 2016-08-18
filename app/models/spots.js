// MODEL SPOTS
var mongoose = require('mongoose');
var formidable = require('formidable');
var im = require('imagemagick');
var path = require('path');
var fs = require('fs');
logger = require('../logs/Logger');

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
    pictures: [String],
    latitude: Number,
    longitude: Number,
    address: {
        administrative_area_level_1: String,
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
        popularity: {
            type: Number,
            max: 5,
            min: 0,
            default: 0
        },
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
        }],
        overallRating: {
            type: Number,
            max: 5,
            min: 0,
            default: 0
        }
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

    create: function(req, res) {
        Spots.model.create(req.body, function(err, data) {
            if (err) {
                logger.error('An error has occured in Place create: ', err);
                res.status(400).send(err);
            } else {
                logger.info('>> SPOT: ', data._id, ' / ', data.name, ' WAS CREATED BY: ', data.owner);
                res.send(data);
            }
        });
    },

    uploadImages: function(req, res) {

        var fileCount = 0,
            processedFileCount = 0,
            pictures = [],
            totalFiles = 0,
            width = 1200;
        var targetPath = './public/uploads/spots/' + req.params.spotId + '/';

        if (!fs.existsSync('./public/uploads/spots/')) fs.mkdirSync('./public/uploads/spots/');
        if (!fs.existsSync(targetPath)) fs.mkdirSync(targetPath);
        if (!fs.existsSync(targetPath + 'thumb')) fs.mkdirSync(targetPath + 'thumb');
        if (!fs.existsSync(targetPath + 'large')) fs.mkdirSync(targetPath + 'large');

        logger.info('>> Create SPOT ID: ', req.params.spotId, ' upload begin.');

        var form = new formidable.IncomingForm();
        form.multiples = true;
        form.on('progress', function(bytesReceived, bytesExpected) {
            logger.info('Progress so far: ', (100 * (bytesReceived / bytesExpected)), "%  or  ", bytesReceived, 'bytes');
        });
        form.on('field', function(field, value) {
            totalFiles = value;
        });
        form.on('fileBegin', function(name, file) {
            fileCount++;
            file.name = fileCount + file.name.substr(file.name.lastIndexOf('.'));
            logger.info('-- File: ', file.name, ' upload started');
            pictures.push(file.name);
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
                        logger.info('Upload and resize complete for SPOT ID: ', req.params.spotId, ' an for image:', file.name, ' ', processedFileCount, ' / ', totalFiles);
                        if (totalFiles == processedFileCount) Spots.updateAndDontUpdate(req.params.spotId, pictures, res);
                    });
                });
            });
        });
        form.on('error', function(err) {
            logger.error('An error has occured during upload process: ', err);
        });
        form.parse(req);
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
        });
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

    updateAndDontUpdate: function(spotId, pictures, res) {
        Spots.model.findByIdAndUpdate(spotId, {
            $set: {
                pictures: pictures
            }
        }, function(err) {
            if (err) {
                logger.error('An error has occured in Spot create DB upload: ', err);
                res.status(400).send(err);
            } else {
                logger.info('>>   ------ DB updates with pictures! ------');
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
