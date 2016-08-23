angular.module('app').controller('spotController', function($window, $scope, $routeParams, spotsFactory, spotsService, searchFactory) {

    if ($window.localStorage.currentUser) {
       $scope.currentUser = JSON.parse($window.localStorage.getItem('currentUser'));
       console.log($scope.currentUser);
    }
    else $scope.currentUser = {
        _id: null
    };

    $scope.currentSpot = $routeParams.id;

    spotsService.getOne($scope.currentSpot).then(function(res) {
        console.log(res.data);
        $scope.spot = res.data;
    });

    $scope.addSpotComment = function() {
        $scope.comment.owner = $scope.currentUser._id;
        console.log($scope.comment);
        spotsService.addComment($scope.currentSpot, $scope.comment).then(function(res) {
            console.log(res);
        });
    };
});
