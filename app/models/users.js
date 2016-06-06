// MODEL API
var mongoose = require('mongoose'),
    bcrypt = require('bcrypt')
    jwt = require('jsonwebtoken'),
    secretToken = require('../../config/secretToken.js');


var usersSchema = new mongoose.Schema({
    creation: Date,
    modification: Date,
    email: {
        type: String,
        required: true,
        index: {
            unique: true
        }
    },
    picture: String,
    password: {
        type: String,
        required: true
    },
    identity: {
        firstName: String,
        lastName: String,
        phone: String
    },
    address: {
        state: String,
        country: String,
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
            }
        },
        complement: String
    },
    rating: [{
        type: Number,
        max: 5,
        min: 0
    }],
    isAdmin: {
        type: Boolean,
        default: false
    }
});

usersSchema.methods.comparePassword = function(pwd, cb) {
    bcrypt.compare(pwd, this.password, function(err, isMatch) {
        if (err) return cb(err);
        cb(null, isMatch);
    });
};

var Users = {

    model: mongoose.model('Users', usersSchema),

    create: function(req, res) {
        console.log(req.body);
        if (req.body.obj.password) {
            var salt = bcrypt.genSaltSync(10);
            req.body.obj.password = bcrypt.hashSync(req.body.obj.password, salt);
        }
        Users.model.create(req.body.obj, function(err, data) {
            if (err) res.status(400).send(err);
            else {
                data.password = null;
                var token = jwt.sign(data, secretToken, {
                    expiresIn: '24h'
                });
                res.json({
                    success: true,
                    user: data,
                    token: token
                });
            }
        });
    },

    findAll: function(req, res) {
        Users.model.find(function(err, data) {
            if (!err) res.send(data);
            else res.status(400).send(err);
        });
    },

    findOne: function(req, res) {
        Users.model.findOne({
            _id: req.params.id
        }, function(err, data) {
            if (!err) res.send(data);
            else res.status(400).send(err);
        });
    },

    login: function(req, res) {
        if (!req.body.email) {
            res.status(400).send('Veuillez renseigner un e-mail');
        } else if (!req.body.password) {
            res.status(400).send('Veuillez renseigner un mot de passe');
        } else {
            Users.model.findOne({
                email: req.body.email
            }, function(err, data) {
                if (err) {
                    res.status(400).send(err);
                } else if (!data) {
                    res.status(400).send('Utilisateur inconnu');
                } else {
                    data.comparePassword(req.body.password, function(err, isMatch) {
                        if (err) {
                            res.status(400).send(err);
                        } else {
                            if (isMatch) {
                                data.password = null;
                                var token = jwt.sign(data, secretToken, {
                                    expiresIn: '24h'
                                });
                                res.json({
                                    success: true,
                                    user: data,
                                    token: token
                                });
                            } else {
                                res.status(400).send('Mot de passe incorrect');
                            }
                        }
                    });
                }
            });
        }
    },

    update: function(req, res) {
        Users.model.findByIdAndUpdate(req.params.id, req.body.obj, function() {
            res.sendStatus(200);
        });
    },

    delete: function(req, res) {
        Users.model.findByIdAndRemove(req.params.id, function() {
            res.sendStatus(200);
        });
    }
};

module.exports = Users;
