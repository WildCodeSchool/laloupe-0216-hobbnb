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
                            'js/services/mainService.js',
                            'js/controllers/mainController.js',
                            'js/controllers/hideController.js'
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
        .when('/picture', {
            templateUrl: 'views/picture.html',
            controller: 'fileUploadController',
            resolve: {
                lazy: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'app',
                        files: [
                            'js/services/fileUploadService.js',
                            'js/directives/fileDirective.js',
                            'js/controllers/fileUploadController.js'
                        ]
                    });
                }]
            }
        })
        .otherwise({
            redirectTo: '/'
        });
}
