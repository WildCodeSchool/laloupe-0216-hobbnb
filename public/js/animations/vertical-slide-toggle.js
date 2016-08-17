angular.module('app')
    .animation('.vertical-slide-toggle', ['$animateCss', function($animateCss) {
        return {
            addClass: function(element, className, doneFn) {
                if (className == 'ng-hide') {
                    var height = element[0].offsetHeight;
                    var animator = $animateCss(element, {
                        from: {
                            height: height + 'px'
                        },
                        to: {
                            height: '0px'
                        }
                    });
                    if (animator) {
                        return animator.start().finally(function() {
                            element[0].style.height = '';
                            doneFn();
                        });
                    }
                }
                doneFn();
            },
            removeClass: function(element, className, doneFn) {
                if (className == 'ng-hide') {
                    var height = element[0].offsetHeight;
                    var animator = $animateCss(element, {
                        from: {
                            height: '0px'
                        },
                        to: {
                            height: height + 'px'
                        }
                    });
                    if (animator) {
                        return animator.start().finally(doneFn);
                    }
                }
                doneFn();
            }
        };
    }]);
