angular.module('app').controller('searchSpotController', function($scope, $http, NavigatorGeolocation, NgMap, spotsService, usersService, searchFactory) {

    /* initialisation */
    $scope.hobbiesListing = ["Randonnée", "VTT", "Cyclisme", "Equitation", "Pêche", "Plongée", "Golf", "Escalade", "Canoë Kayak", "Surf", "Stand up Paddle", "Kitesurf", "Windsurf", "Ski", "Alpinisme", "Parapente", "Spéléologie", "Cannoning"];
    $scope.propertyTypeListing = ["Hebergement", "Maison", "Appartement", "Chambre", "Couchage", "Place de camping", "Cabane dans les arbres", "Camping car", "Tipy", "Bateau", "Yourte"];
    $scope.filters = {};
    $scope.filters.rating = {
        numberOfRatings: null,
        accessibility: null,
        beauty: null,
        quality: null,
        overallRating: null
      };
    $scope.rating = {
        numberOfRatings: -1,
        accessibility: -1,
        beauty: -1,
        quality: -1,
        overallRating: -1
    };

    $scope.latitude =   {};
    $scope.longitude =   {};
    $scope.centerMap = 'current-location';

    NgMap.getMap().then(function(map) {
        $scope.map = map;
    });

    $scope.$watch(function() {
        return $scope.details;
    }, function() {
        if ($scope.details) {
            $scope.latitude.min = $scope.details.geometry.location.lat() - 0.5;
            $scope.latitude.max = $scope.details.geometry.location.lat() + 0.5;
            $scope.kmbydegree = (111 * Math.cos($scope.details.geometry.location.lat()));
            $scope.longitude.min = $scope.details.geometry.location.lng() + 35 / $scope.kmbydegree;
            $scope.longitude.max = $scope.details.geometry.location.lng() - 35 / $scope.kmbydegree;
            $scope.centerMap = [$scope.details.geometry.location.lat(), $scope.details.geometry.location.lng()];
        }
    });

    spotsService.get().then(function(res) {
        console.log(res.data);
        $scope.positions = res.data;
        //Ask from over page
        $scope.locality = searchFactory.data.city;
        $scope.filters.primarySports = searchFactory.data.hobby;
    });

    $scope.howManyPositive = function(t) {
        return !!t ? (~~(t.reduce(function(a, b) {
            return a + b;
        }) / t.length) || 0) : 0;
    };
    $scope.nbReview = function(widget) {
        if (!!widget.cleanness) {
            return ~~((widget.cleanness.length + widget.location.length + widget.valueForMoney.length) / 3);
        } else {
            return ~~((widget.quality.length + widget.beauty.length + widget.accessibility.length) / 3);
        }
    };
    $scope.toggleInfoWindow = function(event, spot) {
        $scope.map.showInfoWindow('popup', this);
        $scope.toggleledSpot = spot;
    };
    $scope.locationToData = function() {
        searchFactory.data.city = $scope.filters.place;
    };
    $scope.hobbyToData = function() {
        searchFactory.data.hobby = $scope.filters.hobby;
    };
});
