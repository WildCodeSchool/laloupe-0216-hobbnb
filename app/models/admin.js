// MODEL PLACES
var mongoose = require('mongoose');

var testimonialSchema = new mongoose.Schema({
    photo1: String,
    title1: String,
    comment1: String,
    photo2: String,
    title2: String,
    comment2: String,
    photo3: String,
    title3: String,
    comment3: String
});

var Admin = {

    model: mongoose.model('Admin', testimonialSchema),

    create: function(req, res) {
        Admin.model.create(req.body.content, function(err, data) {
            if (err) {
                res.send(err);
            } else {
                res.send(data);
            }
        });
    },
    findAll: function(req, res) {
        Admin.model.find(function(err, data) {
            if (err) {
                res.send(err);
            } else {
                res.send(data);
            }
        });
    },

    update: function(req, res) {
        Admin.model.findByIdAndUpdate(req.params.id, req.body.content, function(err, data) {
            if (err) {
                res.send(err);
            } else {
                res.send(data);
            }
        });
    },

};

module.exports = Admin;
