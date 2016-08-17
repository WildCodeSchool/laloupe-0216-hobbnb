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
    $scope.infoPhotos = null;

    $scope.$watch('photo', function() {
        if ($scope.photo !== null) {
            $scope.photos = $scope.photos.concat($scope.photo);
        }
    });

    $scope.$watch('photos.length', function() {
        console.log($scope.photos);
        if ($scope.photos.length == 12) {
            $scope.infoPhotos = "Vous avez attend la limite de 12 photos par hébérgement.";
        } else if ($scope.photos.length < 6) {
            $scope.infoPhotos = "Un minimum de 6 photos est nécésaire à la création d'un hébérgement.";
        } else if ($scope.photos.length > 12) {
            $scope.infoPhotos = "Vous avez dépassez la limite de 12 photos par hébérgement. Supprimez des photos.";
        } else {
            $scope.infoPhotos = $scope.photos.length;
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
                console.log('progress: ' + progressPercentage + '% ');
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
