// MODEL PLACES
var mongoose = require('mongoose');
var formidable = require('formidable');
var gm = require('gm');
var fs = require('fs');
logger = require('../logs/logger');

var hobbiesListing = ["Randonnée", "VTT", "Cyclisme", "Equitation", "Pêche", "Plongée", "Golf", "Escalade", "Canoë Kayak", "Surf", "Stand up Paddle", "Kitesurf", "Windsurf", "Ski", "Alpinisme", "Parapente", "Spéléologie", "Cannoning"],
    propertiesType = ["Maison", "Appartement", "Chambre", "Couchage", "Place de camping", "Cabane dans les arbres", "Camping car", "Tipy", "Bateau", "Yourte"];

var placesCommentsSchema = new mongoose.Schema({
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
    cleanness: {
        type: Number,
        max: 5,
        min: 0
    },
    location: {
        type: Number,
        max: 5,
        min: 0
    },
    valueForMoney: {
        type: Number,
        max: 5,
        min: 0
    }
});

var placesSchema = new mongoose.Schema({
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
    shortDescription: {
        type: String,
        trim: true,
        required: [true, 'description required']
    },
    hobbies: [{
        type: String,
        enum: hobbiesListing
    }],
    pictures: [String],
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
    home: {
        price: Number,
        travellers: Number,
        propertyType: {
            type: String,
            enum: propertiesType
        }
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
        cleanness: {
            type: Number,
            max: 5,
            min: 0,
            default: 0
        },
        location: {
            type: Number,
            max: 5,
            min: 0,
            default: 0
        },
        valueForMoney: {
            type: Number,
            max: 5,
            min: 0,
            default: 0
        }
    },
    comments: [placesCommentsSchema]
});

