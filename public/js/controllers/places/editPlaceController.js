angular.module('app').controller('editPlaceController', function($scope, $window, $http, $location, $routeParams, Upload, placesFactory, placesService, usersService, emailService, searchFactory) {

    if ($window.localStorage.currentUser) $scope.currentUser = JSON.parse($window.localStorage.getItem('currentUser'));
    else $scope.currentUser = {
        _id: null
    };

    $scope.propertyTypeListing = ["Maison", "Appartement", "Chambre", "Couchage", "Place de camping", "Cabane dans les arbres", "Camping car", "Tipy", "Bateau", "Yourte"];
    $scope.currentHost = $routeParams.id;
    var removedPictures = [];

    placesService.getOne($scope.currentHost).then(function(res) {
        if (res.data.owner._id == $scope.currentUser._id || $scope.currentUser.isAdmin) {
            $scope.host = res.data;
            $scope.host.modification = new Date();
            $scope.hobbiesListing = ["Randonnée", "VTT", "Cyclisme", "Equitation", "Pêche", "Plongée", "Golf", "Escalade", "Canoë Kayak", "Surf", "Stand up Paddle", "Kitesurf", "Windsurf", "Ski", "Alpinisme", "Parapente", "Spéléologie", "Cannoning"].filter(function(el) {
                return res.data.hobbies.indexOf(el) < 0;
            });
            $scope.formattedAddress = "";
            if (res.data.address.street_number) $scope.formattedAddress += res.data.address.street_number = ' ';
            if (res.data.address.route) $scope.formattedAddress += res.data.address.route + ', ';
            if (res.data.address.postal_code) $scope.formattedAddress += res.data.address.postal_code + ' ';
            if (res.data.address.locality) $scope.formattedAddress += res.data.address.locality + ', ';
            $scope.formattedAddress += res.data.address.country;
            $scope.photos = res.data.pictures;
            $scope.currentSelectedHobby = res.data.hobbies.length;
        }
    });

    $scope.addHobby = function(index, hobby) {
        console.log($scope.currentSelectedHobby);
        if ($scope.currentSelectedHobby < 3) {
            $scope.host.hobbies[$scope.currentSelectedHobby] = hobby;
            $scope.currentSelectedHobby = 3;
            $scope.hobbiesListing.splice(index, 1);
        }
    };
    $scope.removeHobby = function(index, hobby) {
        $scope.currentSelectedHobby = index;
        $scope.hobbiesListing.push($scope.host.hobbies[index]);
        $scope.host.hobbies[index] = false;
    };

    $scope.infoPhotos = null;
    $scope.picturesLengthValidation = function() {
        console.log($scope.host.pictures);
        if ($scope.host.pictures.length == 12) {
            $scope.infoPhotos = "Vous avez attend la limite de 12 photos par hébérgement.";
        } else if ($scope.host.pictures.length < 6) {
            $scope.infoPhotos = "Un minimum de 6 photos est nécésaire à la création d'un hébérgement.";
        } else if ($scope.host.pictures.length > 12) {
            $scope.infoPhotos = "Vous avez dépassez la limite de 12 photos par hébérgement. Supprimez des photos.";
        } else {
            $scope.infoPhotos = $scope.host.pictures.length;
        }
    };
    $scope.removePicture = function(index) {
        console.log(typeof($scope.host.pictures[index]));
        if (typeof($scope.host.pictures[index]) === 'string') removedPictures.push($scope.host.pictures[index]);
        $scope.host.pictures.splice(index, 1);
        $scope.picturesLengthValidation();
    };

    function upload(photos, updatedPlaceID) {
        if (photos && photos.length) {
            Upload.upload({
                url: '/api/places/uploadImages/' + updatedPlaceID,
                data: {
                    files: photos,
                    totalFiles: photos.length,
                    update: false
                }
            }).progress(function(event) {
                var progressPercentage = parseInt(100.0 * event.loaded / event.total);
                console.log('progress: ' + progressPercentage + '% ');
            }).success(function(data, status, headers, config) {
                console.log(JSON.stringify(data));
            });
        }
    }
    $scope.updateImages = function() {
        var newImages = [];
        var picturesList = [];
        $scope.host.pictures.forEach(function(picture) {
            if (typeof(picture) == 'object') {
                newImages.push(picture);
                picturesList.push(picture.name);
            } else {
                picturesList.push(picture);
            }
        });
        console.log(picturesList);
        console.log(newImages);
        var obj = {};
        obj.removedPictures = removedPictures;
        obj.picturesList = picturesList;
        if (newImages.length > 0) upload(newImages, $scope.currentHost);
        placesService.updatePictures($scope.currentHost, obj).then(function(res) {
            removedPictures = [];
            console.log(res);
        });
    };
});
