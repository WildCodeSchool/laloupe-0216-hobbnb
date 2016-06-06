angular.module('app').controller('searchController', function($scope, $http, NgMap, placesService, spotsService, searchFactory) {

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

    var screenSpot = function(){
        $scope.btnSpot={'backgroundColor' : '#69f0ae'};
        $scope.btnHome={'backgroundColor' : '#FFFFFF'};
        $scope.changeHobby();
        $scope.definitiveFilter = {};
        spotsService.get().then(function(res) {
            $scope.positions = res.data;
            console.dir($scope.positions);
            $scope.positions.map(function(e) {
                if (e.rating.quality.length <= 0) {
                    e.rating.quality = [3];
                }
                if (e.rating.beauty.length <= 0) {
                    e.rating.beauty = [3];
                }
                if (e.rating.accessibility.length <= 0) {
                    e.rating.accessibility = [3];
                }
                return e;
            });
        });
        $scope.$watchCollection('filters', function(newCol, oldCol) {
            if (!!newCol.hobby) {
                if (!$scope.definitiveFilter.spot) $scope.definitiveFilter.spot = [];
                if (newCol.hobby == 'Peu importe') {
                    $scope.filters.hobby = '';
                    if (!!$scope.definitiveFilter.spot.primarySports) delete $scope.definitiveFilter.spot.primarySports;
                } else {
                    $scope.definitiveFilter.spot.primarySports = newCol.hobby;
                }
            }

        });
        console.dir($scope.definitiveFilter);
    }
    var screenHome = function(){
        $scope.btnSpot={'backgroundColor' : '#FFFFFF'};
        $scope.btnHome={'backgroundColor' : '#69f0ae'};
        $scope.tile = '../assets/search/tileHome.png';
        tile = '../assets/search/tileHome.png';
        $scope.definitiveFilter = {};
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
                return e;
            });

            var selectChoice = function(v, choice){ //exemple de v=[home, houseAmenities,bbq]
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
                                //newCol.place = results[0].formatted_address;
                                $scope.centerMap = newCol.place;
                                $scope.latitude = loc.lat;
                                $scope.longitude = loc.lon;
                                $scope.latitudemin = $scope.latitude - 0.5;
                                $scope.latitudemax = $scope.latitude + 0.5;
                                $scope.kmbydegree = (111 * Math.cos($scope.latitude));
                                $scope.longitudemin = $scope.longitude + 35 / $scope.kmbydegree;
                                $scope.longitudemax = $scope.longitude - 35 / $scope.kmbydegree;
                            }
                        });
                    }, 1000);
                }
            });
            //Ask from main page
            $scope.filters.place = searchFactory.data.city;
            $scope.filters.hobby = searchFactory.data.hobby;

            // more Option
            $scope.moreFiltrer = function() {
                $scope.developOptions = !$scope.developOptions;
            };
            /* Generate calendar for booking */
            var currentTime = new Date();
            $scope.arrivalDate = (new Date(currentTime.getTime() + (1000 * 60 * 60 * 24))).toISOString();
            $scope.departureDate = (new Date(currentTime.getTime() + (1000 * 60 * 60 * 24 * 2))).toISOString();
            $scope.month = ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'];
            $scope.monthShort = ['Jan', 'Fev', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Aout', 'Sep', 'Oct', 'Nov', 'Dec'];
            $scope.weekdaysFull = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche'];
            $scope.weekdaysLetter = ['L', 'M', 'Me', 'J', 'V', 'S', 'D'];
            $scope.disable = [false];
            $scope.today = 'Aujourd\'hui';
            $scope.clear = '';
            $scope.close = 'Fermer';
            var days = 365;
            $scope.minDate = $scope.arrivalDate;
            $scope.maxDate = (new Date(currentTime.getTime() + (1000 * 60 * 60 * 24 * days))).toISOString();
            $scope.minDateD = $scope.departureDate;
            $scope.maxDateD = (new Date(currentTime.getTime() + (1000 * 60 * 60 * 24 * days))).toISOString();


        });
    }

    //init google map
    $scope.centerMap = "Lorient";
    //init color bottons and tile
    $scope.btnSpot={'backgroundColor' : '#FFFFFF'};
    $scope.btnHome={'backgroundColor' : '#69f0ae'};
    $scope.tile = '../assets/search/tileHome.png';
    $scope.selectHome = "place";
    $scope.developOptions = false;
    screenHome();
    //Flip-flop Spot-Home
    $scope.spotOrHome = function(choice) {
        $scope.selectHome = choice;
        if ($scope.selectHome === "place") {
            screenHome();
        } else {
            screenSpot();
        }
    };

    $scope.changeHobby = function() {
        if ($scope.selectHome === "place") {
            $scope.tile = '../assets/search/tile' + $scope.formHobby + '.png';
        }
    };

    $scope.howManyPositive = function(t) {
        return !!t ? (~~(t.reduce(function(a, b) {
            return a + b;
        }) / t.length) || 0) : 0;
    };
    $scope.nbReview = function(widget) {
        if (!!widget.cleanness){
            return ~~((widget.cleanness.length + widget.location.length + widget.valueForMoney.length) / 3);
        } else {
            return ~~((widget.quality.length + widget.beauty.length + widget.accessibility.length) / 3);
        }
    };
    $scope.toggleInfoWindow = function(event, id) {
        $scope.map.showInfoWindow('popup', this);
        $scope.indexOfTheTruc = id;
        if ($scope.selectHome === true){
            $scope.globalRating = $scope.howManyPositive($scope.positions[id].rating.valueForMoney.concat($scope.positions[id].rating.location, $scope.positions[id].rating.cleanness));
        } else {
            $scope.globalRating = $scope.howManyPositive($scope.positions[id].rating.quality.concat($scope.positions[id].rating.beauty, $scope.positions[id].rating.accessibility));
        }
        $scope.globalLowerRating = 5 - $scope.globalRating;
        $scope.reviewNb = $scope.nbReview($scope.positions[id].rating);
    };
    $scope.calculStars = function(widget) {
        if (!!widget.cleanness){
            $scope.globalRating = $scope.howManyPositive(widget.valueForMoney.concat(widget.location, widget.cleanness));
        } else {
            $scope.globalRating = $scope.howManyPositive(widget.quality.concat(widget.beauty, widget.accessibility));
        }
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
        var url = "../uploads/" + $scope.selectHome + "s/" + widget._id + "/" + widget.picture;
        console.log(url);
        return "{'background-image': 'url("+url+")'}";
    };
});