var Places = {

    model: mongoose.model('Places', placesSchema),

    comment: mongoose.model('placeComment', placesCommentsSchema),

    create: function(req, res) {
        Places.model.create(req.body, function(err, data) {
            if (err) {
                logger.error('An error has occured in Place create: ', err);
                res.status(400).send(err);
            } else {
                logger.info('>> PLACE: ', data._id, ' / ', data.name, 'WAS CREATED BY: ', data.owner);
                res.status(200).send(data);
            }
        });
    },

    addComment: function(req, res) {
        Places.model.findById(req.params.id, function(err, place) {
            if (err) console.log(err);
            var ratedBefore = place.comments.filter(function(comment) {
                return comment.owner == req.body.owner;
            }).length;
            if (ratedBefore === 0) {
                console.log(Number('   >>>>>' + req.body.cleanness));
                place.rating.cleanness = (place.rating.cleanness * place.rating.numberOfRatings + Number(req.body.cleanness)) / (place.rating.numberOfRatings + 1);
                place.rating.location = (place.rating.location * place.rating.numberOfRatings + Number(req.body.location)) / (place.rating.numberOfRatings + 1);
                place.rating.valueForMoney = (place.rating.valueForMoney * place.rating.numberOfRatings + Number(req.body.valueForMoney)) / (place.rating.numberOfRatings + 1);
                place.rating.overallRating = (place.rating.cleanness + place.rating.location + place.rating.valueForMoney) / 3;
                place.rating.numberOfRatings += 1;
                req.body.date = Date.now();
                place.comments.push(req.body);
                place.save(function(err) {
                    console.log(err);
                });
                logger.info('>> Un commentaire a été ajouté au place', req.params.id, req.body);
                res.sendStatus(200);
            } else {
                logger.info('>>> Dèja commenter!');
                res.sendStatus(304);
            }
        });
    },

    uploadImages: function(req, res) {
        console.log(req.body);
        var fileCount = 0,
            processedFileCount = 0,
            pictures = [],
            totalFiles = 0,
            width = 1200,
            update = true;
        var targetPath = './public/uploads/places/' + req.params.placeId + '/';

        if (!fs.existsSync('./public/uploads/places/')) fs.mkdirSync('./public/uploads/places/');
        if (!fs.existsSync(targetPath)) fs.mkdirSync(targetPath);
        if (!fs.existsSync(targetPath + 'thumb')) fs.mkdirSync(targetPath + 'thumb');
        if (!fs.existsSync(targetPath + 'large')) fs.mkdirSync(targetPath + 'large');

        logger.info('>> Create Place ID: ', req.params.placeId, 'begin.');

        var form = new formidable.IncomingForm();
        form.multiples = true;
        form.on('progress', function(bytesReceived, bytesExpected) {
            logger.info('Progress so far: ', (100 * (bytesReceived / bytesExpected)), "%  or  ", bytesReceived, 'bytes');
        });
        form.on('field', function(field, value) {
            if (field == 'totalFiles') totalFiles = value;
            if (field == 'update') update = value;
        });
        form.on('fileBegin', function(name, file) {
            fileCount++;
            // file.name = fileCount + file.namplace.substr(file.namplace.lastIndexOf('.'));
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
                                logger.info('Upload and resize complete for PLACE ID: ', req.params.placeId, ' an for image:', file.name, ' ', processedFileCount, ' / ', totalFiles);
                                if (totalFiles == processedFileCount)(update === true) ? Places.updatePicturesInDB(req.params.placeId, pictures, res) : res.sendStatus(200);
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
        Places.model.findById(req.params.id)
            .populate('owner', 'identity rating email')
            .populate('comments.owner', 'identity rating email')
            .exec(function(err, data) {
                if (err) {
                    res.status(400).send(err);
                } else {
                    res.status(200).send(data);
                }
            });
    },

    findOneAndReturn: function(req, res) {
        return Places.model.findById(req.params._id);
    },

    findPlacesNearBy: function(req, res) {
        var r_earth = 6378137;
        console.log(req.body);
        var latitudeRangePlace = req.body.latitudeRange,
            longitudeRangePlace = req.body.longitudeRange,
            center = req.body.center,
            radius = req.body.radius;

        function getDistanceFromLatLonInMetters(lat1, lon1, lat2, lon2) {
            var dLat = (Math.PI / 180) * (lat2 - lat1);
            var dLon = (Math.PI / 180) * (lon2 - lon1);
            var a =
                Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                Math.cos((Math.PI / 180) * (lat1)) * Math.cos((Math.PI / 180) * (lat2)) *
                Math.sin(dLon / 2) * Math.sin(dLon / 2);
            var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
            var d = r_earth * c; // Distance in km
            return d;
        }
        Places.model.find()
            .populate('owner', 'identity rating email')
            .populate('comments.owner', 'identity rating email')
            .exec(function(err, data) {
                if (err) res.send(err);
                var placesNearBy = [];
                data.forEach(function(place) {
                    if ((place.latitude >= latitudeRangePlace.min && place.latitude <= latitudeRangePlace.max) || (place.latitude <= latitudeRangePlace.min && place.latitude >= latitudeRangePlace.max) && (place.longitude >= longitudeRangePlace.min && place.longitude <= longitudeRangePlace.max) || (place.longitude <= longitudeRangePlace.min && place.longitude >= longitudeRangePlace.max)) {
                        if (getDistanceFromLatLonInMetters(center.latitude, center.longitude, place.latitude, place.longitude) <= radius) {
                            placesNearBy.push(place);
                        }
                    }
                });
                res.send(placesNearBy);
            });
    },

    findAll: function(req, res) {
        Places.model.find()
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

    findPlacesOfUser: function(req, res) {
        Places.model.find({
            owner: req.params.id
        }, function(err, data) {
            if (err) {
                res.send(err);
            } else {
                res.send(data);
            }
        });
    },

    update: function(req, res) {
        Places.model.findByIdAndUpdate(req.params.id, req.body, function(err, data) {
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
                fs.unlink('./public/uploads/places/' + req.params.placeId + '/large/' + picture, function(err) {
                    if (err) throw err;
                    fs.unlink('./public/uploads/places/' + req.params.placeId + '/thumb/' + picture, function(err) {
                        if (err) throw err;
                    });
                });
            });
        }
        Places.updatePicturesInDB(req.params.placeId, req.body.picturesList, res);
    },

    updatePicturesInDB: function(placeId, pictures, res) {
        Places.model.findByIdAndUpdate(placeId, {
            $set: {
                pictures: pictures
            }
        }, function(err) {
            if (err) {
                logger.error('An error has occured in Place create/update DB upload: ', err);
                console.log(err);
                res.status(400).send(err);
            } else {
                logger.info('>>   ------ DB updates with pictures! ------');
                res.sendStatus(200);
            }
        });
    },

    delete: function(req, res) {
        Places.model.findByIdAndRemove(req.params.id, function(err) {
            if (err) {
                res.send(err);
            } else {
                res.sendStatus(200);
            }
        });
    }
};

module.exports = Places;
