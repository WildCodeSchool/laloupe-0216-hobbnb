angular.module('app').controller('createPlacesController', function($scope, $http, $q, $window, $rootScope, $location, $routeParams, placesFactory, placesService, emailService) {

    if ($window.localStorage.currentUser) $scope.currentUser = JSON.parse($window.localStorage.getItem('currentUser'));
    else $scope.currentUser = {
        _id: null
    };

    $scope.hobbiesListing = ["Randonnée", "VTT", "Cyclisme", "Equitation", "Pêche", "Plongée", "Golf", "Escalade", "Canoë Kayak", "Surf", "Stand up Paddle", "Kitesurf", "Windsurf", "Ski", "Alpinisme", "Parapente", "Spéléologie", "Cannoning"];
    $scope.obj = {};
    resetObj = function() {
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
        $scope.isAction = 'modification';
        placesService.getOne($routeParams.id).then(function(res) {
            if (res.data.owner != $scope.currentUser._id) $location.path('/');
            $scope.obj = res.data;
            $scope.obj.modification = new Date();
        })
    } else {
        $scope.isAction = 'création';
    }

    function gmapGeocode() {
        var defer = $q.defer(),
            addr = $scope.obj.address.num + ' ' + $scope.obj.address.road + ' ' + $scope.obj.address.postalCode + ' ' + $scope.obj.address.city + ' ' + $scope.obj.address.country;
        if (!this.geocoder) this.geocoder = new google.maps.Geocoder();
        this.geocoder.geocode({
            'address': addr
        }, function(results, status) {
            if (status == google.maps.GeocoderStatus.OK) {
                var loc = results[0].geometry.location;
                $scope.obj.latitude = loc.lat();
                $scope.obj.longitude = loc.lng();
                defer.resolve();
            } else {
                defer.reject('Adresse introuvable');
            }
        });
        return defer.promise;
    }
    $scope.send = function() {
        gmapGeocode().then(function() {
            var act;
            if ($scope.isAction == 'création') {
                act = placesService.create({
                    content: $scope.obj
                });
            } else {
                act = placesService.update($scope.obj._id, {
                    content: $scope.obj
                })
            }
            act.then(function(res) {
                    $scope.isAction == 'création' && emailService.sendToAdmin(
                        'Un hébergement à été créé sur hobbnb',
                        'Un hébergement a été créé sur hobbnb !' + "\n<br />" + '<a href="http://hobbnb.herokuapp.com/#/place/' + res.data._id + '">Le consulter</a>'
                    );
                $scope.obj = {};
                resetObj();
                $location.path('/picture/places/0/' + res.data._id);
            }, function(err) {
                $scope.error = err;
            });
        }, function(err) {
            $scope.error = err;
        });
    };

});
