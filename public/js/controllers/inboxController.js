angular.module('app').controller('inboxController', function($scope, $window, $location, messagingService) {
    if ($window.localStorage.currentUser) $scope.currentUser = JSON.parse($window.localStorage.getItem('currentUser'));
    else $scope.currentUser = {
        _id: null
    };
    messagingService.getRec($currentUser._id).then(function(res) {
        $scope.msgs = res.data;
    });
    messagingService.getExp($currentUser._id).then(function(res) {
        $scope.sndMsgs = res.data;
    });
    $scope.sendMsg = function() {
        messagingService.create($scope.newMsg).then(function(res) {
            $location.path('/messages/' + res._id);
        });
    }
});
