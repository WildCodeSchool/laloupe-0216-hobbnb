// MODEL API
var mongoose = require('mongoose');


var usersSchema = new mongoose.Schema({
    creation: Date,
    modification: Date,
    email: String,
    password: String,
    identity: {
        firstName: String,
        lastName: String,
        phone: String
    },
    address: {
        state: {
            type: String,
            required: [true, 'state required']
        },
        country: {
            type: String,
            required: [true, 'country required']
        },
        num: Number,
        road: String,
        city: String,
        postalCode: {
            type: String,
            validate: {
                validator: function(v) {
                    return /^[0-9]{5}$/.test(Number(v));
                },
                message: '{VALUE} is not a valid postal code number!'
            },
            required: [true, 'postal code number required']
        },
        complement: String
    },
    rating: [{
        type: Number,
        max: 5,
        min: 0
    }]
});

var Users = {

    model: mongoose.model('Users', usersSchema),

    create: function(req, res) {
		Users.model.create(req.body.obj, function(){
			res.sendStatus(200);
		});
	},

	findAll: function(req, res) {
		Users.model.find(function (err, data) {
			if(!err) res.send(data);
            else res.send(err);
		});
	},

	findOne: function(req, res) {
		Users.model.findOne({_id: req.params.id}, function (err, data) {
			if(!err) res.send(data);
            else res.send(err);
		});
	},

	update: function(req, res){
		Users.model.findByIdAndUpdate(req.params.id, req.body.obj, function(){
			res.sendStatus(200);
		});
	},

	delete: function(req, res){
		Users.model.findByIdAndRemove(req.params.id, function(){
			res.sendStatus(200);
		});
	}
};

module.exports = Users;
