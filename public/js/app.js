angular.module('app', ['oc.lazyLoad', 'ngMap', 'ui-rangeSlider', 'ngRoute', 'ui.materialize', 'ngAutocomplete'])
    .controller('globalUserController', globalUserController)
    .config(routes);
