angular.module('app', ['oc.lazyLoad', 'ngMap', 'ui-rangeSlider', 'ngRoute', 'ngCookies', 'ui.materialize', 'ngAutocomplete'])
    .factory('usersFactory', usersFactory)
    .controller('globalUserController', globalUserController)
    .config(routes);
