angular.module('app').controller('spotsController', function($scope, $http, $location, $routeParams, spotsService) {

    $scope.currentHost = $routeParams.id;
    $scope.howManyPositive = function(t) {
        return !!t ? (~~(t.reduce(function(a, b) {
            return a + b;
        }) / t.length) || 0) : 0;
    };
    spotsService.getOne($scope.currentHost).then(function(e) {
        if (!e.data.shortDescription) $location.path('/spot');
        $scope.host = e.data;
        if ($scope.host.rating.quality.length <= 0) {
            $scope.host.rating.quality = [3];
        }
        if ($scope.host.rating.beauty.length <= 0) {
            $scope.host.rating.beauty = [3];
        }
        if ($scope.host.rating.accessibility.length <= 0) {
            $scope.host.rating.accessibility = [3];
        }
        $scope.globalRating = $scope.howManyPositive($scope.host.rating.quality.concat($scope.host.rating.beauty, $scope.host.rating.accessibility));
        $scope.globalLowerRating = 5 - $scope.globalRating;
        $scope.numReviews = ~~(($scope.host.rating.quality.length + $scope.host.rating.beauty.length + $scope.host.rating.accessibility.length) / 3);
    });

});
