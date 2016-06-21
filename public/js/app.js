angular.module('app', ['oc.lazyLoad', 'ngSanitize', 'ngMap', 'ngAnimate', 'ui-rangeSlider', 'ngRoute', 'ui.materialize', 'ngAutocomplete', 'angularUtils.directives.dirPagination'])
    .controller('globalUserController', globalUserController)
    .config(routes)
    .run(function($rootScope) {
        $rootScope.ADMIN_EMAIL = 'contact@jbpasquier.eu';
    });
