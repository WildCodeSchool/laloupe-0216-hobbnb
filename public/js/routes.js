function routes($routeProvider, $httpProvider) {
    $routeProvider
        .when('/', {
            templateUrl: 'views/main.html',
            controller: 'mainController',
            resolve: {
                lazy: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'app',
                        files: [
                            'js/factories/searchFactory.js',
                            'js/factories/searchFactory.js',
                            'js/controllers/mainController.js'
                        ]
                    });
                }]
            }
        })
        .when('/search', {
            templateUrl: 'views/search.html',
            controller: 'searchController',
            resolve: {
                connected: checkIsConnected,
                lazy: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'app',
                        files: [
                            'js/services/placesService.js',
                            'js/factories/placesFactory.js',
                            'js/factories/searchFactory.js',
                            'js/filters/rangeFilter.js',
                            'js/filters/betweenFilter.js',
                            'js/controllers/searchController.js'
                        ]
                    });
                }]
            }
        })
        .when('/place', {
            templateUrl: 'views/create-place-page.html',
            controller: 'createPlacesController',
            resolve: {
                connected: checkIsConnected,
                lazy: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'app',
                        files: [
                            'js/services/placesService.js',
                            'js/factories/placesFactory.js',
                            'js/filters/rangeFilter.js',
                            'js/controllers/createPlacesController.js'
                        ]
                    });
                }]
            }
        })
        .when('/place/:id', {
            templateUrl: 'views/place-page.html',
            controller: 'placesController',
            resolve: {
                connected: checkIsConnected,
                lazy: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'app',
                        files: [
                            'js/services/usersService.js',
                            'js/services/placesService.js',
                            'js/factories/placesFactory.js',
                            'js/factories/searchFactory.js',
                            'js/filters/rangeFilter.js',
                            'js/controllers/placesController.js'
                        ]
                    });
                }]
            }
        })
        .when('/spot', {
            templateUrl: 'views/create-spot-page.html',
            controller: 'createSpotsController',
            resolve: {
                connected: checkIsConnected,
                lazy: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'app',
                        files: [
                            'js/services/spotsService.js',
                            'js/factories/spotsFactory.js',
                            'js/controllers/createSpotsController.js'
                        ]
                    });
                }]
            }
        })
        .when('/spot/:id', {
            templateUrl: 'views/spot-page.html',
            controller: 'spotsController',
            resolve: {
                connected: checkIsConnected,
                lazy: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'app',
                        files: [
                            'js/services/spotsService.js',
                            'js/controllers/spotsController.js'
                        ]
                    });
                }]
            }
        })
        .when('/picture/:where/:step/:id', {
            templateUrl: 'views/picture.html',
            controller: 'fileUploadController',
            resolve: {
                connected: checkIsConnected,
                lazy: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'app',
                        files: [
                            'js/directives/fileDirective.js',
                            'js/controllers/fileUploadController.js'
                        ]
                    });
                }]
            }
        })
        .when('/user/:action', {
            templateUrl: function(params) {
                switch (params.action) {
                    case 'login':
                        //Login then redirect to current profile page
                        return 'views/user/login.html';
                        break;
                    case 'logout':
                        //Logout and redirect to login page
                        return 'views/user/logout.html';
                        break;
                    case 'create':
                        //Create an account
                        return 'views/user/create.html';
                        break;
                    default:
                        //Show my profile
                        return 'views/user/profile.html';
                }
            },
            controller: 'usersController',
            resolve: {
                lazy: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'app',
                        files: [
                            'js/services/usersService.js',
                            'js/controllers/usersController.js'
                        ]
                    });
                }]
            }
        })
        .otherwise({
            redirectTo: '/'
        });
    $httpProvider.interceptors.push(function($q, $location, $window) {
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
                    $location.path('/');
                }
                return $q.reject(response);
            }
        };
    });

    function checkIsConnected($q, $http, $location) {
        var deferred = $q.defer();

        $http.get('/users/loggedin').success(function() {
            deferred.resolve();
        }).error(function() {
            deferred.reject();
            $location.url('/user/login');
        });

        return deferred.promise;
    };
}
