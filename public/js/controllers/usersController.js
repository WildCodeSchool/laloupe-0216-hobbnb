angular.module('app').controller('usersController', function($scope, $route, $routeParams, $location, $http, usersFactory, usersService) {
    switch($routeParams.action) {
        case 'login':
        //Login then redirect to current profile page
            $scope.login = function() {
                usersService.login({email:$scope.email, password:$scope.password}).then(function(res) {
                    usersFactory.currentUser = res.data;
                    $location.path('/user/' + usersFactory.currentUser._id);
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
            break;
        case 'create':
        //Create an account
            if(!!usersFactory.currentUser._id) $location.path('/user/'+usersFactory.currentUser._id)
            $scope.hobbinaut = {};
            $scope.create = function() {
                if($scope.hobbinaut.password === $scope.hobbinaut.passwordConfirm) {
                    usersService.create($scope.hobbinaut).then(function(res) {
                        usersFactory.currentUser = res.data;
                        $location.path('/user/' + res.data._id);
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
            $scope.currentUser = usersFactory.currentUser;
            if(!usersFactory.currentUser._id) {
                $location.path('/user/login');
            } else if($routeParams.action != usersFactory.currentUser._id) {
                console.log('it\'s the profile of ' + $routeParams.action);
            } else {
                console.log('hello ' + usersFactory.currentUser.email);
            }
    }
});
