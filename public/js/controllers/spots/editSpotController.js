angular.module('app').controller('editSpotController', function($scope, $window, $http, $location, $routeParams, Upload, spotsFactory, spotsService, usersService, emailService, searchFactory) {

    if ($window.localStorage.currentUser) $scope.currentUser = JSON.parse($window.localStorage.getItem('currentUser'));
    else $scope.currentUser = {
        _id: null
    };

    $scope.hobbiesListing = ["Randonnée", "VTT", "Cyclisme", "Equitation", "Pêche", "Plongée", "Golf", "Escalade", "Canoë Kayak", "Surf", "Stand up Paddle", "Kitesurf", "Windsurf", "Ski", "Alpinisme", "Parapente", "Spéléologie", "Cannoning"];
    $scope.currentSpot = $routeParams.id;
    var removedPictures = [];

    spotsService.getOne($scope.currentSpot).then(function(res) {
        if (res.data.owner._id == $scope.currentUser._id || $scope.currentUser.isAdmin) {
            $scope.spot = res.data;
            $scope.spot.modification = new Date();
            $scope.formattedAddress = "";
            if (res.data.address.street_number) $scope.formattedAddress += res.data.address.street_number = ' ';
            if (res.data.address.route) $scope.formattedAddress += res.data.address.route + ', ';
            if (res.data.address.postal_code) $scope.formattedAddress += res.data.address.postal_code + ' ';
            if (res.data.address.locality) $scope.formattedAddress += res.data.address.locality + ', ';
            $scope.formattedAddress +=  res.data.address.country;
            $scope.photos = res.data.pictures;
        }
    });

    $scope.infoPhotos = null;
    $scope.picturesLengthValidation = function() {
        if ($scope.spot.pictures.length == 12) {
            $scope.infoPhotos = "Vous avez attend la limite de 12 photos par hébérgement.";
        } else if ($scope.spot.pictures.length < 6) {
            $scope.infoPhotos = "Un minimum de 6 photos est nécésaire à la création d'un hébérgement.";
        } else if ($scope.spot.pictures.length > 12) {
            $scope.infoPhotos = "Vous avez dépassez la limite de 12 photos par hébérgement. Supprimez des photos.";
        } else {
            $scope.infoPhotos = $scope.spot.pictures.length;
        }
    };
    $scope.removePicture = function(index) {
        if (typeof($scope.spot.pictures[index]) === 'string') removedPictures.push($scope.spot.pictures[index]);
        $scope.spot.pictures.splice(index, 1);
        $scope.picturesLengthValidation();
    };
    function upload(photos, updatedSpotID) {
        if (photos && photos.length) {
            Upload.upload({
                url: '/api/spots/uploadImages/' + updatedSpotID,
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
        $scope.spot.pictures.forEach(function(picture) {
            if (typeof(picture) == 'object') {
                newImages.push(picture);
                picturesList.push(picture.name);
            } else {
                picturesList.push(picture);
            }
        });
        var obj = {};
        obj.removedPictures = removedPictures;
        obj.picturesList = picturesList;
        if (newImages.length > 0) upload(newImages, $scope.currentSpot);
        spotsService.updatePictures($scope.currentSpot, obj).then(function(res) {
            removedPictures = [];
        });
    };
});
