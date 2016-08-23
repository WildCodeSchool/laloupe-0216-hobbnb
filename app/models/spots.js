// MODEL SPOTS
var mongoose = require('mongoose');
mongoose.set('debug', true);
var formidable = require('formidable');
var gm = require('gm');
var fs = require('fs');
logger = require('../logs/Logger');

var hobbiesListing = ["Randonnée", "VTT", "Cyclisme", "Equitation", "Pêche", "Plongée", "Golf", "Escalade", "Canoë Kayak", "Surf", "Stand up Paddle", "Kitesurf", "Windsurf", "Ski", "Alpinisme", "Parapente", "Spéléologie", "Cannoning"];

var spotsCommentsSchema = new mongoose.Schema({
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Users'
    },
    date: {
        type: Date
    },
    title: {
        type: String,
        trim: true
    },
    comment: {
        type: String,
        trim: true
    },
    quality: {
        type: Number,
        max: 5,
        min: 0
    },
    beauty: {
        type: Number,
        max: 5,
        min: 0
    },
    accessibility: {
        type: Number,
        max: 5,
        min: 0
    }
});

var spotsSchema = new mongoose.Schema({
    isActive: Boolean,
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Users'
    },
    creation: {
        type: Date,
        default: Date.now()
    },
    modification: Date,
    name: {
        type: String,
        trim: true,
        required: [true, 'title required']
    },
    hobby: {
        type: String,
        enum: hobbiesListing
    },
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
        numberOfRatings: {
            type: Number,
            default: 0
        },
        overallRating: {
            type: Number,
            max: 5,
            min: 0,
            default: 0
        },
        quality: {
            type: Number,
            max: 5,
            min: 0,
            default: 0
        },
        beauty: {
            type: Number,
            max: 5,
            min: 0,
            default: 0
        },
        accessibility: {
            type: Number,
            max: 5,
            min: 0,
            default: 0
        }
    },
    about: {
        type: String,
        trim: true
    },
    comments: [spotsCommentsSchema]
});

var Spots = {

    model: mongoose.model('Spots', spotsSchema),

    comment: mongoose.model('Comment', spotsCommentsSchema),

    create: function(req, res) {
        Spots.model.create(req.body, function(err, data) {
            if (err) {
                logger.error('An error has occured in Spot create: ', err);
                res.status(400).send(err);
            } else {
                logger.info('>> SPOT: ', data._id, ' / ', data.name, ' WAS CREATED BY: ', data.owner);
                res.send(data);
            }
        });
    },

    addComment: function(req, res) {
        Spots.model.findById(req.params.id, function(err, spot) {
            if (err) console.log(err);
            var ratedBefore = spot.comments.filter(function(comment) {
                return comment.owner == req.body.owner;
            }).length;
            if (ratedBefore === 0) {
                spot.rating.quality = (spot.rating.quality * spot.rating.numberOfRatings + Number(req.body.quality)) / (spot.rating.numberOfRatings + 1);
                spot.rating.beauty = (spot.rating.beauty * spot.rating.numberOfRatings + Number(req.body.beauty)) / (spot.rating.numberOfRatings + 1);
                spot.rating.accessibility = (spot.rating.accessibility * spot.rating.numberOfRatings + Number(req.body.accessibility)) / (spot.rating.numberOfRatings + 1);
                spot.rating.overallRating = (spot.rating.quality + spot.rating.beauty + spot.rating.accessibility) / 3;
                spot.rating.numberOfRatings += 1;
                req.body.date = Date.now();
                spot.comments.push(req.body);
                spot.save(function(err) {
                    console.log(err);
                });
                logger.info('>> Un commentaire a été ajouté au spot', req.params.id, req.body);
                res.sendStatus(200);
            } else {
                logger.info('>>> Dèja commenter!');
                res.sendStatus(304);
            }
        });
    },

    uploadImages: function(req, res) {

        var fileCount = 0,
            processedFileCount = 0,
            pictures = [],
            totalFiles = 0,
            uploads = {},
            width = 1200,
            update = true;
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
            // file.name = fileCount + file.name.substr(file.name.lastIndexOf('.'));
            logger.info('-- File: ', file.name, ' upload started');
            pictures.push(file.name);
        });
        form.on('file', function(name, file) {
            var tmpPath = file.path;
            gm(tmpPath)
                .resize(width, width)
                .write(targetPath + 'large/' + file.name, function(err) {
                    if (err) throw err;
                    gm(tmpPath)
                        .resize(width / 4, width / 4)
                        .write(targetPath + 'thumb/' + file.name, function(err) {
                            if (err) throw err;
                            fs.unlink(tmpPath, function(err) {
                                if (err) throw err;
                                processedFileCount++;
                                logger.info('Upload and resize complete for SPOT ID: ', req.params.spotId, ' an for image:', file.name, ' ', processedFileCount, ' / ', totalFiles);
                                if (totalFiles == processedFileCount)(update === true) ? Spots.updatePicturesInDB(req.params.spotId, pictures, res) : res.sendStatus(200);
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
        Spots.model.findById(req.params.id)
            .populate('owner', 'identity rating email')
            .populate('comments.owner', 'identity rating email')
            .exec(function(err, data) {
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
        Spots.model.find()
            .populate('owner', 'identity rating email')
            .populate('comments.owner', 'identity rating email')
            .exec(function(err, data) {
                if (err) {
                    res.send(err);
                } else {
                    res.send(data);
                }
            });
    },

    update: function(req, res) {
        Spots.model.findByIdAndUpdate(req.params.id, req.body, function(err, data) {
            if (err) {
                res.send(err);
            } else {
                res.send(data);
            }
        });
    },

    updatePictures: function(req, res) {
        console.log(req.body);
        if (typeof req.body.removedPictures !== 'undefined' && req.body.removedPictures.length > 0) {
            req.body.removedPictures.forEach(function(picture) {
                fs.unlink('./public/uploads/spots/' + req.params.spotId + '/large/' + picture, function(err) {
                  if (err) throw err;
                      fs.unlink('./public/uploads/spots/' + req.params.spotId + '/thumb/' + picture, function(err) {
                        if (err) throw err;
                      });
                });
            });
        }
        Spots.updatePicturesInDB(req.params.spotId, req.body.picturesList, res);
    },

    updatePicturesInDB: function(spotId, pictures, res) {
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
