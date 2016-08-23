angular.module('app').controller('searchSpotController', function($scope, $http, NavigatorGeolocation, NgMap, spotsService, usersService, searchFactory) {
    /* initialisation */
    if (searchFactory.data.hobby) $scope.filters.hobby = searchFactory.data.hobby;
    if (searchFactory.data.city) $scope.locality = searchFactory.data.city;
    $scope.hobbiesListing = ["Randonnée", "VTT", "Cyclisme", "Equitation", "Pêche", "Plongée", "Golf", "Escalade", "Canoë Kayak", "Surf", "Stand up Paddle", "Kitesurf", "Windsurf", "Ski", "Alpinisme", "Parapente", "Spéléologie", "Cannoning"];
    $scope.propertyTypeListing = ["Hebergement", "Maison", "Appartement", "Chambre", "Couchage", "Place de camping", "Cabane dans les arbres", "Camping car", "Tipy", "Bateau", "Yourte"];
    $scope.latitude =   {};
    $scope.longitude =   {};
    $scope.centerMap = 'current-location';

    spotsService.get().then(function(res) {
        $scope.positions = res.data;
    });

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
    $scope.toggleInfoWindow = function(event, spot) {
        $scope.map.showInfoWindow('popup', this);
        $scope.toggleledSpot = spot;
    };
});
