var Users = require('../models/users.js'),
    Auth = require('../middlewares/authorization.js');
var passport = require('passport');
require('../../config/passport');

module.exports = function(app) {
    app.get('/users/activate/:id', Users.activate);
    app.get('/users', Auth.user.hasAuthorization, Auth.user.isAdministrator, Users.findAll);
    app.get('/users/loggedin', Auth.user.hasAuthorization, function(req, res) {
        res.sendStatus(200);
    });
    app.post('/users', Users.create);
    app.get('/users/:id/:token', Users.confirm);
    app.post('/users/login', Users.login);
    app.get('/facebook', passport.authenticate('facebook'));
    app.get('/facebook/callback', Users.login);
    app.get('/users/:id', Users.findOne);
    app.put('/users/:id', Auth.user.hasAuthorization, Users.update);
    app.delete('/users/:id', Auth.user.hasAuthorization, Auth.user.isAdministrator, Users.delete);
};
