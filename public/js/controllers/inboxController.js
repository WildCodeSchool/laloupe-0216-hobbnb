angular.module('app').controller('inboxController', function($scope, $window, $location, messagingService) {
    if ($window.localStorage.currentUser) $scope.currentUser = JSON.parse($window.localStorage.getItem('currentUser'));
    else $scope.currentUser = {
        _id: null
    };
    messagingService.getRec($scope.currentUser._id).then(function(res) {
        $scope.msgs = res.data;
    });
    messagingService.getExp($scope.currentUser._id).then(function(res) {
        $scope.sndMsgs = res.data;
    });
    $scope.format = function(date) {
        return messagingService.format(date);
    }
});
