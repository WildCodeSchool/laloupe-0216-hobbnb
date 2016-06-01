angular.module('app').controller('usersController', function($scope, $routeParams, $location, $http, usersFactory, usersService) {
    switch($routeParams.action) {
        case 'login':
            //Login then redirect to current profile page
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
