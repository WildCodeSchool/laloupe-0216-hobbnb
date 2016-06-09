var express = require('express'),
    placesRouter = express.Router(),
    Place = require('../models/places.js'),
    Auth = require('../middlewares/authorization.js');

module.exports = function(app) {

    placesRouter.get('/user/:id', Auth.user.hasAuthorization, Place.findPlacesOfUser);
    placesRouter.get('/:id', Place.findOne);
    placesRouter.get('/', Place.findAll);
    placesRouter.post('/', Auth.user.hasAuthorization, Place.create);
    placesRouter.put('/:id', Auth.user.hasAuthorization, Place.update);
    placesRouter.delete('/:id', Auth.user.hasAuthorization, Auth.user.isAdministrator, Place.delete);

    app.use('/places', placesRouter);
};
