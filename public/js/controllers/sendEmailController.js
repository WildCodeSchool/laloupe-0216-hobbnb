angular.module('app').controller('sendEmailController', function($scope, $http, $routeParams, sendEmailService) {

    $scope.contact = {};
    $scope.postMail = function() {
        sendEmailService.postMail($scope.contact)
            .then(function(data) {
                // Show success message
                $scope.contact = {};
                console.log('An e-mail has been sent successfully!!!');
            }, function(data) {
                // Show error message
                console.log("Message error");
            });
    };
});
