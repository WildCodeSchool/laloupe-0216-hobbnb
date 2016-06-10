// PLACES CONTROLLER
angular.module('app').controller('placesController', function($scope, $http, $location, $routeParams, placesFactory, placesService, usersService, searchFactory) {

    /* Generate calendar for booking */
    var currentTime = new Date();
    $scope.arrival = (new Date(currentTime.getTime() + (1000 * 60 * 60 * 24))).toISOString();
    $scope.departure = (new Date(currentTime.getTime() + (1000 * 60 * 60 * 24 * 2))).toISOString();
    $scope.month = ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'];
    $scope.monthShort = ['Jan', 'Fev', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Aout', 'Sep', 'Oct', 'Nov', 'Dec'];
    $scope.weekdaysFull = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche'];
    $scope.weekdaysLetter = ['L', 'M', 'Me', 'J', 'V', 'S', 'D'];
    $scope.disable = [false];
    $scope.today = 'Aujourd\'hui';
    $scope.clear = '';
    $scope.close = 'Fermer';
    var days = 365;
    $scope.minDate = $scope.arrival;
    $scope.maxDate = (new Date(currentTime.getTime() + (1000 * 60 * 60 * 24 * days))).toISOString();
    $scope.minDateD = $scope.departure;
    $scope.maxDateD = (new Date(currentTime.getTime() + (1000 * 60 * 60 * 24 * days))).toISOString();


    $scope.currentHost = $routeParams.id;
    $scope.howManyPositive = function(t) {
        return !!t ? (~~(t.reduce(function(a, b) {
            return a + b;
        }) / t.length) || 0) : 0;
    };
    placesService.getOne($scope.currentHost).then(function(e) {

        if (!e.data.shortDescription) $location.path('/creation/place');

        usersService.getOne(e.data.owner).then(function(res) {
            $scope.owner = res.data;
            $('#recipient').val($scope.owner._id);
            if ($scope.owner.rating.length <= 0) {
                $scope.owner.rating = [3];
            }
            $scope.owner.globalRating = $scope.howManyPositive($scope.owner.rating);
            $scope.owner.globalLowerRating = 5 - $scope.owner.globalRating;
            $scope.owner.numReviews = $scope.owner.rating.length;
        }, function(err) {
            $location.path('/creation/place');
        });

        $scope.host = e.data;

        searchFactory.data.city = $scope.host.address.city;
        searchFactory.data.hobby = $scope.host.primarySports;

        if ($scope.host.rating.cleanness.length <= 0) {
            $scope.host.rating.cleanness = [3];
        }
        if ($scope.host.rating.location.length <= 0) {
            $scope.host.rating.location = [3];
        }
        if ($scope.host.rating.valueForMoney.length <= 0) {
            $scope.host.rating.valueForMoney = [3];
        }

        $scope.globalRating = $scope.howManyPositive($scope.host.rating.cleanness.concat($scope.host.rating.location, $scope.host.rating.valueForMoney));
        $scope.globalLowerRating = 5 - $scope.globalRating;
        $scope.numReviews = ~~(($scope.host.rating.cleanness.length + $scope.host.rating.location.length + $scope.host.rating.valueForMoney.length) / 3);

        $scope.host.comments.forEach(function(c, i) {
            usersService.getOne(c.owner).then(function(r) {
                $scope.host.comments[i].owner = r.data;
            })
        })
    });

});
