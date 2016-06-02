// MODEL API
var mongoose = require('mongoose');


var messagingsSchema = new mongoose.Schema({
    creation: Date,
    sender: {
        type: String,
        required: true
    },
    recipient: {
        type: String,
        required: true
    },
    message: {
        type: String,
        required: true
    }
});

var Messagings = {

    model: mongoose.model('Messagings', messagingsSchema),

    create: function(req, res) {
        Messagings.model.create(req.body.obj, function(err, data) {
            if (err) res.status(400).send(err);
            else {
                res.send(data);
            }
        });
    },

    findAll: function(req, res) {
        Messagings.model.find(function(err, data) {
            if (!err) res.send(data);
            else res.status(400).send(err);
        });
    },

    findOne: function(req, res) {
        Messagings.model.findOne({
            _id: req.params.id
        }, function(err, data) {
            if (!err) res.send(data);
            else res.status(400).send(err);
        });
    },

    findExpOfUser: function(req, res) {
        Messagings.model.find({sender:req.params.id},function(err, data) {
            if(err) {
                res.send(err);
            } else {
                res.send(data);
            }
        })
    },

    findRecOfUser: function(req, res) {
        Messagings.model.find({recipient:req.params.id},function(err, data) {
            if(err) {
                res.send(err);
            } else {
                res.send(data);
            }
        })
    },

    delete: function(req, res) {
        Messagings.model.findByIdAndRemove(req.params.id, function() {
            res.sendStatus(200);
        });
    }
};

module.exports = Messagings;
