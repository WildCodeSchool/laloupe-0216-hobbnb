angular.module('app').controller('placeController', function($scope, $window, $routeParams, placesService, searchFactory) {

    if ($window.localStorage.currentUser) $scope.currentUser = JSON.parse($window.localStorage.getItem('currentUser'));
    else $scope.currentUser = {
        _id: null
    };

    $scope.currentHost = $routeParams.id;

    placesService.getOne($scope.currentHost).then(function(res) {
        console.log(res.data);
        $scope.host = res.data;
    });

    $scope.addPlaceComment = function() {
        $scope.comment.owner = $scope.currentUser._id;
        console.log($scope.comment);
        placesService.addComment($scope.currentHost, $scope.comment).then(function(res) {
            console.log(res.data);
        });
    };
});
