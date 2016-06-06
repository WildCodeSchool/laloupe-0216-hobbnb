// MODEL PLACES
var mongoose = require('mongoose');

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
    state: {
        type: String,
        required: [true, 'state required']
    },
    country: {
        type: String,
        required: [true, 'country required']
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

    create: function(req, res) {
        console.log(req.body);
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
        Spots.model.findById(req.params._id, function(err, data) {
            if (err) {
                return err;
            } else {
                return data;
            }
        });
    },

    findSpotsOfUser: function(req, res) {
        Spots.model.find({owner:req.params.id},function(err, data) {
            if(err) {
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
        Spots.model.findByIdAndUpdate(req.params.id, req.body.content, function(err) {
            if (err) {
                res.send(err);
            } else {
                res.sendStatus(200);
            }
        });
    },

    updateAndDontUpdate: function(req, res) {
        Spots.model.findByIdAndUpdate(req.params.id, req.body.content, function(err) {
            if (err) {
                return err;
            } else {
                return 200;
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
