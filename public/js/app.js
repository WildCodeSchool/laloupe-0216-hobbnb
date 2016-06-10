angular.module('app', ['oc.lazyLoad', 'ngMap', 'ngAnimate', 'ui-rangeSlider', 'ngRoute', 'ui.materialize', 'ngAutocomplete', 'angularUtils.directives.dirPagination'])
    .controller('globalUserController', globalUserController)
    .config(routes);
