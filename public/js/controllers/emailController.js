angular.module('app').controller('emailController', function($scope, $http, $routeParams, emailService) {

    $scope.contact = {};
    $scope.send = function() {
        emailService.send($scope.contact.name, $scope.contact.email, $scope.contact.message)
            .then(function(data) {
                // Show success message
                $scope.contact = {};
            }, function(data) {
                // Show error message
            });
    };
});
