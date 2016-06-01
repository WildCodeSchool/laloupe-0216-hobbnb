// MODEL PLACES
var mongoose = require('mongoose');

var hobbiesListing = ["Randonnée", "VTT", "Cyclisme", "Equitation", "Pêche", "Plongée", "Golf", "Escalade", "Canoë Kayak", "Surf", "Stand up Paddle", "Kitesurf", "Windsurf", "Ski", "Alpinisme", "Parapente", "Spéléologie", "Cannoning"],
    propertiesType = ["Maison", "Appartement", "Chambre", "Couchage", "Place de camping", "Cabane dans les arbres", "Camping car", "Tipy", "Bateau", "Yourte"];

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
        state: {
            type: String,
            required: [true, 'state required']
        },
        country: {
            type: String,
            required: [true, 'country required']
        },
        num: Number,
        road: String,
        city: String,
        postalCode: {
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

    findOne: function(req, res) {
        Places.model.findById(req.params.id, function(err, data) {
            if (err) {
                res.send(err);
            } else {
                res.send(data);
            }
        });
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

    update: function(req, res) {
        Places.model.findByIdAndUpdate(req.params.id, req.body.content, function(err) {
            if (err) {
                res.send(err);
            } else {
                res.sendStatus(200);
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
