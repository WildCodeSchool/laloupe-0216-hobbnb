angular.module('app').controller('createPlacesController', function($scope, $http, $q, $window, $rootScope, $location, $routeParams, Upload, placesFactory, placesService, emailService) {

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
            if (res.data.owner != $scope.currentUser._id || !$scope.currentUser.isAdmin) $location.path('/');
            $scope.obj = res.data;
            $scope.obj.modification = new Date();
        })
    } else {
        $scope.isAction = 'création';
    }

    var componentForm = {
        street_number: 'short_name',
        route: 'long_name',
        locality: 'long_name',
        administrative_area_level_1: 'short_name',
        country: 'long_name',
        postal_code: 'short_name'
    };

    $scope.$watch(function() {
        return $scope.details;
    }, function() {
        if ($scope.details) {
            console.log('changed!');
            console.log($scope.details);
            for (var i = 0; i < $scope.details.address_components.length; i++) {
                var addressType = $scope.details.address_components[i].types[0];
                if (componentForm[addressType]) {
                    if (isNaN($scope.details.address_components[i][componentForm[addressType]])) {
                        $scope.obj.address[addressType] = $scope.details.address_components[i][componentForm[addressType]];
                    } else {
                        $scope.obj.address[addressType] = +$scope.details.address_components[i][componentForm[addressType]];
                    }
                    console.log(addressType);
                    console.log($scope.obj.address[addressType]);
                }
            }
            $scope.obj.latitude = $scope.details.geometry.location.lat();
            $scope.obj.longitude = $scope.details.geometry.location.lng();
        }
    });

    $scope.photos = [];
    $scope.photo = null;
    $scope.maxReached = false;

    $scope.$watch('photo', function() {
        if ($scope.photo !== null) {
            if ($scope.photos.length < 6) {
                var concatenedPhotos = $scope.photos.concat($scope.photo);
                console.log(concatenedPhotos);
                if (concatenedPhotos.length < 6) {
                    $scope.photos = concatenedPhotos;
                } else if (concatenedPhotos.length == 6) {
                    $scope.photos = concatenedPhotos;
                    $scope.error = "Vous avez attend la limite de 6 photos par hébergement";
                    $scope.maxReached = true;
                } else {
                    $scope.error = "Vous dépasserez la limite de 6 photos par hébergement";
                    console.log($scope.error);
                }
            }
        }
    });

    // function gmapGeocode() {
    //     var defer = $q.defer(),
    //         addr = $scope.obj.address.street_number + ' ' + $scope.obj.address.route + ' ' + $scope.obj.address.postal_code + ' ' + $scope.obj.address.locality + ' ' + $scope.obj.address.country;
    //     if (!this.geocoder) this.geocoder = new google.maps.Geocoder();
    //     this.geocoder.geocode({
    //         'address': addr
    //     }, function(results, status) {
    //         if (status == google.maps.GeocoderStatus.OK) {
    //             var loc = results[0].geometry.location;
    //             $scope.obj.latitude = loc.lat();
    //             $scope.obj.longitude = loc.lng();
    //             defer.resolve();
    //         } else {
    //             defer.reject('Adresse introuvable');
    //         }
    //     });
    //     return defer.promise;
    // }

    $scope.upload = function(photos) {
        if (photos && photos.length) {
            for (var i = 0; i < photos.length; i++) {
                var photo = photos[i];
                if (!photo.$error) {
                    Upload.upload({
                        url: '/api/places/uploadImages',
                        data: {
                            placeId: $scope.addedPlaceID,
                            file: photo
                        }
                    }).progress(function(event) {
                        var progressPercentage = parseInt(100.0 * event.loaded / event.total);
                        console.log('progress: ' + progressPercentage + '% ' + event.config.file.name);
                    }).success(function(data, status, headers, config) {
                        console.log('file: ' +
                            data.file.name +
                            ', Response: ' + JSON.stringify(data) +
                            '\n');
                    });
                }
            }
        }
    };

    $scope.send = function() {
        var act;
        if ($scope.isAction == 'création') {
            act = placesService.create({
                content: $scope.obj
            });
        } else {
            act = placesService.update($scope.obj._id, {
                content: $scope.obj
            });
        }
        act.then(function(res) {
            $scope.isAction == 'création' && emailService.sendToAdmin(
                'Un hébergement à été créé sur hobbnb',
                'Un hébergement a été créé sur hobbnb !' + "\n<br />" + '<a href="http://hobbnb.com/place/' + res.data._id + '">Le consulter</a>'
            );
            // $scope.obj = {};
            // resetObj();
            // $location.path('/picture/places/0/' + res.data._id);
            $scope.addedPlaceID = res.data._id;
        }, function(err) {
            $scope.error = err;
        });
    };

});
