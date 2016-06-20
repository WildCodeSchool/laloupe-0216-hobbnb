angular.module('app').controller('emailController', function($scope, $http, $routeParams, emailService) {

    $scope.contact = {};
    $scope.send = function() {
        emailService.send($scope.contact.name, $scope.contact.email, $scope.contact.message)
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
