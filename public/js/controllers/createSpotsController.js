angular.module('app').controller('createSpotsController', function($scope, $q, $window, $http, $location, $routeParams, NgMap, NavigatorGeolocation, GeoCoder, Upload, spotsFactory, spotsService, emailService) {

    if ($window.localStorage.currentUser) $scope.currentUser = JSON.parse($window.localStorage.getItem('currentUser'));
    else $scope.currentUser = {
        _id: null
    };

    $scope.hobbiesListing = ["Randonnée", "VTT", "Cyclisme", "Equitation", "Pêche", "Plongée", "Golf", "Escalade", "Canoë Kayak", "Surf", "Stand up Paddle", "Kitesurf", "Windsurf", "Ski", "Alpinisme", "Parapente", "Spéléologie", "Cannoning"];
    $scope.obj = {};

    var componentForm = {
        street_number: 'short_name',
        route: 'long_name',
        locality: 'long_name',
        administrative_area_level_1: 'short_name',
        country: 'long_name',
        postal_code: 'short_name'
    };

    NgMap.getMap('myMap').then(function(map) {
        $scope.map = map;
    });

    NavigatorGeolocation.getCurrentPosition().then(function(res) {
        console.log(res);
    }, function(err) {
        /* when google geoloc fail */
        console.log(err);
        console.log('Trying with ipinfo:');
        $http.get("http://ipinfo.io").then(function(ipinfo) {
            $scope.centerMap = ipinfo.data.loc;
        });
    });

    $scope.getCurrentMarkerLocation = function(event) {
        $scope.obj.latitude = event.latLng.lat();
        $scope.obj.longitude = event.latLng.lng();
        $scope.spotMarkerPos = event.latLng;
        $scope.map.setCenter($scope.spotMarkerPos);
        GeoCoder.geocode({
            'location': this.getPosition()
        }).then(function(res)  {
            $scope.obj.address = {};
            $scope.refAddress = res[0].formatted_address;
            for (var i = 0; i < res[0].address_components.length; i++) {
                var addressType = res[0].address_components[i].types[0];
                if (componentForm[addressType]) {
                    if (addressType == 'route' && res[0].address_components[i][componentForm[addressType]] == 'Unnamed Road') continue;
                    if (isNaN(res[0].address_components[i][componentForm[addressType]])) {
                        $scope.obj.address[addressType] = res[0].address_components[i][componentForm[addressType]];
                    } else {
                        $scope.obj.address[addressType] = +res[0].address_components[i][componentForm[addressType]];
                    }
                    console.log($scope.obj.address[addressType]);
                }
            }
        });
    };

    $scope.$watch(function() {
        return $scope.details;
    }, function() {
        if ($scope.details) {
            $scope.obj.address = {};
            $scope.refAddress = $scope.details.formatted_address;
            for (var i = 0; i < $scope.details.address_components.length; i++) {
                var addressType = $scope.details.address_components[i].types[0];
                if (componentForm[addressType]) {
                    if (isNaN($scope.details.address_components[i][componentForm[addressType]])) {
                        $scope.obj.address[addressType] = $scope.details.address_components[i][componentForm[addressType]];
                    } else {
                        $scope.obj.address[addressType] = +$scope.details.address_components[i][componentForm[addressType]];
                    }
                    console.log($scope.obj.address[addressType]);
                }
            }
            $scope.spotMarkerPos = $scope.details.geometry.location;
            $scope.map.setCenter($scope.spotMarkerPos);
            $scope.obj.latitude = $scope.details.geometry.location.lat();
            $scope.obj.longitude = $scope.details.geometry.location.lng();
        }
    });

    resetObj = function() {
        $scope.obj.isActive = "1";
        $scope.obj.owner = $scope.currentUser._id;
        $scope.obj.spot = {};
        $scope.obj.rating = {
            popularity: 3,
            quality: 3,
            beauty: 3,
            accessibility: 3,
            overallRating: 3
        };
        $scope.obj.secondarySports = [];
        $scope.obj.creation = new Date();
        $scope.obj.modification = new Date();
        $scope.obj.address = {};
        $scope.obj.address.country = 'France';
        $scope.obj.comments = [{
            creation: new Date()
        }];
    };
    resetObj();

    $scope.step = 1;
    if ($routeParams.id) {
        $scope.isAction = 'modification';
        spotsService.getOne($routeParams.id).then(function(res) {
            if (res.data.owner != $scope.currentUser._id || !$scope.currentUser.isAdmin) $location.path('/');
            $scope.obj = res.data;
            $scope.obj.modification = new Date();
        });
    } else {
        $scope.isAction = 'création';
    }

    $scope.photos = [];
    $scope.photo = null;
    $scope.maxReached = false;

    $scope.$watch('photo', function() {
        if ($scope.photo !== null) {
            if ($scope.photos.length < 12) {
                var concatenedPhotos = $scope.photos.concat($scope.photo);
                console.log(concatenedPhotos);
                if (concatenedPhotos.length < 12) {
                    $scope.photos = concatenedPhotos;
                } else if (concatenedPhotos.length == 12) {
                    $scope.photos = concatenedPhotos;
                    $scope.error = "Vous avez attend la limite de 12 photos par spots";
                    $scope.maxReached = true;
                } else {
                    $scope.error = "Vous dépasserez la limite de 12 photos par spots";
                    console.log($scope.error);
                }
            }
        }
    });

    $scope.removePicture = function(index) {
        $scope.photos.splice(index, 1);
        console.log($scope.photos);
    };

    $scope.upload = function(photos) {
        if (photos && photos.length) {
            // for (var i = 0; i < photos.length; i++) {
            //     var photo = photos[i];
            //     if (!photo.$error) {
            Upload.upload({
                url: '/api/spots/uploadImages/' + $scope.addedSpotID,
                data: {
                    totalFiles: photos.length,
                    file: photos
                }
            }).progress(function(event) {
                var progressPercentage = parseInt(100.0 * event.loaded / event.total);
                console.log('progress: ' + progressPercentage + '% ' + event.config.data.file.name);
            }).success(function(data, status, headers, config) {
                console.log('file: ' +
                    data.name + 'path: ' + data.path +
                    ', Response: ' + JSON.stringify(data) +
                    '\n');
            });
        }
        //     }
        // }
    };


    $scope.send = function() {
        var act;
        if ($scope.isAction == 'création') {
            act = spotsService.create({
                content: $scope.obj
            });
        } else {
            act = spotsService.update($scope.obj._id, {
                content: $scope.obj
            });
        }
        act.then(function(res) {
            // $scope.isAction == 'création' && emailService.sendToAdmin(
            //     'Un spot à été créé sur hobbnb',
            //     'Un spot a été créé sur hobbnb !' + "\n<br />" + '<a href="http://hobbnb.com/spot/' + res.data._id + '">Le consulter</a>'
            // );
            $scope.addedSpotID = res.data._id;
            // $scope.obj = {};
            // resetObj();
        }, function(err) {
            $scope.error = err;
        });
    };
});
