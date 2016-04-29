angular.module('app', ['ngRoute', 'ui.materialize'])
    .config(routes)
    .controller('mainController', mainController)
    .controller('placesController', placesController)
    .controller('hideController', hideController)
    .service('mainService', mainService)
    .service('placesService', placesService)
    //.service('hideService', hideService)
    .factory('placesFactory', placesFactory);
