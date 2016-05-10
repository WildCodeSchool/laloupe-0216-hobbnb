function routes($routeProvider) {
    $routeProvider
        .when('/', {
            templateUrl: 'views/main.html',
            controller: 'mainController'
        })
        .when('/search', {
            templateUrl: 'views/search.html',
            controller: 'searchController'
        })
        .when('/place/:id', {
            templateUrl: 'views/place-page.html',
            controller: 'placesController'
        })
        .when('/picture', {
            templateUrl: 'views/picture.html',
            controller: 'fileUploadController',
        })
        .otherwise({
            redirectTo: '/'
        });
}
