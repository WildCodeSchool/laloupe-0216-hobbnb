angular.module('app').controller('createPlacesController', function($scope, $q, $window, $http, $location, $routeParams, Upload, placesFactory, placesService, emailService) {

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
    $scope.error = null;

    $scope.$watch('photo', function() {
        if ($scope.photo !== null) {
            if ($scope.photos.length < 12) {
                var concatenedPhotos = $scope.photos.concat($scope.photo);
                console.log(concatenedPhotos);
                if (concatenedPhotos.length < 12) {
                    $scope.photos = concatenedPhotos;
                } else if (concatenedPhotos.length == 12) {
                    $scope.photos = concatenedPhotos;
                    $scope.error = "Vous avez attend la limite de 12 photos par hébergement";
                } else {
                    $scope.error = "Vous dépasserez la limite de 12 photos par hébergement";
                }
            }
        }
    });

    $scope.removePicture = function(index) {
        $scope.photos.splice(index, 1);
        console.log($scope.photos);
    };

    function upload(photos, addedPlaceID) {
        if (photos && photos.length) {
            Upload.upload({
                url: '/api/places/uploadImages/' + addedPlaceID,
                data: {
                    totalFiles: photos.length,
                    file: photos
                }
            }).progress(function(event) {
                var progressPercentage = parseInt(100.0 * event.loaded / event.total);
                console.log('progress: ' + progressPercentage + '% ' + event.config.data.file.name);
            }).success(function(data, status, headers, config) {
                console.log(JSON.stringify(data));
                $location.path('/place/' + addedPlaceID);
            });
        }
    }

    $scope.send = function() {
        placesService.create($scope.obj)
            .then(function(res) {
                // $scope.isAction == 'création' && emailService.sendToAdmin(
                //     'Un hébergement à été créé sur hobbnb',
                //     'Un hébergement a été créé sur hobbnb !' + "\n<br />" + '<a href="http://hobbnb.com/place/' + res.data._id + '">Le consulter</a>'
                // );
                console.log(res);
                if (res.status == 200) upload($scope.photos, res.data._id);
            },function(err) {
                console.log(err);
            });

    };

});
