angular.module('app').controller('sendEmailController', function($scope, $http, $routeParams, sendEmailService) {

    $scope.contact = {};
    $scope.postMail = function() {
        sendEmailService.postMail($scope.contact)
            .then(function(data) {
                // Show success message
                $scope.contact = {};
                console.log('Message sent');
            }, function(data) {
                // Show error message
                console.log("Message error");
            });
    };
});
