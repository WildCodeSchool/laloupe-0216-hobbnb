angular.module('app').controller('searchController', function($scope, $http, NgMap, placesService, spotsService, usersService, searchFactory) {

    var delay;
    NgMap.getMap().then(function(map) {
        $scope.map = map;
    });

    /* initialisation */
    $scope.hobbiesListing = ['Peu importe', "Randonnée", "VTT", "Cyclisme", "Equitation", "Pêche", "Plongée", "Golf", "Escalade", "Canoë Kayak", "Surf", "Stand up Paddle", "Kitesurf", "Windsurf", "Ski", "Alpinisme", "Parapente", "Spéléologie", "Cannoning"];
    $scope.formHobby = 'Choisissez un hobby...';
    $scope.propertyTypeListing = ["Hebergement", "Maison", "Appartement", "Chambre", "Couchage", "Place de camping", "Cabane dans les arbres", "Camping car", "Tipy", "Bateau", "Yourte"];
    $scope.filters = {
        minPrice: 0,
        maxPrice: 1000,
        priceRange: {
            min: 0,
            max: 1000
        }
    }
    $scope.definitiveFilter = {};
    placesService.get().then(function(res) {
        console.log(res.data);
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

        var selectChoice = function(v, choice) { //exemple de v=[home, houseAmenities,bbq]
            if (!$scope.definitiveFilter[v[0]]) $scope.definitiveFilter[v[0]] = [];
            if (!$scope.definitiveFilter[v[0]][v[1]]) $scope.definitiveFilter[v[0]][v[1]] = [];
            if (!!choice) {
                $scope.definitiveFilter[v[0]][v[1]][v[2]] = choice;
            } else {
                if (!!$scope.definitiveFilter[v[0]][v[1]][v[2]]) delete $scope.definitiveFilter[v[0]][v[1]][v[2]];
            }
        }

        $scope.$watchCollection('filters', function(newCol, oldCol) {
            if (!!newCol.hobby) {
                if (newCol.hobby == 'Peu importe') {
                    $scope.filters.hobby = '';
                    if (!!$scope.definitiveFilter.primarySports) delete $scope.definitiveFilter.primarySports;
                } else {
                    $scope.definitiveFilter.primarySports = newCol.hobby;
                }
            }
            selectChoice(['home', 'houseSpace', 'propertyType'], newCol.propertyType);
            selectChoice(['home', 'houseSpace', 'beds'], newCol.beds);
            selectChoice(['home', 'houseSpace', 'kitchen'], newCol.hasKitchen);
            selectChoice(['home', 'houseAmenities', 'wifi'], newCol.hasWifi);
            selectChoice(['home', 'houseAmenities', 'tv'], newCol.hasTV);
            selectChoice(['home', 'houseAmenities', 'essentials'], newCol.hasEssentials);
            selectChoice(['home', 'houseAmenities', 'bbq'], newCol.hasBbq);

            // model sur http://jsfiddle.net/Wijmo/Rqcsj/
            if (!!newCol.place) {
                clearTimeout(delay);
                delay = setTimeout(function() {
                    if (!this.geocoder) this.geocoder = new google.maps.Geocoder();
                    this.geocoder.geocode({
                        'address': newCol.place
                    }, function(results, status) {
                        if (status == google.maps.GeocoderStatus.OK) {
                            var loc = results[0].geometry.location;
                            $scope.latitude = loc.lat();
                            $scope.longitude = loc.lng();
                            $scope.latitudemin = $scope.latitude - 0.5;
                            $scope.latitudemax = $scope.latitude + 0.5;
                            $scope.kmbydegree = (111 * Math.cos($scope.latitude));
                            $scope.longitudemin = $scope.longitude + 35 / $scope.kmbydegree;
                            $scope.longitudemax = $scope.longitude - 35 / $scope.kmbydegree;
                        } else {
                            delete $scope.latitude;
                            delete $scope.longitude;
                            delete $scope.latitudemax;
                            delete $scope.latitudemin;
                            delete $scope.kmbydegree;
                            delete $scope.longitudemax;
                            delete $scope.longitudemin;
                        }
                    });
                }, 1000);
            } else {
                delete $scope.latitude;
                delete $scope.longitude;
                delete $scope.latitudemax;
                delete $scope.latitudemin;
                delete $scope.kmbydegree;
                delete $scope.longitudemax;
                delete $scope.longitudemin;
            }
        });
        //Ask from main page
        $scope.filters.place = searchFactory.data.city;
        $scope.filters.hobby = searchFactory.data.hobby;

        // more Option
        $scope.moreFiltrer = function() {
            $scope.developOptions = !$scope.developOptions;
        };
    });

    $scope.developOptions = false;

    $scope.tile = function(activity) {
        return 'assets/search/tileHome.png';
    };

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
    $scope.toggleInfoWindow = function(event, id) {
        $scope.map.showInfoWindow('popup', this);
        $scope.indexOfTheTruc = id;
        $scope.globalRating = $scope.howManyPositive($scope.positions[id].rating.valueForMoney.concat($scope.positions[id].rating.location, $scope.positions[id].rating.cleanness));
        $scope.globalLowerRating = 5 - $scope.globalRating;
        $scope.reviewNb = $scope.nbReview($scope.positions[id].rating);
    };
    $scope.calculStars = function(widget) {
        $scope.globalRating = $scope.howManyPositive(widget.valueForMoney.concat(widget.location, widget.cleanness));
        var resul = "";
        for (var i = 0; i < $scope.globalRating; i++) {
            resul += "star ";
        }
        return resul;
    };
    $scope.calculLowerStars = function(widget) {
        $scope.globalLowerRating = 5 - $scope.globalRating;
        var resul = "";
        for (var i = 0; i < $scope.globalLowerRating; i++) {
            resul += "star ";
        }
        return resul;
    };
    $scope.hobbyIco = function(widget) {
        return "../assets/hobbies/" + widget.primarySports + ".png";
    };
    $scope.pictPlace = function(widget) {
        var url = "uploads/places/" + widget._id + "/thumb/" + widget.picture;
        return "{'background-image': 'url(" + url + ")', 'background-size': 'cover'}";
    };
    $scope.locationToData = function() {
        searchFactory.data.city = $scope.filters.place;
    }
    $scope.hobbyToData = function() {
        searchFactory.data.hobby = $scope.filters.hobby;
    }
});
