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
        .otherwise({
            redirectTo: '/'
        });
}
