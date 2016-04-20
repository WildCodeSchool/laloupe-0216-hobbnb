var Api = require('../models/api.js');
module.exports 	= function(app) {

	app.get('/api', Api.findAll);
	app.post('/api', Api.create);
	app.put('/api/:id', Api.update);
	app.delete('/api/:id', Api.delete);

};
