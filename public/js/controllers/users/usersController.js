angular.module('app').controller('usersController', function($scope, $rootScope, $cookies, $routeParams, $location, $http, $window, usersService, messagingService, emailService) {

    if ($cookies.get('token')) {
        $window.localStorage.setItem('currentUser', $cookies.get('user'));
        $window.localStorage.token = $cookies.get('token');
        $cookies.remove('token');
        $cookies.remove('user');
    }
    console.log($routeParams);

    if (!$routeParams._id) {
        $scope.user = $scope.currentUser;
        $scope.user.rating.overallRating = 0;
        $scope.user.rating.numberOfRatings = 0;
    }

    usersService.findHost($scope.user._id).then
    (function(res) {
        $scope.places = res.data;
    });
    usersService.findSpot($scope.user._id).then(function(res) {
        $scope.spots = res.data;
    });
    usersService.findMsg($scope.user._id).then(function(res) {
        $scope.msgs = res.data;
    });

});
