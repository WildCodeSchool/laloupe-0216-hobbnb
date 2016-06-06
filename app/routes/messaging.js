var Users = require('../models/messagings.js'),
    Auth = require('../middlewares/authorization.js');

module.exports = function(app) {

    app.get('/msg', Auth.user.isAdministrator, Users.findAll);
    app.get('/msg/exp/:id', Auth.user.isOwner, Users.findExpOfUser);
    app.get('/msg/rec/:id', Auth.user.isOwner, Users.findRecOfUser);
    app.get('/msg/:id', Auth.user.hasAuthorization, Users.findOne);
    app.post('/msg', Auth.user.hasAuthorization, Users.create);
    app.delete('/msg/:id', Auth.user.isAdministrator, Users.delete);

};
