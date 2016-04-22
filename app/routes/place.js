var Place = require('../models/places.js');
module.exports 	= function(app) {

	app.get('/places', Place.findAll);
	app.post('/places', Place.create);
	app.put('/places/:id', Place.update);
	app.delete('/places/:id', Place.delete);

};
