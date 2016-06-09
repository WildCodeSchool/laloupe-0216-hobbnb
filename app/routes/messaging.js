var express = require('express'),
    messagingsRouter = express.Router(),
    Messagings = require('../models/messagings.js'),
    Auth = require('../middlewares/authorization.js');

module.exports = function(app) {

    messagingsRouter.get('/', Auth.user.hasAuthorization, Auth.user.isAdministrator, Messagings.findAll);
    messagingsRouter.get('/exp/:id', Auth.user.hasAuthorization, Auth.user.isOwner, Messagings.findExpOfUser);
    messagingsRouter.get('/rec/:id', Auth.user.hasAuthorization, Auth.user.isOwner, Messagings.findRecOfUser);
    messagingsRouter.get('/:id', Auth.user.hasAuthorization, Messagings.findOne);
    messagingsRouter.post('/', Auth.user.hasAuthorization, Messagings.create);
    messagingsRouter.delete('/:id', Auth.user.hasAuthorization, Auth.user.isAdministrator, Messagings.delete);

    app.use('/msg', messagingsRouter);

};
