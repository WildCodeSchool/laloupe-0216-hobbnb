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
                            'js/controllers/mainController.js',
                            'js/controllers/hideController.js',
                            'js/services/mainService.js'
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
                            'js/libs/ng-map.min.js',
                            'js/libs/angular.rangeSlider.js',
                            'js/libs/angular-locale_fr-fr.js',
                            'js!https://maps.google.com/maps/api/js?key=AIzaSyAamy-iuBFyQu-qNuihVdTQDCPyaqzrUac',
                            'js/controllers/searchController.js',
                            'js/services/placesService.js',
                            'js/factories/placesFactory.js',
                            'js/filters/rangeFilter.js'
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
                            'js/libs/ng-map.min.js',
                            'js!https://maps.google.com/maps/api/js?key=AIzaSyAamy-iuBFyQu-qNuihVdTQDCPyaqzrUac',
                            'js/controllers/placesController.js',
                            'js/services/placesService.js',
                            'js/factories/placesFactory.js',
                            'js/filters/rangeFilter.js'
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
                            'js/controllers/fileUploadController.js',
                            'js/services/fileUploadService.js',
                            'js/directives/fileDirective.js'
                        ]
                    });
                }]
            }
        })
        .otherwise({
            redirectTo: '/'
        });
}
