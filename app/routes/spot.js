var Spot = require('../models/spots.js');
var Auth = require('../middlewares/authorization.js');

module.exports = function(app) {

    app.get('/spots/user/:id', Auth.user.hasAuthorization, Spot.findSpotsOfUser);
    app.get('/spots/:id', Spot.findOne);
    app.get('/spots', Spot.findAll);
    app.post('/spots', Auth.user.hasAuthorization, Spot.create);
    app.put('/spots/:id', Auth.user.hasAuthorization, Spot.update);
    app.delete('/spots/:id', Auth.user.isAdministrator, Spot.delete);

};
