// MODEL PLACES
var mongoose = require('mongoose');
var formidable = require('formidable');
var im = require('imagemagick');
var path = require('path');
var fs = require('fs');

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

var hobbiesListing = ["Randonnée", "VTT", "Cyclisme", "Equitation", "Pêche", "Plongée", "Golf", "Escalade", "Canoë Kayak", "Surf", "Stand up Paddle", "Kitesurf", "Windsurf", "Ski", "Alpinisme", "Parapente", "Spéléologie", "Cannoning"],
    propertiesType = ["Maison", "Appartement", "Chambre", "Couchage", "Place de camping", "Cabane dans les arbres", "Camping car", "Tipy", "Bateau", "Yourte"],
    width = 600,
    height = 600;

var placesSchema = new mongoose.Schema({
    isActive: Boolean,
    owner: String,
    creation: Date,
    modification: Date,
    name: {
        type: String,
        required: [true, 'title required']
    },
    shortDescription: {
        type: String,
        required: [true, 'description required']
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
        cleanness: [{
            type: Number,
            max: 5,
            min: 0
        }],
        location: [{
            type: Number,
            max: 5,
            min: 0
        }],
        valueForMoney: [{
            type: Number,
            max: 5,
            min: 0
        }]
    },
    home: {
        price: Number,
        intro: {
            travellers: Number,
            rooms: Number
        },
        houseSpace: {
            accommodates: Number,
            bathrooms: Number,
            bedrooms: Number,
            beds: Number,
            propertyType: {
                type: String,
                enum: propertiesType
            },
            checkIn: String,
            checkOut: String,
            houseRules: String
        },
        houseAmenities: {
            kitchen: Boolean,
            wifi: Boolean,
            tv: Boolean,
            essentials: Boolean,
            bbq: Boolean,
            more: String
        },
        houseExtras: {
            extraBabyBed: Number,
            weeklyDiscount: {
                type: Number,
                min: 0,
                max: 100
            },
            cleaningFee: Number,
            monthlyDiscount: {
                type: Number,
                min: 0,
                max: 100
            },
            securityDeposit: Number,
            cancellation: String
        }
    },
    houseSpaceDescription: String,
    houseAvailability: String,
    comments: [{
        owner: String,
        title: String,
        creation: Date,
        comment: String,
        thanks: Number
    }],
    primarySports: {
        type: String,
        enum: hobbiesListing
    },
    secondarySports: [{
        type: String,
        enum: hobbiesListing
    }]
});

var Places = {

    model: mongoose.model('Places', placesSchema),

    create: function(req, res) {
        Places.model.create(req.body.content, function(err, data) {
            if (err) {
                res.send(err);
            } else {
                res.send(data);
            }
        });
    },

    uploadImages: function(req, res) {

        var processedFileCount = 0,
            totalFiles = 0;
        var targetPath = './public/uploads/places/' + req.params.placeId + '/';

        if (!fs.existsSync('./public/uploads/places/')) fs.mkdirSync('./public/uploads/places/');
        if (!fs.existsSync(targetPath)) fs.mkdirSync(targetPath);
        if (!fs.existsSync(targetPath + 'thumb')) fs.mkdirSync(targetPath + 'thumb');
        if (!fs.existsSync(targetPath + 'large')) fs.mkdirSync(targetPath + 'large');

        var form = new formidable.IncomingForm();
        form.multiples = true;
        form.on('fileBegin', function(name, file) {
            processedFileCount++;
            console.log(processedFileCount);
        });
        form.on('file', function(field, file) {
            if (processedFileCount <= 6) {
                console.log('processing file nb: ' + processedFileCount);
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
                            console.log("Upload complete for place ID: " + req.params.placeId + ' an for image:' + file.name);
                        });
                    });
                });
            } else {
                console.log('too many');
                deleteFolderRecursive(targetPath);
                res.sendStatus(400);
                req.connection.destroy();
            }
        });
        form.on('error', function(err) {
            console.log('An error has occured: \n' + err);
        });
        form.on('end', function() {
            res.sendStatus(200);
        });
        form.parse(req, function(err, fields, files) {
            totalFiles = Object.keys(files).length;
        });
    },


    // uploadImages: function(req, res) {
    //     if (!fs.existsSync('./public/uploads/places/')) {
    //         fs.mkdirSync('./public/uploads/places/');
    //     }
    //     var form = new formidable.IncomingForm();
    //     form.parse(req, function(err, fields, files) {
    //         var file = files.file;
    //         var tempPath = file.path;
    //         var targetPath = path.resolve('./public/uploads/places/' + fields.placeId + '/' + file.name);
    //         if (!fs.existsSync('./public/uploads/places/' + fields.placeId + '/')) {
    //             fs.mkdirSync('./public/uploads/places/' + fields.placeId + '/');
    //         }
    //         fs.rename(tempPath, targetPath, function(err) {
    //             if (err) {
    //                 throw err;
    //             }
    //             console.log("Upload complete for place ID: " + fields.placeId + ' an for image:' + file.name);
    //             return res.json({
    //                 name: file.name,
    //                 path: '/uploads/places/' + fields.placeId + '/' + file.name
    //             });
    //         });
    //     });
    // },

    findOne: function(req, res) {
        Places.model.findById(req.params.id, function(err, data) {
            if (err) {
                res.send(err);
            } else {
                res.send(data);
            }
        });
    },

    findOneAndReturn: function(req, res) {
        return Places.model.findById(req.params._id);
    },

    findAll: function(req, res) {
        Places.model.find(function(err, data) {
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
        })
    },

    update: function(req, res) {
        Places.model.findByIdAndUpdate(req.params.id, req.body.content, function(err, data) {
            if (err) {
                res.send(err);
            } else {
                res.send(data);
            }
        });
    },

    updateAndDontUpdate: function(req, res) {
        Places.model.findByIdAndUpdate(req.params.id, req.body.content, function(err) {
            if (err) {
                return err;
            } else {
                return 200;
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
