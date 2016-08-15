angular.module('app').controller('searchController', function($scope, $http, $window, NgMap, NavigatorGeolocation, placesService, usersService, searchFactory) {

    /* initialisation */
    $scope.hobbiesListing = ["Randonnée", "VTT", "Cyclisme", "Equitation", "Pêche", "Plongée", "Golf", "Escalade", "Canoë Kayak", "Surf", "Stand up Paddle", "Kitesurf", "Windsurf", "Ski", "Alpinisme", "Parapente", "Spéléologie", "Cannoning"];
    $scope.propertyTypeListing = ["Maison", "Appartement", "Chambre", "Couchage", "Place de camping", "Cabane dans les arbres", "Camping car", "Tipy", "Bateau", "Yourte"];
    $scope.filters = {
        home: {
            houseSpace: {},
            intro: {}
        },
        rating: {
            valueForMoney: 3
        }
    };
    $scope.price = {
        min: 0,
        max: 1000
    };

    $scope.latitude =   {};
    $scope.longitude =   {};
    $scope.centerMap = 'current-location';

    NgMap.getMap('myMap').then(function(map) {
        $scope.map = map;
    });
    
    NavigatorGeolocation.getCurrentPosition().then(function(res) {
        console.log(res);
    }, function(err) {
        /* when google geoloc fail */
        console.log(err);
        console.log('Trying with ipinfo:');
        $http.get("http://ipinfo.io").then(function(ipinfo) {
            $scope.centerMap = ipinfo.data.loc;
        });
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

    placesService.get().then(function(res) {
        $scope.positions = res.data;
        $scope.positions.map(function(e) {
            if (e.rating.cleanness.length <= 0) {
                e.rating.cleanness = [3];
            }
            if (e.rating.location.length <= 0) {
                e.rating.location = [3];
            }
            if (e.rating.valueForMoney.length <= 0) {
                e.rating.valueForMoney = [3];
            }
            usersService.getOne(e.owner).then(function(res) {
                e.owner = res.data;
            });
            return e;
        });
        //Ask from main page
        $scope.locality = searchFactory.data.city;
        $scope.filters.primarySports = searchFactory.data.hobby;
    });

    // $scope.developOptions = false;

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
    $scope.toggleInfoWindow = function(event, place) {
        $scope.map.showInfoWindow('popup', this);
        $scope.toggleledPlace = place;
    };
    $scope.locationToData = function() {
        searchFactory.data.city = $scope.filters.place;
    };
    $scope.hobbyToData = function() {
        searchFactory.data.hobby = $scope.filters.hobby;
    };
});
