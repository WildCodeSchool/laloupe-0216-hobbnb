var Place = require('../models/places.js'),
    Users = require('../models/users.js');
    Auth = require('../middlewares/authorization.js');

module.exports = function(app) {
    app.get('/places/user/:id', Auth.user.hasAuthorization, Place.findPlacesOfUser);
    app.get('/places/:id', Place.findOne);
    app.get('/places', Place.findAll);
    app.post('/places', Auth.user.hasAuthorization, Place.create);
    app.post('/places/uploadImages/:placeId', Auth.user.hasAuthorization, Place.uploadImages);
    app.put('/places/updatePictures/:placeId', Auth.user.hasAuthorization, Place.updatePictures);
    app.put('/places/:id', Auth.user.isOwner, Place.update);
    app.put('/places/addComment/:id', Auth.user.hasAuthorization, Place.addComment);
    app.delete('/places/:id', Auth.user.hasAuthorization, Auth.user.isAdministrator, Place.delete);
};
