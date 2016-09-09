angular.module('app').controller('spotController', function($window, $scope, $routeParams, spotsFactory, spotsService, placesService, searchFactory) {

    $scope.topReached = false;

    if ($window.localStorage.currentUser) {
        $scope.currentUser = JSON.parse($window.localStorage.getItem('currentUser'));
        console.log($scope.currentUser);
    } else $scope.currentUser = {
        _id: null
    };

    $scope.currentSpot = $routeParams.id;

    $scope.options = {
        latitudeRange: {},
        longitudeRange: {},
        center: {}
    };
    spotsService.getOne($scope.currentSpot).then(function(res) {
        console.log(res.data);
        $scope.spot = res.data;
        $scope.options.center.latitude = res.data.latitude;
        $scope.options.center.longitude = res.data.longitude;
        $scope.computeLatLngDiff();
    });

    var r_earth = 6378137;
    $scope.searchRadiusModel = 500000;
    $scope.computeLatLngDiff = function() {
        $scope.options.radius = $scope.searchRadiusModel;
        var LatDiff = ($scope.options.radius / r_earth) * (180 / Math.PI);
        var LngDiff = ($scope.options.radius / r_earth) * (180 / Math.PI) / Math.cos($scope.options.center.latitude * Math.PI / 180);
        $scope.options.latitudeRange.min = $scope.options.center.latitude - LatDiff;
        $scope.options.latitudeRange.max = $scope.options.center.latitude + LatDiff;
        $scope.options.longitudeRange.min = $scope.options.center.longitude + LngDiff;
        $scope.options.longitudeRange.max = $scope.options.center.longitude - LngDiff;
        console.log($scope.options);
        placesService.getPlacesNearBy($scope.options).then(function(res) {
            $scope.placesNearBy = res.data;
        });
    };

    $scope.addSpotComment = function() {
        $scope.comment.owner = $scope.currentUser._id;
        console.log($scope.comment);
        spotsService.addComment($scope.currentSpot, $scope.comment).then(function(res) {
            console.log(res);
        });
    };

    $scope.togglePlaceInfoWindow = function(event, place) {
        $scope.map.showInfoWindow('placePopup', this);
        $scope.toggleledPlace = place;
    };

    var directionsDisplay = new google.maps.DirectionsRenderer();
    var directionsService = new google.maps.DirectionsService();
    $scope.getDirections = function(origin, destination) {
        var request = {
            origin: new google.maps.LatLng(origin.latitude, origin.longitude),
            destination: new google.maps.LatLng(destination.latitude, destination.longitude),
            travelMode: google.maps.DirectionsTravelMode.DRIVING
        };
        directionsService.route(request, function(response, status) {
            if (status === google.maps.DirectionsStatus.OK) {
                $scope.travelDistance = response.routes[0].legs[0].distance.text;
                $scope.travelDuration = response.routes[0].legs[0].duration.text;
                $scope.$apply();
            } else {
                console.log(response);
            }
        });
    };
});
