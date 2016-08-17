angular.module('app').controller('searchSpotController', function($scope, $http, NavigatorGeolocation, NgMap, spotsService, usersService, searchFactory) {

    /* initialisation */
    $scope.hobbiesListing = ["Randonnée", "VTT", "Cyclisme", "Equitation", "Pêche", "Plongée", "Golf", "Escalade", "Canoë Kayak", "Surf", "Stand up Paddle", "Kitesurf", "Windsurf", "Ski", "Alpinisme", "Parapente", "Spéléologie", "Cannoning"];
    $scope.propertyTypeListing = ["Hebergement", "Maison", "Appartement", "Chambre", "Couchage", "Place de camping", "Cabane dans les arbres", "Camping car", "Tipy", "Bateau", "Yourte"];
    $scope.filters = {
        rating: {
            popularity: 3,
            accessibility: 3,
            beauty: 3,
            quality: 3,
            overallRating: 3
        }
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
        $scope.positions = res.data;
        $scope.positions.map(function(e) {
            if (e.rating.popularity <= 0) {
                e.rating.popularity = 3;
            }
            if (e.rating.quality.length <= 0) {
                e.rating.quality = [3];
            }
            if (e.rating.beauty.length <= 0) {
                e.rating.beauty = [3];
            }
            if (e.rating.accessibility.length <= 0) {
                e.rating.accessibility = [3];
            }
            if (e.rating.overallRating <= 0) {
                e.rating.overallRating = 3;
            }
            usersService.getOne(e.owner).then(function(res) {
                e.owner = res.data;
            });
            return e;
        });
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
