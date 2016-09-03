angular.module('app', ['oc.lazyLoad', 'ngCookies', 'ngSanitize', 'ngMap', 'ngAnimate', 'ui-rangeSlider', 'ngRoute', 'ui.materialize', 'ngAutocomplete', 'angularUtils.directives.dirPagination', 'djds4rce.angular-socialshare'])
    .controller('globalUserController', globalUserController)
    .config(routes)
    .run(function($rootScope, $location, $window, $FB) {
        if ($window.localStorage.token) {
            $rootScope.currentUser = JSON.parse($window.localStorage.getItem('currentUser'));
        }
        $rootScope.logout = function() {
            $window.localStorage.removeItem('token');
            $window.localStorage.removeItem('currentUser');
            $rootScope.currentUser = null;
        };
        // $FB.init('YOUR_APPID');
        $rootScope.ADMIN_EMAIL = 'hobbnbadmin@hobbnb.com';
    });
