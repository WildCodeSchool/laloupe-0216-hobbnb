angular.module('app').controller('createPlacesController', function($scope, $http, $q, $window, $location, $routeParams, placesFactory, placesService) {

    if ($window.localStorage.currentUser) $scope.currentUser = JSON.parse($window.localStorage.getItem('currentUser'));
    else $scope.currentUser = {
        _id: null
    };

    $scope.hobbiesListing = ["Randonnée", "VTT", "Cyclisme", "Equitation", "Pêche", "Plongée", "Golf", "Escalade", "Canoë Kayak", "Surf", "Stand up Paddle", "Kitesurf", "Windsurf", "Ski", "Alpinisme", "Parapente", "Spéléologie", "Cannoning"];
    $scope.obj = {};
    resetObj = function() {
        //TODO: Add possibility to edit an place
        $scope.obj.isActive = "1";
        $scope.obj.owner = $scope.currentUser._id;
        $scope.obj.creation = new Date();
        $scope.obj.modification = new Date();
        $scope.obj.address = {};
        $scope.obj.address.country = 'France';
        $scope.obj.rating = {
            cleanness: [],
            location: [],
            valueForMoney: []
        };
        $scope.obj.home = {};
        $scope.obj.home.houseSpace = {};
        $scope.obj.home.houseAmenities = {};
        $scope.obj.home.intro = {};
        $scope.obj.home.houseExtras = {};
        $scope.obj.secondarySports = [];
        $scope.obj.comments = [];
    };
    resetObj();
    $scope.step = 1;
    if ($routeParams.id) {
        $scope.creaOrModif = 'modification';
        placesService.getOne($routeParams.id).then(function(res) {
            if(res.data.owner != $scope.currentUser._id) $location.path('/');
            $scope.obj = res.data;
            $scope.obj.modification = new Date();
        })
    } else {
        $scope.creaOrModif = 'création';
    }
    $scope.send = function() {
        $q(function(resolve, reject) {
            if (!this.geocoder) this.geocoder = new google.maps.Geocoder();
            this.geocoder.geocode({
                'address': $scope.obj.address.num + ' ' + $scope.obj.address.road + ' ' + $scope.obj.address.postalCode + ' ' + $scope.obj.address.city + ' ' + $scope.obj.address.country
            }, function(results, status) {
                if (status == google.maps.GeocoderStatus.OK) {
                    var loc = results[0].geometry.location;
                    $scope.obj.latitude = loc.lat;
                    $scope.obj.longitude = loc.lon;
                    resolve();
                }
            });
        }).then(function() {
            var act;
            if ($scope.creaOrModif == 'création') {
                act = placesService.create({
                    content: $scope.obj
                })
            } else {
                act = placesService.update($scope.obj._id, $scope.obj)
            }
            act.then(function(res) {
                $scope.obj = {};
                resetObj();
                $location.path('/picture/places/0/' + res.data._id);
            }, function(err) {
                $scope.error = err;
            });
        });
    };

});
