angular.module('app').controller('createSpotController', function($scope, $window, $location, $routeParams, NgMap, NavigatorGeolocation, GeoCoder, Upload, spotsFactory, spotsService, emailService) {

    if ($window.localStorage.currentUser) $scope.currentUser = JSON.parse($window.localStorage.getItem('currentUser'));
    else $scope.currentUser = {
        _id: null
    };

    $scope.showLoader = false;
    $scope.hobbiesListing = ["Randonnée", "VTT", "Cyclisme", "Equitation", "Pêche", "Plongée", "Golf", "Escalade", "Canoë Kayak", "Surf", "Stand up Paddle", "Kitesurf", "Windsurf", "Ski", "Alpinisme", "Parapente", "Spéléologie", "Cannoning"];
    $scope.obj = {};
    $scope.obj.owner = $scope.currentUser._id;
    $scope.obj.address = {};
    $scope.spotMarkerPos = 'current-location';
    $scope.photos = [];
    $scope.valid = false;
    $scope.infoPhotos = null;
    $scope.step = 1;

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
    $scope.getCurrentMarkerLocation = function(event) {
        $scope.obj.latitude = event.latLng.lat();
        $scope.obj.longitude = event.latLng.lng();
        $scope.spotMarkerPos = event.latLng;
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
            $scope.obj.latitude = $scope.details.geometry.location.lat();
            $scope.obj.longitude = $scope.details.geometry.location.lng();
        }
    });

    $scope.picturesLengthValidation = function() {
        $scope.totalSize = 0;
        if ($scope.photos.length < 6) {
            $scope.infoPhotos = "Un minimum de 6 photos est nécésaire à la création d'un hébérgement.";
            $scope.valid = false;
        } else if ($scope.photos.length > 12) {
            $scope.infoPhotos = "Vous avez dépassé la limite de 12 photos par hébérgement. Supprimez des photos.";
            $scope.valid = false;
        } else {
            for (var i = 0; i < $scope.photos.length; i++) {
                $scope.totalSize += Number($scope.photos[i].size);
            }
            if ($scope.photos.length == 12) {
                $scope.infoPhotos = "Vous avez attend la limite de 12 photos par hébérgement.";
                $scope.valid = true;
            } else {
                if ($scope.totalSize < 50000000) {
                    $scope.infoPhotos = $scope.photos.length;
                    $scope.valid = true;
                } else {
                    $scope.infoPhotos = 'Vous avez dépassé la limite de 50mB autorisée. Supprimez des photos.';
                    $scope.valid = false;
                }
            }
        }
    };
    $scope.removePicture = function(index) {
        $scope.photos.splice(index, 1);
        $scope.picturesLengthValidation();
    };

    function upload(photos, addedSpotID) {
        if (photos && photos.length) {
            Upload.upload({
                url: '/api/spots/uploadImages/' + addedSpotID,
                data: {
                    files: photos,
                    totalFiles: photos.length
                }
            }).progress(function(event) {
                $scope.progressPercentage = parseInt(100.0 * event.loaded / event.total);
            }).success(function(data, status, headers, config) {
                $scope.showLoader = false;
                $location.path('/spot/' + addedSpotID);
            });
        }
    }
    $scope.send = function() {
        $scope.showLoader = true;
        spotsService.create($scope.obj)
            .then(function(res) {
                // $scope.isAction == 'création' && emailService.sendToAdmin(
                //     'Un spot à été créé sur hobbnb',
                //     'Un spot a été créé sur hobbnb !' + "\n<br />" + '<a href="http://hobbnb.com/spot/' + res.data._id + '">Le consulter</a>'
                // );
                if (res.status == 200) upload($scope.photos, res.data._id);
            }, function(err) {
                console.log(err);
            });
    };
});
