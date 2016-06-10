angular.module('app').controller('messagingController', function($scope, $window, $location, $routeParams, messagingService, usersService) {

    if ($window.localStorage.currentUser)
        $scope.currentUser = JSON.parse($window.localStorage.getItem('currentUser'));
    else
        $scope.currentUser = {
            _id: null
        };

    messagingService.getOne($routeParams.id).then(function(res) {
        $scope.msg = res.data;

        $scope.newMsg = {
            sender: res.data.recipient,
            recipient: res.data.sender,
            creation: new Date(),
            message: ''
        };

        usersService.getOne($scope.msg.recipient).then(function(res) {
            $scope.msg.recipient = res.data.identity.firstName + ' ' + res.data.identity.lastName
        });
        usersService.getOne($scope.msg.sender).then(function(res) {
            $scope.msg.sender = res.data.identity.firstName + ' ' + res.data.identity.lastName
        });

    });

    $scope.sendMsg = function() {
        messagingService.create($scope.newMsg).then(function(res) {
            $location.path('/messages/' + res.data._id);
        });
    };

    $scope.format = function(date) {
        return messagingService.format(date);
    };

    $scope.nl2br = function(str) {
    return (str + '').replace(/([^>\r\n]?)(\r\n|\n\r|\r|\n)/g, '$1<br />$2');
}

});
