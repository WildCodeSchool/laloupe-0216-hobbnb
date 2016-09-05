angular.module('app').controller('searchController', function($scope, $http, $window, $filter, NgMap, NavigatorGeolocation, placesService, spotsService, usersService, searchFactory) {
    /* initialisation */
    if (searchFactory.data.hobby) $scope.filters.hobby = searchFactory.data.hobby;
    if (searchFactory.data.city) $scope.locality = searchFactory.data.city;
    $scope.slideTogglePlacesFilter = true;
    $scope.slideToggleSpotsFilter = true;
    $scope.hobbiesListing = ["Randonnée", "VTT", "Cyclisme", "Equitation", "Pêche", "Plongée", "Golf", "Escalade", "Canoë Kayak", "Surf", "Stand up Paddle", "Kitesurf", "Windsurf", "Ski", "Alpinisme", "Parapente", "Spéléologie", "Cannoning"];
    $scope.selectedHobbies = [];
    $scope.toggleSelectedHobby = function(hobby) {
        var idx = $scope.selectedHobbies.indexOf(hobby);
        if (idx > -1) {
            $scope.selectedHobbies.splice(idx, 1);
        } else {
            $scope.selectedHobbies.push(hobby);
        }
        $scope.placeFilter();
        $scope.spotFilter();
    };
    $scope.propertyTypeListing = ["Maison", "Appartement", "Chambre", "Couchage", "Place de camping", "Cabane dans les arbres", "Camping car", "Tipy", "Bateau", "Yourte"];
    $scope.selectedPropertyType = [];
    $scope.toggleSelectedPropertyType = function(propertyType) {
        var idx = $scope.selectedPropertyType.indexOf(propertyType);
        if (idx > -1) {
            $scope.selectedPropertyType.splice(idx, 1);
        } else {
            $scope.selectedPropertyType.push(propertyType);
        }
        $scope.placeFilter();
    };

    $scope.price = {
        min: 0,
        max: 1000
    };
    $scope.latitude =   {};
    $scope.longitude =   {};
    $scope.centerMap = 'current-location';

    $scope.placeFilters = {};
    $scope.filteredPlaces = [];
    placesService.get().then(function(res) {
        $scope.places = res.data;
        $scope.filteredPlaces = $scope.places;
    });
    spotsService.get().then(function(res) {
        $scope.spots = res.data;
        $scope.filteredSpots = $scope.spots;
    });

    $scope.placeFilter = function() {
        $scope.filteredPlaces = $filter('hobbies')($scope.places, $scope.selectedHobbies);
        $scope.filteredPlaces = $filter('propertyTypes')($scope.filteredPlaces, $scope.selectedPropertyType);
        $scope.filteredPlaces = $filter('filter')($scope.filteredPlaces, $scope.placeFilters);
        $scope.filteredPlaces = $filter('betweenPrice')($scope.filteredPlaces, $scope.price.min, $scope.price.max);
        $scope.filteredPlaces = $filter('betweenLon')($scope.filteredPlaces, $scope.latitude.min, $scope.latitude.max);
        $scope.filteredPlaces = $filter('betweenLat')($scope.filteredPlaces, $scope.longitude.min, $scope.longitude.max);
    };
    $scope.spotFilter = function() {
        $scope.filteredSpots = $filter('hobbiesInSpots')($scope.spots, $scope.selectedHobbies);
        $scope.filteredSpots = $filter('betweenLon')($scope.filteredSpots, $scope.latitude.min, $scope.latitude.max);
        $scope.filteredSpots = $filter('betweenLat')($scope.filteredSpots, $scope.longitude.min, $scope.longitude.max);
        $scope.filteredSpots = $filter('orderBy')($scope.filteredSpots, $scope.spotFilters);
    };


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
