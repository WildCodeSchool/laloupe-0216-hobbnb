angular.module('app', ['ngRoute', 'ui.materialize', 'ngMap'])
    .config(routes)
    .controller('mainController', mainController)
    .controller('placesController', placesController)
    .controller('fileUploadController', fileUploadController)
    .controller('hideController', hideController)
    .controller('searchController', searchController)
    .service('mainService', mainService)
    .service('placesService', placesService)
    .filter('range', function() {
        return function(input, total) {
            total = parseInt(total);
            for (var i = 0; i < total; i++) {
                input.push(i);
            }
            return input;
        };
    })
    .service('fileUploadService', fileUploadService)
    .factory('placesFactory', placesFactory)
    .directive('file', function() {
        return {
            scope: {
                file: '='
            },
            link: function(scope, el, attrs) {
                el.bind('change', function(event) {
                    var files = event.target.files;
                    var file = files[0];
                    scope.file = file ? file.name : undefined;
                    scope.$apply();
                });
            }
        };
    });
