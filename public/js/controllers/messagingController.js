angular.module('app').controller('messagingController', function($scope, $window, $location, $routeParams, messagingService, usersService, emailService) {

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
            message: '',
        };

        usersService.getOne($scope.msg.recipient).then(function(res) {
            $scope.msg.recipient = res.data.identity.firstName + ' ' + res.data.identity.lastName
            $scope.dest = res.data.email;
        });
        usersService.getOne($scope.msg.sender).then(function(res) {
            $scope.msg.sender = res.data.identity.firstName + ' ' + res.data.identity.lastName
        });

    });

    $scope.sendMsg = function() {
        messagingService.create($scope.newMsg).then(function(res) {
            emailService.send($scope.dest, {
                    msg: {
                        title: 'hobbnb - Un nouveau message de ' + $scope.currentUser.firstName + ' ' + $scope.currentUser.lastName,
                        message: $scope.newMsg.message
                    }
                },
                false);
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
