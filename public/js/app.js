angular.module('app', ['ngRoute', 'ui.materialize', 'ngMap'])
    .config(routes)
    .controller('mainController', mainController)
    .controller('placesController', placesController)
    .controller('hideController', hideController)
    .controller('searchController', searchController)
    .service('mainService', mainService)
    .service('placesService', placesService)
    //.service('hideService', hideService)
    .factory('placesFactory', placesFactory)
    .filter('range', function() {
        return function(input, total) {
            total = parseInt(total);
            for (var i = 0; i < total; i++) {
                input.push(i);
            }
            return input;
        };
    });
