angular.module('app').controller('searchController', function($scope, $http, $window, NgMap, NavigatorGeolocation, placesService, usersService, searchFactory) {
    /* initialisation */
    if (searchFactory.data.hobby) $scope.filters.hobby = searchFactory.data.hobby;
    if (searchFactory.data.city) $scope.locality = searchFactory.data.city;
    $scope.hobbiesListing = ["Randonnée", "VTT", "Cyclisme", "Equitation", "Pêche", "Plongée", "Golf", "Escalade", "Canoë Kayak", "Surf", "Stand up Paddle", "Kitesurf", "Windsurf", "Ski", "Alpinisme", "Parapente", "Spéléologie", "Cannoning"];
    $scope.propertyTypeListing = ["Maison", "Appartement", "Chambre", "Couchage", "Place de camping", "Cabane dans les arbres", "Camping car", "Tipy", "Bateau", "Yourte"];
    $scope.filters = {};
    $scope.price = {
        min: 0,
        max: 1000
    };
    $scope.latitude =   {};
    $scope.longitude =   {};
    $scope.centerMap = 'current-location';

    placesService.get().then(function(res) {
        console.log(res.data);
        $scope.positions = res.data;
    });

    NgMap.getMap('myMap').then(function(map) {
        $scope.map = map;
    });
    $scope.getHoveredPlaceIndex = function(index, hovered) {
        if (hovered) $scope.hoveredPlaceIndex = index;
        else $scope.hoveredPlaceIndex = null;
    };
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
    $scope.toggleInfoWindow = function(event, place) {
        $scope.map.showInfoWindow('popup', this);
        $scope.toggleledPlace = place;
    };
});
