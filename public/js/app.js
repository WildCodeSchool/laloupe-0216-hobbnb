angular.module('app', ['oc.lazyLoad', 'ngMap', 'ngAnimate', 'ui-rangeSlider', 'ngRoute', 'ui.materialize', 'ngAutocomplete'])
    .controller('globalUserController', globalUserController)
    .config(routes);
