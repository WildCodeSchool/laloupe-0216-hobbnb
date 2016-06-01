var Place = require('../models/places.js');
var Auth = require('../middlewares/authorization.js');

module.exports = function(app) {

    app.get('/places/:id', Place.findOne);
    app.get('/places', Place.findAll);
    app.post('/places', Auth.user.hasAuthorization, Place.create);
    app.put('/places/:id', Auth.user.hasAuthorization, Place.update);
    app.delete('/places/:id', Auth.user.isAdministrator, Place.delete);

};
