angular.module('app').controller('searchController', function($rootScope, $scope, $http, $window, $filter, NgMap, NavigatorGeolocation, placesService, spotsService, usersService, searchFactory) {
    /* initialisation */
    $scope.slideTogglePlacesFilter = false;
    $scope.slideToggleSpotsFilter = false;
    $scope.price = {
        min: 0,
        max: 1000
    };

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

    placesService.get().then(function(res) {
        $scope.showPlace = true;
        $scope.places = res.data;
        $scope.filteredPlaces = $scope.places;
        if (searchFactory.data.selectedHobbies) {
            $scope.selectedHobbies = searchFactory.data.selectedHobbies;
            $scope.placeFilter();
        }
    });
    spotsService.get().then(function(res) {
        $scope.showSpot = true;
        $scope.spots = res.data;
        $scope.filteredSpots = $scope.spots;
        if (searchFactory.data.selectedHobbies) {
            $scope.selectedHobbies = searchFactory.data.selectedHobbies;
            $scope.spotFilter();
        }
    });

    $scope.placeFilter = function() {
        $scope.filteredPlaces = $filter('filter')($scope.places, $scope.placeFilters);
        $scope.filteredPlaces = $filter('hobbies')($scope.filteredPlaces, $scope.selectedHobbies);
        $scope.filteredPlaces = $filter('propertyTypes')($scope.filteredPlaces, $scope.selectedPropertyType);
        $scope.filteredPlaces = $filter('betweenPrice')($scope.filteredPlaces, $scope.price.min, $scope.price.max);
        $scope.filteredPlaces = $filter('inArea')($scope.filteredPlaces, $scope.latitudeRange, $scope.longitudeRange, $scope.center, $scope.searchRadius);
    };
    $scope.spotFilter = function() {
        $scope.filteredSpots = $filter('hobbiesInSpots')($scope.spots, $scope.selectedHobbies);
        $scope.filteredSpots = $filter('inArea')($scope.filteredSpots, $scope.latitudeRange, $scope.longitudeRange, $scope.center, $scope.searchRadius);
        $scope.filteredSpots = $filter('orderBy')($scope.filteredSpots, $scope.spotFilters);
    };

    NgMap.getMap('myMap').then(function(map) {
        $scope.map = map;
    });
    $scope.getHoveredPlaceIndex = function(index, hovered) {
        if (hovered) $scope.hoveredPlaceIndex = index;
        else $scope.hoveredPlaceIndex = null;
    };
    $scope.getHoveredSpotIndex = function(index, hovered) {
        if (hovered) $scope.hoveredSpotIndex = index;
        else $scope.hoveredSpotIndex = null;
    };

    $scope.center = {};
    // $scope.centerMap = 'current-location';
    NavigatorGeolocation.getCurrentPosition({
            enableHighAccuracy: true
        })
        .then(function(position) {
            $scope.center.latitude = position.coords.latitude;
            $scope.center.longitude = position.coords.longitude;
            $scope.centerMap = [$scope.center.latitude, $scope.center.longitude];
            $scope.currentLocation = position.longitude;
        });

    $scope.latitudeRange = {};
    $scope.longitudeRange = {};
    $rootScope.$on('city', function(event, center) {
        console.log(center);
        $scope.centerMap = [center.latitude, center.longitude];
        $scope.center = center;
        $scope.computeLatLngDiff();
    });
    var r_earth = 6378137;
    $scope.searchRadiusModel = 50000;
    $scope.computeLatLngDiff = function() {
        $scope.searchRadius = $scope.searchRadiusModel;
        var LatDiff = ($scope.searchRadius / r_earth) * (180 / Math.PI);
        var LngDiff = ($scope.searchRadius / r_earth) * (180 / Math.PI) / Math.cos($scope.center.latitude * Math.PI / 180);
        $scope.latitudeRange.min = $scope.center.latitude - LatDiff;
        $scope.latitudeRange.max = $scope.center.latitude + LatDiff;
        $scope.longitudeRange.min = $scope.center.longitude + LngDiff;
        $scope.longitudeRange.max = $scope.center.longitude - LngDiff;
        $scope.placeFilter();
        $scope.spotFilter();
    };

    function getDistanceFromLatLonInMetters(lat1, lon1, lat2, lon2) {
        var dLat = (Math.PI / 180) * (lat2 - lat1);
        var dLon = (Math.PI / 180) * (lon2 - lon1);
        var a =
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos((Math.PI / 180) * (lat1)) * Math.cos((Math.PI / 180) * (lat2)) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
        var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        var d = r_earth * c; // Distance in km
        return d;
    }

    $scope.togglePlaceInfoWindow = function(event, place) {
        $scope.map.showInfoWindow('placePopup', this);
        $scope.toggleledPlace = place;
    };
    $scope.toggleSpotInfoWindow = function(event, spot) {
        $scope.map.showInfoWindow('spotPopup', this);
        $scope.toggleledSpot = spot;
    };
});
