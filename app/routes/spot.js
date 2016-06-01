var Spot = require('../models/spots.js');
module.exports 	= function(app) {

	app.get('/spots/:id', Spot.findOne);
	app.get('/spots', Spot.findAll);
	app.post('/spots', Spot.create);
	app.put('/spots/:id', Spot.update);
	app.delete('/spots/:id', Spot.delete);

};
