angular.module('app').controller('createPlaceController', function($scope, $q, $window, $http, $location, $routeParams, Upload, placesFactory, placesService, emailService) {

    if ($window.localStorage.currentUser) $scope.currentUser = JSON.parse($window.localStorage.getItem('currentUser'));
    else $scope.currentUser = {
        _id: null
    };

    $scope.showLoader = false;
    $scope.hobbiesListing = ["Randonnée", "VTT", "Cyclisme", "Equitation", "Pêche", "Plongée", "Golf", "Escalade", "Canoë Kayak", "Surf", "Stand up Paddle", "Kitesurf", "Windsurf", "Ski", "Alpinisme", "Parapente", "Spéléologie", "Cannoning"];
    $scope.propertyTypeListing = ["Maison", "Appartement", "Chambre", "Couchage", "Place de camping", "Cabane dans les arbres", "Camping car", "Tipy", "Bateau", "Yourte"];
    $scope.selectedHobbies = ['false', 'false', 'false'];
    $scope.currentSelectedHobby = 0;
    $scope.obj = {};
    $scope.obj.isActive = "1";
    $scope.obj.owner = $scope.currentUser._id;
    $scope.obj.hobbies = [];
    $scope.obj.address = {};
    $scope.photos = [];
    $scope.valid = false;
    $scope.infoPhotos = null;
    $scope.step = 1;

    $scope.addHobby = function(index, hobby) {
        if ($scope.currentSelectedHobby < 3) {
            $scope.obj.hobbies[$scope.currentSelectedHobby] = hobby;
            if (!$scope.obj.hobbies[$scope.currentSelectedHobby + 1]) $scope.currentSelectedHobby++;
            else if (!$scope.obj.hobbies[$scope.currentSelectedHobby + 2]) $scope.currentSelectedHobby += 2;
            else $scope.currentSelectedHobby = 3;
            $scope.hobbiesListing.splice(index, 1);
        }
    };
    $scope.removeHobby = function(index, hobby) {
        $scope.currentSelectedHobby = index;
        $scope.hobbiesListing.push($scope.obj.hobbies[index]);
        $scope.obj.hobbies[index] = false;
    };

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

    $scope.picturesLengthValidation = function () {
        $scope.totalSize = 0;
        console.log($scope.photos);
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
        console.log($scope.photos);
    };

    function upload(photos, addedPlaceID) {
        if (photos && photos.length) {
            Upload.upload({
                url: '/api/places/uploadImages/' + addedPlaceID,
                data: {
                    files: photos,
                    totalFiles: photos.length
                }
            }).progress(function(event) {
                $scope.progressPercentage = parseInt(100.0 * event.loaded / event.total);
            }).success(function(data, status, headers, config) {
                $scope.showLoader = false;
                $location.path('/place/' + addedPlaceID);
            });
        }
    }

    $scope.send = function() {
        $scope.showLoader = true;
        placesService.create($scope.obj)
            .then(function(res) {
                // $scope.isAction == 'création' && emailService.sendToAdmin(
                //     'Un hébergement à été créé sur hobbnb',
                //     'Un hébergement a été créé sur hobbnb !' + "\n<br />" + '<a href="http://hobbnb.com/place/' + res.data._id + '">Le consulter</a>'
                // );
                if (res.status == 200) upload($scope.photos, res.data._id);
            }, function(err) {
                console.log(err);
            });

    };

});
