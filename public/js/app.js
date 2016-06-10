angular.module('app', ['oc.lazyLoad', 'ngSanitize', 'ngMap', 'ngAnimate', 'ui-rangeSlider', 'ngRoute', 'ui.materialize', 'ngAutocomplete', 'angularUtils.directives.dirPagination'])
    .controller('globalUserController', globalUserController)
    .config(routes);
