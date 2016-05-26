angular.module('app').controller('searchController', function($scope, $http, NgMap, placesService, searchFactory) {

    var delay;
    NgMap.getMap().then(function(map) {
        $scope.map = map;
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
            return e;
        });
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
        };

        $scope.definitiveFilter = {};
        $scope.$watchCollection('filters', function(newCol, oldCol) {
            if (!!newCol.hobby) {
                if (newCol.hobby == 'Peu importe') {
                    $scope.filters.hobby = '';
                    if (!!$scope.definitiveFilter.primarySports) delete $scope.definitiveFilter.primarySports;
                } else {
                    $scope.definitiveFilter.primarySports = newCol.hobby;
                }
            }
            if (!!newCol.propertyType) {
                if (newCol.propertyType == 'Hebergement') {
                    $scope.filters.propertyType = '';
                    if (!!$scope.definitiveFilter.home.houseSpace.propertyType) delete $scope.definitiveFilter.home.houseSpace.propertyType;
                } else {
                    if (!$scope.definitiveFilter.home) $scope.definitiveFilter.home = [];
                    if (!$scope.definitiveFilter.home.houseSpace) $scope.definitiveFilter.home.houseSpace = [];
                    $scope.definitiveFilter.home.houseSpace.propertyType = newCol.propertyType;
                }
            }
            if (!!newCol.beds) {
                if (!$scope.definitiveFilter.home) $scope.definitiveFilter.home = [];
                if (!$scope.definitiveFilter.home.houseSpace) $scope.definitiveFilter.home.houseSpace = [];
                $scope.definitiveFilter.home.houseSpace.beds = newCol.beds;
            }
            if (!!newCol.hasKitchen) {
                if (!$scope.definitiveFilter.home) $scope.definitiveFilter.home = [];
                if (!$scope.definitiveFilter.home.houseAmenities) $scope.definitiveFilter.home.houseAmenities = [];
                $scope.definitiveFilter.home.houseAmenities.kitchen = newCol.hasKitchen;
            } else {
                if (!$scope.definitiveFilter.home) $scope.definitiveFilter.home = [];
                if (!$scope.definitiveFilter.home.houseAmenities) $scope.definitiveFilter.home.houseAmenities = [];
                if (!!$scope.definitiveFilter.home.houseAmenities.kitchen) delete $scope.definitiveFilter.home.houseAmenities.kitchen;
            }
            if (!!newCol.hasWifi) {
                if (!$scope.definitiveFilter.home) $scope.definitiveFilter.home = [];
                if (!$scope.definitiveFilter.home.houseAmenities) $scope.definitiveFilter.home.houseAmenities = [];
                $scope.definitiveFilter.home.houseAmenities.wifi = newCol.hasWifi;
            } else {
                if (!$scope.definitiveFilter.home) $scope.definitiveFilter.home = [];
                if (!$scope.definitiveFilter.home.houseAmenities) $scope.definitiveFilter.home.houseAmenities = [];
                if (!!$scope.definitiveFilter.home.houseAmenities.wifi) delete $scope.definitiveFilter.home.houseAmenities.wifi;
            }
            if (!!newCol.hasTV) {
                if (!$scope.definitiveFilter.home) $scope.definitiveFilter.home = [];
                if (!$scope.definitiveFilter.home.houseAmenities) $scope.definitiveFilter.home.houseAmenities = [];
                $scope.definitiveFilter.home.houseAmenities.tv = newCol.hasTV;
            } else {
                if (!$scope.definitiveFilter.home) $scope.definitiveFilter.home = [];
                if (!$scope.definitiveFilter.home.houseAmenities) $scope.definitiveFilter.home.houseAmenities = [];
                if (!!$scope.definitiveFilter.home.houseAmenities.tv) delete $scope.definitiveFilter.home.houseAmenities.tv;
            }
            if (!!newCol.hasEssentials) {
                if (!$scope.definitiveFilter.home) $scope.definitiveFilter.home = [];
                if (!$scope.definitiveFilter.home.houseAmenities) $scope.definitiveFilter.home.houseAmenities = [];
                $scope.definitiveFilter.home.houseAmenities.essentials = newCol.hasEssentials;
            } else {
                if (!$scope.definitiveFilter.home) $scope.definitiveFilter.home = [];
                if (!$scope.definitiveFilter.home.houseAmenities) $scope.definitiveFilter.home.houseAmenities = [];
                if (!!$scope.definitiveFilter.home.houseAmenities.essentials) delete $scope.definitiveFilter.home.houseAmenities.essentials;
            }
            if (!!newCol.hasBbq) {
                if (!$scope.definitiveFilter.home) $scope.definitiveFilter.home = [];
                if (!$scope.definitiveFilter.home.houseAmenities) $scope.definitiveFilter.home.houseAmenities = [];
                $scope.definitiveFilter.home.houseAmenities.bbq = newCol.hasBbq;
            } else {
                if (!$scope.definitiveFilter.home) $scope.definitiveFilter.home = [];
                if (!$scope.definitiveFilter.home.houseAmenities) $scope.definitiveFilter.home.houseAmenities = [];
                if (!!$scope.definitiveFilter.home.houseAmenities.bbq) delete $scope.definitiveFilter.home.houseAmenities.bbq;
            }
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
        $scope.changeHobby = function() {
            if ($scope.selectHome === false) {
                $scope.tile = '../assets/search/tile' + $scope.formHobby + '.png';
            }
        };
        //init google map
        $scope.centerMap = "Lorient";
        //init color bottons and tile
        document.getElementById("btnSpot").style.backgroundColor = "#FFFFFF";
        document.getElementById("btnHome").style.backgroundColor = "#69f0ae";
        $scope.tile = '../assets/search/tileHome.png';
        $scope.selectHome = true;
        $scope.developOptions = false;
        //Flip-flop Spot-Home
        $scope.spotOrHome = function(choice) {
            $scope.selectHome = choice;
            if ($scope.selectHome === true) {
                document.getElementById("btnSpot").style.backgroundColor = "#FFFFFF";
                document.getElementById("btnHome").style.backgroundColor = "#69f0ae";
                $scope.tile = '../assets/search/tileHome.png';

                tile = '../assets/search/tileHome.png';
            } else {
                document.getElementById("btnSpot").style.backgroundColor = "#69f0ae";
                document.getElementById("btnHome").style.backgroundColor = "#FFFFFF";
                $scope.changeHobby();
            }
        };
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

        $scope.howManyPositive = function(t) {
            return !!t ? (~~(t.reduce(function(a, b) {
                return a + b;
            }) / t.length) || 0) : 0;
        };
        $scope.nbReview = function(widget) {
            return ~~((widget.cleanness.length + widget.location.length + widget.valueForMoney.length) / 3);
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
            return "{'background-image': 'url(" + widget + ")'}";
        };

    });
});
