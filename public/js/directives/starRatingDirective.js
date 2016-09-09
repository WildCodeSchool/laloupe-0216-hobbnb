angular.module('app')
    .directive('starRating', function() {
        return {
            restrict: 'EA',
            template: '<ul class="star-rating" ng-class="{readonly: readonly}">' +
                '  <li ng-repeat="star in stars" class="star" ng-class="{filled: star.filled}" ng-click="toggle($index)">' +
                '    <i class="material-icons">star</i>' + // <i class="fa fa-star"></i> or &#9733
                '  </li>' +
                '</ul>',
            scope: {
                ratingValue: '=?ngModel',
                max: '=?', // optional (default is 5)
                onRatingSelect: '&?',
                readonly: '=?'
            },
            link: function(scope, element, attributes) {
                if (scope.max === undefined) {
                    scope.max = 5;
                }

                function updateStars() {
                    scope.stars = [];
                    for (var i = 0; i < scope.max; i++) {
                        scope.stars.push({
                            filled: i < scope.ratingValue
                        });
                    }
                }
                scope.toggle = function(index) {
                    if (scope.readonly === undefined || scope.readonly === false) {
                        scope.ratingValue = index + 1;
                        scope.onRatingSelect({
                            rating: index + 1
                        });
                    }
                };
                if (scope.ratingValue || undefined) updateStars();
                scope.$watch('ratingValue', function(newValue, oldValue) {
                    if (newValue) {
                        updateStars();
                    }
                });

                if (scope.ratingValue === undefined || scope.ratingValue === 0) {
                    // scope.ratingValue = '';
                    scope.stars = [];
                    for (var i = 0; i < scope.max; i++) {
                        scope.stars.push({
                            filled: false
                        });
                    }
                }
            }
        };
    });
