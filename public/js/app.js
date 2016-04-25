angular.module('app', ['ngRoute', 'ui.materialize'])
    .config(routes)
    .controller('mainController', mainController)
    .controller('placesController', placesController)
    .service('mainService', mainService)
    .service('placesService', placesService)
    .factory('placesFactory', placesFactory);
