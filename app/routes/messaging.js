var Messagings = require('../models/messagings.js'),
    Auth = require('../middlewares/authorization.js');

module.exports = function(app) {
    app.get('/msg', Auth.user.hasAuthorization, Auth.user.isAdministrator, Messagings.findAll);
    app.get('/msg/exp/:id', Auth.user.hasAuthorization, Auth.user.isOwner, Messagings.findExpOfUser);
    app.get('/msg/rec/:id', Auth.user.hasAuthorization, Auth.user.isOwner, Messagings.findRecOfUser);
    app.get('/msg/:id', Auth.user.hasAuthorization, Messagings.findOne);
    app.post('/msg', Auth.user.hasAuthorization, Messagings.create);
    app.delete('/msg/:id', Auth.user.hasAuthorization, Auth.user.isAdministrator, Messagings.delete);
};
