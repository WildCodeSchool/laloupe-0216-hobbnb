var express = require('express'),
    spotsRouter = express.Router(),
    Spot = require('../models/spots.js'),
    Auth = require('../middlewares/authorization.js');

module.exports = function(app) {

    spotsRouter.get('/user/:id', Auth.user.hasAuthorization, Spot.findSpotsOfUser);
    spotsRouter.get('/:id', Spot.findOne);
    spotsRouter.get('/', Spot.findAll);
    spotsRouter.post('/', Auth.user.hasAuthorization, Spot.create);
    spotsRouter.put('/:id', Auth.user.hasAuthorization, Spot.update);
    spotsRouter.delete('/:id', Auth.user.hasAuthorization, Auth.user.isAdministrator, Spot.delete);

    app.use('/spots', spotsRouter);

};
