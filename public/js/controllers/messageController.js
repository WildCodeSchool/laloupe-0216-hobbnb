angular.module('app').controller('messageController', function($scope, $window, $location, $routeParams, messagingService, usersService, emailService) {

    if ($window.localStorage.currentUser)
        $scope.currentUser = JSON.parse($window.localStorage.getItem('currentUser'));
    else
        $scope.currentUser = {
            _id: null
        };

    if ($routeParams.id) {

        usersService.getOne($routeParams.id).then(function(res) {

            $scope.newMsg = {
                sender: $scope.currentUser._id,
                recipient: res.data._id,
                creation: new Date(),
                message: ''
            };

            $scope.dest = res.data.email;

            $scope.receipt = res.data;

        });

    } else {

        $scope.newMsg = {
            sender: $scope.currentUser._id,
            recipient: '',
            creation: new Date(),
            message: ''
        };

    }

    $scope.sendMsg = function() {
        if ($scope.arrival) {
            $scope.newMsg.recipient = $('#recipient').val();
            $scope.newMsg.message += "\n" + 'L\'expediteur de ce message a indiqué qu\'il souhaiterait réserver cette place du ' + $scope.format($scope.arrival) + ' jusqu\'au ' + $scope.format($scope.departure) + " avec " + $scope.guests + ' personnes';
        }
        emailService.send($scope.dest, {
                msg: {
                    title: 'hobbnb - Un nouveau message de ' + $scope.currentUser.firstName + ' ' + $scope.currentUser.lastName,
                    message: $scope.newMsg.message
                }
            },
            false);
        messagingService.create($scope.newMsg).then(function(res) {
            $location.path('/messages/' + res.data._id);
        });
    };

    $scope.format = function(date) {
        return messagingService.format(date);
    };

});
