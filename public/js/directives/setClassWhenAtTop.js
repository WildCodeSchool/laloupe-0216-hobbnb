angular.module('app')
    .directive('setClassWhenAtTop', function($window) {
        var $win = angular.element($window);
        return {
            restrict: 'A',
            link: function(scope, element, attrs) {
                var topClass = attrs.setClassWhenAtTop,
                    offsetTop = element.offset().top;
                $win.on('scroll', function(e) {
                    if ($win.scrollTop() >= offsetTop) {
                        element.addClass(topClass);
                        scope.topReached = true;
                    } else {
                        element.removeClass(topClass);
                        scope.topReached = false;
                    }
                    scope.$apply();
                });
            }
        };
    });
