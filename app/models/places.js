// MODEL PLACES
var mongoose = require('mongoose');


var placesSchema = new mongoose.Schema({
  isActive: Boolean,
  picture: String,
  name: {
    first: { type:String, required: [true, 'first name required']},
    last: { type:String, required: [true, 'last name required']},
  },
  houseListing: {
    title: { type:String, required: [true, 'title required']},
    description: { type:String, required: [true, 'description required']},
    state: { type:String, required: [true, 'state required']},
    postalCode: {
      type: String,
      validate: {
          validator: function(v) {
            return /^[0-9]{5}$/.test(v);
          },
          message: '{VALUE} is not a valid postal code number!'
      },
      required: [true, 'postal code number required']
    },
    country: { type:String, required: [true, 'country required']},
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
    weeklyDiscount: {type: Number,min: 0, max: 100 },
    cleaningFee: Number,
    monthlyDiscount: {type: Number,min: 0, max: 100 },
    securityDeposit: Number,
    cancellation: String
  },
  houseSpaceDescription : String,
  houseAvailability: String,
  address: { type:String, required: [true, 'title required']},
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
  favoriteSports: [{
      type: String,
      enum: ['Surfing', 'KiteBoarding', 'Skiing', 'Kayak', 'Biking', 'Horse riding', 'Fishing', 'Flying', 'Hiking']
    }],
  secondaireSports: [{
      type: String,
      enum: ['Basketball', 'Bodybuilding', 'jiu-jitsu', 'Camping', 'Hunting', 'Jogging', 'Mountain biking', 'Paintball','Swimming','Walking']
    }]
});

var Places = {

    model: mongoose.model('Places', placesSchema),

    create: function(req, res) {
		Places.model.create(req.body.content, function(err){
			if (err) {
        res.send(err);
      }else {
        res.sendStatus(200);
      }
		});
	},

  findOne: function(req, res) {
		Places.model.findById(req.params.id, function (err, data) {
      if (err) {
        res.send(err);
      }else {
        res.send(data);
      }
		});
	},

	findAll: function(req, res) {
		Places.model.find(function (err, data) {
      if (err) {
        res.send(err);
      }else {
        res.send(data);
      }
		});
	},

	update: function(req, res){
		Places.model.findByIdAndUpdate(req.params.id, req.body.content, function(err){
      if (err) {
        res.send(err);
      }else {
        res.sendStatus(200);
      }
		});
	},

	delete: function(req, res){
		Places.model.findByIdAndRemove(req.params.id, function(err){
      if (err) {
        res.send(err);
      }else {
        res.sendStatus(200);
      }
		});
	}
};

module.exports = Places;
