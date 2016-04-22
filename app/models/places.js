// MODEL PLACES
var mongoose = require('mongoose');


var placesSchema = new mongoose.Schema({
  index: Number,
  isActive: Boolean,
  picture: String,
  name: {
    first: String,
    last: String
  },
  houseListing: {
    title: String,
    description: String,
    state: String,
    postaCode: {type: Number, min: 5, max: 5},
    country: String,
    price: Number,
    cleanness: {type: Number, max: 5},
    location: {type: Number, max: 5},
    valueForMoney: {type: Number, max: 5}
  },
  houseSpace: {
    accommodates: Number,
    bathrooms: Number,
    bedrooms: Number,
    beds: Number,
    propertyType: String,
    checkIn: String,
    checkOut: String,
    houseRules: String
  },
  houseAmenities: {
    kitchen: Boolean,
    wifi: Boolean,
    tv: Boolean,
    essentials: Boolean,
    bbq: Boolean,
    more: String
  },
  housePrices: {
    extraBabyBed: Number,
    weeklyDiscount: {type: Number,min: 1, max: 100 },
    cleaningFee: Number,
    monthlyDiscount: {type: Number,min: 1, max: 100 },
    securityDeposit: Number,
    cancellation: String
  },
  houseSpaceDescription : String,
  houseAvailability: String,
  address: String,
  registered: Date,
  latitude: Number,
  longitude: Number,
  commentsFriends: {
    id: Number,
    name: String,
    picture: String,
    comments: String,
    likes: Number
  },
  favoriteSports: {
    sports: {
      type: String,
      enum: ['Surfing', 'KiteBoarding', 'Skiing', 'Kayak', 'Biking', 'Horse riding', 'Fishing', 'Flying', 'Hiking']
    }
  },
  secondaireSports: {
    sports: {
      type: String,
      enum: ['Basketball', 'Bodybuilding', 'jiu-jitsu', 'Camping', 'Hunting', 'Jogging', 'Mountain biking', 'Paintball','Swimming','Walking']
    }
  }
});

var Places = {

    model: mongoose.model('Places', placesSchema),

    create: function(req, res) {
		Places.model.create({
            description: req.body.description
		}, function(){
			res.sendStatus(200);
		});
	},

	findAll: function(req, res) {
		Places.model.find(function (err, data) {
			res.send(data);
		});
	},

	update: function(req, res){
		Places.model.findByIdAndUpdate(req.params.id, {
			description: req.body.description
		}, function(){
			res.sendStatus(200);
		});
	},

	delete: function(req, res){
		Places.model.findByIdAndRemove(req.params.id, function(){
			res.sendStatus(200);
		});
	}
};

module.exports = Places;
