// MAIN CONTROLLER
angular.module('app').controller('mainController', function($scope, $location, $http, mainService, searchFactory) {
    $scope.search = function() {
        searchFactory.data.city = $scope.city;
        $location.path('/search');
    }
});
