angular.module('app')
    .directive('setClassWhenAtTop', function($window) {
        var $win = angular.element($window);
        return {
            restrict: 'A',
            link: function(scope, element, attrs) {
                var topClass = attrs.setClassWhenAtTop,
                    offsetTop = element.offset().top,
                    bottomElementOffset = angular.element(document.querySelector('#location'));
                console.log(offsetTop);
                console.log(bottomElementOffset);
                $win.on('scroll', function(e) {
                    if ($win.scrollTop() >= offsetTop) {
                        element.addClass(topClass);
                        scope.topReached = true;
                    } else {
                      console.log(document.body.scrollTop);
                      console.log(element[0].offsetHeight + offsetTop);
                      console.log(element[0].scrollHeight);
                        element.removeClass(topClass);
                        scope.topReached = false;
                        scope.$apply();
                    }
                    scope.$apply();
                });
            }
        };
    });
