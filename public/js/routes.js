function routes($routeProvider) {
    $routeProvider
        .when('/', {
            templateUrl: 'views/main.html',
            controller: 'mainController'
        })
        .when('/place', {
            templateUrl: 'views/place-page.html',
            controller: 'placesController'
        })
        .when('/picture', {
            templateUrl: 'views/picture.html',
            controller: 'mainController'
        })
        .otherwise({
            redirectTo: '/'
        });
}
