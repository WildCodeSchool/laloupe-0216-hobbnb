// config/passport.js

// load all the things we need
var passport = require('passport'),
    LocalStrategy = require('passport-local').Strategy,
    FacebookStrategy = require('passport-facebook').Strategy,
    socialAuth = require('./socialAuth');

// load up the user model
var Users = require('../app/models/users');

// expose this function to our app using module.exports
module.exports = function(passport) {

    passport.use('local-login', new LocalStrategy({
            // by default, local strategy uses username and password, we will override with email
            usernameField: 'email',
            session: false
        },
        function(email, password, done) {
            process.nextTick(function() {
                Users.model.findOne({
                    email: email
                }, function(err, user) {
                    if (err) {
                        return done(err);
                    }
                    if (!user) {
                        return done(null, false, {
                            message: 'Utilisateur inconnu'
                        });
                    } else {
                        user.comparePassword(password, function(err, isMatch) {
                            if (err) {
                                return done(err);
                            }
                            if (!isMatch) {
                                return done(null, false, {
                                    message: 'Mot de passe incorrect'
                                });
                            }
                            return done(null, user);
                        });
                    }
                });
            });
        }));

    passport.use('local-signup', new LocalStrategy({
            // by default, local strategy uses username and password, we will override with email
            usernameField: 'email',
            passReqToCallback: true,
            session: false
        },
        function(req, email, password, done) {
            console.log(email);
            console.log(password);
            process.nextTick(function() {
                Users.model.findOne({
                    email: email
                }, function(err, user) {
                    // if there are any errors, return the error
                    if (err) {
                        console.log(err);
                        return done(err);
                    }
                    // check to see if theres already a user with that email
                    if (user) {
                        return done(null, false, {
                            message: 'Cet email est déjà utilisé.'
                        });
                    } else {
                        // set the user's local credentials
                        req.body.password = Users.generateHash(password);
                        Users.model.create(req.body, function(err, newUser) {
                            if (err) {
                                return done(err);
                            } else {
                                return done(null, newUser);
                            }
                        });
                    }
                });
            });
        }));

    passport.use('facebook', new FacebookStrategy({
            clientID: socialAuth.facebookAuth.clientID,
            clientSecret: socialAuth.facebookAuth.clientSecret,
            callbackURL: socialAuth.facebookAuth.callbackURL,
            profileFields: ['id', 'emails', 'name'],
            session: false
        },
        function(accessToken, refreshToken, profile, done) {
            process.nextTick(function() {
                Users.model.findOne({
                    'facebook.id': profile.id
                }, function(err, user) {
                    if (err) {
                        console.log(err);
                        return done(err);
                    }
                    if (user) {
                        console.log(user);
                        return done(null, user);
                    } else {
                        var newUser = new Users.model();
                        newUser.isValidate = true;
                        newUser.identity.firstName = profile.name.givenName;
                        newUser.identity.lastName = profile.name.familyName;
                        newUser.facebook.id = profile.id;
                        newUser.facebook.token = accessToken;
                        newUser.facebook.email = profile.emails[0].value;
                        newUser.save(function(err) {
                            if (err)
                                throw err;
                            return done(null, newUser);
                        });
                    }
                });
            });
        }
    ));
};
