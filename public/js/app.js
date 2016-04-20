angular.module('app', ['ngRoute'])
    .config(routes)
    .controller('mainController', mainController)
    .service('mainService', mainService);
