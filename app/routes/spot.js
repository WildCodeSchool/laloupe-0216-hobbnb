var Spot = require('../models/spots.js'),
    Users = require('../models/users.js');
    Auth = require('../middlewares/authorization.js');

module.exports = function(app) {
    app.get('/spots/user/:id', Auth.user.hasAuthorization, Spot.findSpotsOfUser);
    app.get('/spots/:id', Spot.findOne);
    app.get('/spots', Spot.findAll);
    app.post('/spots', Auth.user.hasAuthorization, Spot.create);
    app.post('/spots/uploadImages/:spotId', Auth.user.hasAuthorization, Spot.uploadImages);
    app.put('/spots/:id', Auth.user.hasAuthorization, Spot.update);
    app.put('/spots/addComment/:id', Auth.user.hasAuthorization, Spot.addComment);
    app.delete('/spots/:id', Auth.user.hasAuthorization, Auth.user.isAdministrator, Spot.delete);
};
