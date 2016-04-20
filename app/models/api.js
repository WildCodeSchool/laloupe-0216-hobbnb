// MODEL API
var mongoose = require('mongoose');


var apiSchema = new mongoose.Schema({
  description: String
});

var Api = {

    model: mongoose.model('Api', apiSchema),

    create: function(req, res) {
		Api.model.create({
            description: req.body.description
		}, function(){
			res.sendStatus(200);
		});
	},

	findAll: function(req, res) {
		Api.model.find(function (err, data) {
			res.send(data);
		});
	},

	update: function(req, res){
		Api.model.findByIdAndUpdate(req.params.id, {
			description: req.body.description
		}, function(){
			res.sendStatus(200);
		});
	},

	delete: function(req, res){
		Api.model.findByIdAndRemove(req.params.id, function(){
			res.sendStatus(200);
		});
	}
};

module.exports = Api;
