angular.module('app').controller('usersController', function($scope, $rootScope, $routeParams, $location, $http, $window, usersService, messagingService, emailService) {

    if ($window.localStorage.currentUser) $scope.currentUser = JSON.parse($window.localStorage.getItem('currentUser'));
    else $scope.currentUser = {
        _id: null
    };

    $scope.format = function(date) {
        return messagingService.format(date);
    }

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
                        emailService.send(res.data.user.identity.firstName, res.data.user.email, 'Bonjour ' + res.data.user.identity.firstName + ',<br />Vous avez créé un compte sur hobbnb, pour l\'activer cliquez sur le lien suivant : <a href="http://hobbnb.herokuapp.com/users/activate/' + res.data.user._id + '">Activer mon compte</a>');
                        $scope.message = 'Votre compte a été créé, consultez votre boîte mail pour l\'activer ! ;-)';
                            // $window.localStorage.setItem('currentUser', JSON.stringify(res.data.user));
                            // $window.localStorage.token = res.data.token;
                            // $rootScope.$emit('userUpdated', null);
                            // $location.path('/user/' + res.data.user._id);
                    }, function(res) {
                        $scope.error = res.data;
                    });
                } else {
                    $scope.error = 'Mots de passes différents';
                }
            }
            break;

        case 'edit':

            if (!$scope.currentUser._id) {
                $location.path('/');
            } else {
                $scope.user = $scope.currentUser;
            }
            $scope.save = function() {
                if ($scope.user.password === $scope.passwordConfirm) {
                    usersService.update($scope.user._id, $scope.user).then(function(res) {
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
            $scope.howManyPositive = function(t) {
                return !!t ? (~~(t.reduce(function(a, b) {
                    return a + b;
                }) / t.length) || 0) : 0;
            };
            if (!$scope.currentUser._id) {
                $location.path('/user/login');
            } else if ($routeParams.action != $scope.currentUser._id) {
                usersService.getOne($routeParams.action).then(function(res) {
                    $scope.user = res.data;
                    $scope.canModify = false;
                }, function() {
                    $location.path('/');
                });
            } else {
                $scope.user = $scope.currentUser;
                $scope.canModify = true;
            }
            if ($scope.user.rating.length <= 0) {
                $scope.user.rating = [3];
            }
            $scope.globalRating = $scope.howManyPositive($scope.user.rating);
            $scope.globalLowerRating = 5 - $scope.globalRating;
            $scope.numReviews = $scope.user.rating.length;
            usersService.findHost($scope.user._id).then(function(res) {
                $scope.places = res.data;
            });
            usersService.findSpot($scope.user._id).then(function(res) {
                $scope.spots = res.data;
            });
            usersService.findMsg($scope.user._id).then(function(res) {
                $scope.msgs = res.data;
            });

    }

});
