angular.module('app').controller('usersController', function($scope, $rootScope, $routeParams, $location, $http, $window, usersService) {
    if($window.localStorage.currentUser) $scope.currentUser = JSON.parse($window.localStorage.getItem('currentUser'));
    else $scope.currentUser = {_id:null};
    switch ($routeParams.action) {
        case 'login':
            //Login then redirect to current profile page
            $scope.login = function() {
                usersService.login({
                    email: $scope.email,
                    password: $scope.password
                }).then(function(res) {
                    $window.localStorage.setItem('currentUser', JSON.stringify(res.data.user));
                    $window.localStorage.token = res.data.token;
                    $rootScope.$emit('userUpdated', null);
                    $location.path('/user/' + res.data.user._id);
                }, function(res) {
                    $scope.error = res.data;
                });
            }
            $scope.create = function() {
                $location.path('/user/create');
            }
            break;
        case 'logout':
            //Logout and redirect to login page
            $window.localStorage.removeItem('token');
            $window.localStorage.removeItem('currentUser');
            $rootScope.$emit('userUpdated', null);
            break;
        case 'create':
            //Create an account
            if (!!$scope.currentUser._id) $location.path('/user/' + $scope.currentUser._id)
            $scope.hobbinaut = {};
            $scope.create = function() {
                if ($scope.hobbinaut.password === $scope.hobbinaut.passwordConfirm) {
                    usersService.create($scope.hobbinaut).then(function(res) {
                        $window.localStorage.setItem('currentUser', JSON.stringify(res.data.user));
                        $window.localStorage.token = res.data.token;
                        $rootScope.$emit('userUpdated', null);
                        $location.path('/user/' + res.data.user._id);
                    }, function(res) {
                        $scope.error = res.data;
                    });
                } else {
                    $scope.error = 'Mots de passes différents';
                }
            }
            break;
        default:
            //Action is an id, show user ; if user is current show profile
            if (!$scope.currentUser._id) {
                $location.path('/user/login');
            } else if ($routeParams.action != $scope.currentUser._id) {
                console.log('it\'s the profile of ' + $routeParams.action);
            } else {
                console.log('hello ' + $scope.currentUser.email);
            }
    }
});
