// PLACES CONTROLLER
function placesController($scope, $http, $routeParams, placesFactory, placesService) {



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
    placesService.getOne($scope.currentHost).then(function(e) {
        console.dir(e.data);
        $scope.host = e.data;
    });

}
