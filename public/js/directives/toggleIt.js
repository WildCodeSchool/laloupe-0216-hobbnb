angular.module('app')
    .directive('toggleIt', function() {
        return {
            restrict: 'A',
            link: function(scope, el, attrs) {
                console.log(el.find('span'));
                el.find('i.material-icons').eq(1).on('click', function() {
                    el.find('input').toggleClass('hide show');
                    el.find('span').toggleClass('hide show');
                });
            }
        };
    });
