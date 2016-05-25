// PLACES CONTROLLER
angular.module('app').controller('placesController', function($scope, $http, $routeParams, placesFactory, placesService) {



    /* Generate calendar for booking */
    var currentTime = new Date();
    $scope.arrival = (new Date(currentTime.getTime() + ( 1000 * 60 * 60 *24 ))).toISOString();
    $scope.departure = (new Date(currentTime.getTime() + ( 1000 * 60 * 60 *24 * 2))).toISOString();
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
    $scope.maxDate = (new Date(currentTime.getTime() + ( 1000 * 60 * 60 *24 * days ))).toISOString();
    $scope.minDateD = $scope.departure;
    $scope.maxDateD = (new Date(currentTime.getTime() + ( 1000 * 60 * 60 *24 * days ))).toISOString();


    $scope.currentHost = $routeParams.id;
    $scope.howManyPositive = function(t) {
        return !!t ? (~~(t.reduce(function(a,b){return a+b;}) / t.length) || 0) : 0;
    };
    placesService.getOne($scope.currentHost).then(function(e) {
        $scope.host = e.data;
        $scope.globalRating = $scope.howManyPositive($scope.host.rating.cleanness.concat($scope.host.rating.location, $scope.host.rating.valueForMoney));
        $scope.globalLowerRating = 5 - $scope.globalRating;
        $scope.numReviews = ~~(($scope.host.rating.cleanness.length + $scope.host.rating.location.length + $scope.host.rating.valueForMoney.length) / 3);
    });

});
