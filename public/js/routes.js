function routes($routeProvider) {
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
                lazy: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'app',
                        files: [
                            'js/services/placesService.js',
                            'js/factories/placesFactory.js',
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
            templateUrl: 'views/users.html',
            controller: 'usersController',
            resolve: {
                lazy: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'app',
                        files: [
                            'js/services/usersService.js',
                            'js/factories/usersFactory.js',
                            'js/controllers/usersController.js'
                        ]
                    });
                }]
            }
        })
        .otherwise({
            redirectTo: '/'
        });
}
