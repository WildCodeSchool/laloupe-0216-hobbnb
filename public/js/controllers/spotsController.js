angular.module('app').controller('spotsController', function($window, $scope, $http, $location, $routeParams, spotsFactory, spotsService, usersService, searchFactory) {

    if ($window.localStorage.currentUser) $scope.currentUser = JSON.parse($window.localStorage.getItem('currentUser'));
    else $scope.currentUser = {
        _id: null
    };

    $scope.spot = {};
    $scope.currentSpot = $routeParams.id;

    $scope.howManyPositive = function(t) {
        return !!t ? (~~(t.reduce(function(a, b) {
            return a + b;
        }) / t.length) || 0) : 0;
    };

    spotsService.getOne($scope.currentSpot).then(function(res) {

        console.log(res.data);
        $scope.host = res.data;

        $scope.host.owner = res.data.owner;
        if ($scope.host.owner.rating.length <= 0) {
            $scope.host.owner.rating = [3];
        }
        $scope.host.owner.globalRating = $scope.howManyPositive($scope.owner.rating);
        $scope.host.owner.globalLowerRating = 5 - $scope.owner.globalRating;
        $scope.host.owner.numReviews = $scope.owner.rating.length;

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

    $scope.addSpotComment = function() {
        $scope.comment.owner = $scope.currentUser._id;
        console.log($scope.comment);
        spotsService.addComment($scope.currentSpot, $scope.comment).then(function(res) {
            console.log(res);
        });
    };
});
