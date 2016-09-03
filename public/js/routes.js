function routes($routeProvider, $httpProvider, $locationProvider) {
    $locationProvider.html5Mode(true).hashPrefix('!');
    $routeProvider
        .when('/', {
            templateUrl: '/views/main.html',
            controller: 'mainController',
            resolve: {
                lazy: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'app',
                        files: [
                            '/js/services/placesService.js',
                            '/js/services/spotsService.js',
                            '/js/factories/searchFactory.js',
                            '/js/controllers/mainController.js'
                        ]
                    });
                }]
            }
        })
        .when('/admin', {
            templateUrl: '/views/admin.html',
            controller: 'adminController',
            resolve: {
                lazy: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'app',
                        files: [
                            '/js/services/placesService.js',
                            '/js/services/spotsService.js',
                            '/js/services/messagingService.js',
                            '/js/controllers/adminController.js'
                        ]
                    });
                }]
            }
        })
        .when('/search/', {
            templateUrl: '/views/search.html',
            controller: 'searchController',
            resolve: {
                lazy: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'app',
                        files: [
                            '/js/animations/vertical-slide-toggle.js',
                            '/js/directives/starRatingDirective.js',
                            '/js/services/usersService.js',
                            '/js/services/placesService.js',
                            '/js/factories/searchFactory.js',
                            '/js/filters/rangeFilter.js',
                            '/js/filters/betweenFilter.js',
                            '/js/controllers/searchController.js'
                        ]
                    });
                }]
            }
        })
        .when('/searchSpot', {
            templateUrl: '/views/searchSpot.html',
            controller: 'searchSpotController',
            resolve: {
                lazy: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'app',
                        files: [
                            '/js/animations/vertical-slide-toggle.js',
                            '/js/directives/starRatingDirective.js',
                            '/js/services/usersService.js',
                            '/js/services/spotsService.js',
                            '/js/factories/searchFactory.js',
                            '/js/filters/rangeFilter.js',
                            '/js/filters/betweenFilter.js',
                            '/js/controllers/searchSpotController.js'
                        ]
                    });
                }]
            }
        })
        .when('/creation/place', {
            templateUrl: '/views/places/createPlace.html',
            controller: 'createPlaceController',
            resolve: {
                connected: checkIsConnected,
                lazy: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'app',
                        files: [
                            '/js/libs/jquery-ui.min.js',
                            '/js/libs/sortable.js',
                            '/js/libs/ng-file-upload.min.js',
                            '/js/services/placesService.js',
                            '/js/services/emailService.js',
                            '/js/factories/placesFactory.js',
                            '/js/filters/rangeFilter.js',
                            '/js/controllers/places/createPlaceController.js'
                        ]
                    });
                }]
            }
        })
        .when('/edition/place/:id', {
            templateUrl: '/views/places/editPlace.html',
            controller: 'editPlaceController',
            resolve: {
                connected: checkIsConnected,
                lazy: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'app',
                        files: [
                            '/js/directives/starRatingDirective.js',
                            '/js/libs/jquery-ui.min.js',
                            '/js/libs/sortable.js',
                            '/js/libs/ng-file-upload.min.js',
                            '/js/services/usersService.js',
                            '/js/services/placesService.js',
                            '/js/services/emailService.js',
                            '/js/factories/placesFactory.js',
                            '/js/factories/searchFactory.js',
                            '/js/controllers/places/editPlaceController.js'
                        ]
                    });
                }]
            }
        })
        .when('/place/:id', {
            templateUrl: '/views/places/showPlace.html',
            controller: 'placeController',
            resolve: {
                lazy: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'app',
                        files: [
                            '/js/directives/starRatingDirective.js',
                            '/js/services/usersService.js',
                            '/js/services/placesService.js',
                            '/js/services/emailService.js',
                            '/js/services/messagingService.js',
                            '/js/factories/placesFactory.js',
                            '/js/factories/searchFactory.js',
                            '/js/filters/rangeFilter.js',
                            '/js/controllers/messageController.js',
                            '/js/controllers/places/placeController.js'
                        ]
                    });
                }]
            }
        })
        .when('/creation/spot', {
            templateUrl: '/views/spots/createSpot.html',
            controller: 'createSpotController',
            resolve: {
                connected: checkIsConnected,
                lazy: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'app',
                        files: [
                            '/js/libs/jquery-ui.min.js',
                            '/js/libs/sortable.js',
                            '/js/libs/ng-file-upload.min.js',
                            '/js/services/spotsService.js',
                            '/js/services/emailService.js',
                            '/js/factories/spotsFactory.js',
                            '/js/controllers/spots/createSpotController.js'
                        ]
                    });
                }]
            }
        })
        .when('/edition/spot/:id', {
            templateUrl: '/views/spots/editSpot.html',
            controller: 'editSpotController',
            resolve: {
                connected: checkIsConnected,
                lazy: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'app',
                        files: [
                            '/js/directives/starRatingDirective.js',
                            '/js/libs/jquery-ui.min.js',
                            '/js/libs/sortable.js',
                            '/js/libs/ng-file-upload.min.js',
                            '/js/services/usersService.js',
                            '/js/services/spotsService.js',
                            '/js/services/emailService.js',
                            '/js/factories/spotsFactory.js',
                            '/js/factories/searchFactory.js',
                            '/js/controllers/spots/editSpotController.js'
                        ]
                    });
                }]
            }
        })
        .when('/spot/:id', {
            templateUrl: '/views/spots/showSpot.html',
            controller: 'spotController',
            resolve: {
                lazy: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'app',
                        files: [
                            '/js/directives/starRatingDirective.js',
                            '/js/services/usersService.js',
                            '/js/services/spotsService.js',
                            '/js/services/emailService.js',
                            '/js/factories/spotsFactory.js',
                            '/js/factories/searchFactory.js',
                            '/js/filters/rangeFilter.js',
                            '/js/controllers/spots/spotController.js'

                        ]
                    });
                }]
            }
        })
        .when('/messages', {
            templateUrl: '/views/messaging/inbox.html',
            controller: 'inboxController',
            resolve: {
                connected: checkIsConnected,
                lazy: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'app',
                        files: [
                            '/js/services/emailService.js',
                            '/js/services/messagingService.js',
                            '/js/controllers/inboxController.js'
                        ]
                    });
                }]
            }
        })
        .when('/message/:id', {
            templateUrl: '/views/messaging/message.html',
            controller: 'messageController',
            resolve: {
                connected: checkIsConnected,
                lazy: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'app',
                        files: [
                            '/js/services/emailService.js',
                            '/js/services/messagingService.js',
                            '/js/services/usersService.js',
                            '/js/controllers/messageController.js'
                        ]
                    });
                }]
            }
        })
        .when('/messages/:id', {
            templateUrl: '/views/messaging/view.html',
            controller: 'messagingController',
            resolve: {
                connected: checkIsConnected,
                lazy: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'app',
                        files: [
                            '/js/services/emailService.js',
                            '/js/services/messagingService.js',
                            '/js/services/usersService.js',
                            '/js/controllers/messagingController.js'
                        ]
                    });
                }]
            }
        })
        .when('/user/login', {
            templateUrl: 'views/user/login.html',
            controller: 'connectController',
            resolve: {
                lazy: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'app',
                        files: [
                            '/js/services/emailService.js',
                            '/js/services/usersService.js',
                            '/js/controllers/users/connectController.js'
                        ]
                    });
                }]
            }
        })
        .when('/user/register', {
            templateUrl: 'views/user/create.html',
            controller: 'connectController',
            resolve: {
                lazy: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'app',
                        files: [
                            '/js/services/emailService.js',
                            '/js/services/usersService.js',
                            '/js/controllers/connectController.js'
                        ]
                    });
                }]
            }
        })
        .when('/user/profile', {
            templateUrl: 'views/user/profile.html',
            controller: 'usersController',
            resolve: {
                lazy: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'app',
                        files: [
                            '/js/directives/starRatingDirective.js',
                            '/js/directives/toggleIt.js',
                            '/js/services/emailService.js',
                            '/js/services/messagingService.js',
                            '/js/services/usersService.js',
                            '/js/controllers/users/usersController.js'
                        ]
                    });
                }]
            }
        })
        // .when('/user/:action', {}
        //     templateUrl: function(params) {
        //         switch (params.action) {
        //             case 'login':
        //                 //Login then redirect to current profile page
        //                 return '/views/user/login.html';
        //                 break;
        //             case 'logout':
        //                 //Logout and redirect to login page
        //                 return '/views/user/logout.html';
        //                 break;
        //             case 'create':
        //                 //Create an account
        //                 return '/views/user/create.html';
        //                 break;
        //             case 'edit':
        //                 //Create an account
        //                 return '/views/user/edit.html';
        //                 break;
        //             default:
        //                 //Show my profile
        //                 return '/views/user/profile.html';
        //         }
        //     },
        //     controller: 'usersController',
        //     resolve: {
        //         lazy: ['$ocLazyLoad', function($ocLazyLoad) {
        //             return $ocLazyLoad.load({
        //                 name: 'app',
        //                 files: [
        //                     '/js/services/emailService.js',
        //                     '/js/services/messagingService.js',
        //                     '/js/services/usersService.js',
        //                     '/js/filters/rangeFilter.js',
        //                     '/js/controllers/usersController.js'
        //                 ]
        //             });
        //         }]
        //     }
        // })
        .when('/sendEmail/', {
            templateUrl: '/views/sendEmail.html',
            controller: 'emailController',
            resolve: {
                lazy: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'app',
                        files: [
                            '/js/controllers/emailController.js',
                            '/js/services/emailService.js'
                        ]
                    });
                }]
            }
        })
        .when('/email/', {
            templateUrl: '/views/static/email.html',
        })
        .when('/faq', {
            templateUrl: '/views/static/faq.html',
        })
        .when('/find-out-more', {
            templateUrl: '/views/static/find-out-more.html',
        })
        .when('/how-it-work', {
            templateUrl: '/views/static/how-it-work.html',
        })
        .when('/host-cancellation-policy', {
            templateUrl: '/views/static/host-cancellation-policy.html',
        })
        .when('/social-connections', {
            templateUrl: '/views/static/social-connections.html',
        })
        .when('/terms-privacy', {
            templateUrl: '/views/static/terms-privacy.html',
        })
        .when('/about', {
            templateUrl: '/views/static/about.html',
        })
        .when('/press', {
            templateUrl: '/views/static/press.html',
        })
        .otherwise({
            redirectTo: '/'
        });
    $httpProvider.interceptors.push(function($q, $location, $window, $rootScope) {
        return {
            'request': function(config) {
                config.headers = config.headers || {};
                if ($window.localStorage.token) {
                    config.headers.authorization = $window.localStorage.token;
                }
                return config;
            },
            'responseError': function(response) {
                if (response.status === 401 || response.status === 403) {
                    $location.path('/user/login');
                    // $window.localStorage.removeItem('token');
                    // $window.localStorage.removeItem('currentUser');
                    // $location.path('/user/login');
                }
                return $q.reject(response);
            }
        };
    });

    function checkIsConnected($q, $http, $location, $window, $rootScope) {
        var deferred = $q.defer();

        $http.get('/api/users/loggedin').success(function() {
            deferred.resolve();
        }).error(function() {
            deferred.reject();
            $window.localStorage.removeItem('token');
            $window.localStorage.removeItem('currentUser');
            $rootScope.currentUser = null;
            $location.path('/user/login');
        });

        return deferred.promise;
    }
}
