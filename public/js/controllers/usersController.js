angular.module('app').controller('usersController', function($scope, $route, $routeParams, $location, $http, usersFactory, usersService) {
    switch($routeParams.action) {
        case 'login':
        //Login then redirect to current profile page
            $scope.login = function() {
                usersService.login({email:$scope.email, password:$scope.password}).then(function(res) {
                    console.log(res);
                });
            }
            $scope.email = 'test';
            $scope.password = 'test';
            $scope.login();
            break;
        case 'logout':
        //Logout and redirect to login page
            break;
        case 'create':
        //Create an account
            break;
        default:
        //Action is an id, show user ; if user is current show profile
    }
});
