// MODEL API
var mongoose = require('mongoose'),
    bcrypt = require('bcrypt'),
    jwt = require('jsonwebtoken'),
    secretToken = require('../../config/secretToken.js');
var passport = require('passport');

require('../../config/passport');

function hashCode(s) {
    return s.split("").reduce(function(a, b) {
        a = ((a << 5) - a) + b.charCodeAt(0);
        return a & a;
    }, 0);
}


var usersSchema = new mongoose.Schema({
    creation: Date,
    modification: Date,
    isValidate: {
        type: Boolean,
        default: false
    },
    email: {
        type: String,
        // required: true,
        index: {
            unique: true
        }
    },
    password: {
        type: String,
        // required: true
    },
    facebook: {
        id: String,
        token: String,
        email: String
            // name: String
    },
    avatar: String,
    identity: {
        firstName: String,
        lastName: String,
        phone: String
    },
    address: {
        administrative_area_level_1: String,
        country: String,
        num: Number,
        route: String,
        locality: String,
        postal_code: {
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

usersSchema.methods.generateHash = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(10), null);
};

var Users = {

    model: mongoose.model('Users', usersSchema),

    create: function(req, res, next) {
        passport.authenticate('local-signup', function(err, newUser, info) {
            if (err) {
                console.log(err);
                return next(err);
            }
            if (!newUser) {
                return res.status(400).json(info.message);
            }
            newUser.password = null;
            var token = jwt.sign(newUser, secretToken, {
                expiresIn: '24h'
            });
            res.status(200).json({
                success: true,
                user: newUser,
                token: token
            });
        })(req, res, next);
    },

    generateHash: function(password) {
        return bcrypt.hashSync(password, bcrypt.genSaltSync(10), null);
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

    login: function(req, res, next) {
        passport.authenticate(['local-login', 'facebook'], function(err, user, info) {
            if (err) {
                return next(err);
            }
            if (!user) {
                return res.status(401).json(info.message);
            }
            user.password = null;
            var token = jwt.sign(user, secretToken, {
                expiresIn: '24h'
            });
            res.status(200).json({
                success: true,
                user: user,
                token: token
            });
            // res.cookie('token', token);
            // res.cookie('user', JSON.stringify(user));
            // console.log(user._id);
            // res.redirect('/user/'+user._id);
        })(req, res, next);
    },

    activate: function(req, res) {
        if (!req.params.id) {
            res.status(400).send('ID Introuvable');
        } else {
            Users.model.findById(req.params.id, function(err, data) {
                if (err) {
                    console.log(err);
                    res.status(400).send(err);
                } else if (!data) {
                    res.status(400).send('Utilisateur inconnu');
                } else {
                    if (!data.isValidate) {
                        Users.model.findByIdAndUpdate(data._id, {
                            isValidate: true
                        }, function(err, data) {
                            if (err) {
                                console.log(err);
                                res.status(400).send('Utilisateur inconnu');
                            } else {
                                data.password = null;
                                data.isValidate = true;
                                var token = jwt.sign(data, secretToken, {
                                    expiresIn: '24h'
                                });
                                console.log('ok');
                                res.send('<script>localStorage.setItem("currentUser", \'' + JSON.stringify(data) + '\');localStorage.setItem("token", \'' + token + '\');window.location="/#/";</script>');
                            }
                        });
                    } else {
                        console.log('Votre email est déjà vérifié');
                        res.status(401).send('Votre email est déjà vérifié');
                    }

                }
            });
        }
    },

    update: function(req, res) {
        if (req.body.obj.password) {
            var salt = bcrypt.genSaltSync(10);
            req.body.obj.password = bcrypt.hashSync(req.body.obj.password, salt);
        } else {
            return res.status(401).msg('Mot de passe incorrect');
        }
        Users.model.findByIdAndUpdate(req.params.id, req.body.obj, function(err, data) {
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

    confirm: function(req, res) {
        Users.model.findOne({
            '_id': req.params.id
        }, function(err, data) {
            if (err) res.status(400).send(err);
            else {
                if (data.isValidate == false) {

                } else {
                    res.status(400).send('Votre email a déjà été vérifié');
                }
            }
        });
        Users.model.findByIdAndUpdate(req.params.id, {
            isValidate: true
        }, function(err, data) {
            if (err) res.status(400).send(err);
            else {
                res.redirect('/');
                res.end();
            }
        });
    },

    updateAndDontUpdate: function(req, res) {
        Users.model.findByIdAndUpdate(req.params.id, req.body.content, function(err) {
            if (err) {
                return err;
            } else {
                return 200;
            }
        });
    },

    delete: function(req, res) {
        Users.model.findByIdAndRemove(req.params.id, function() {
            res.sendStatus(200);
        });
    }
};

module.exports = Users;
