angular.module('app').controller('emailController', function($scope, $http, $routeParams, emailService) {

    $scope.contact = {};
    $scope.send = function() {
        emailService.send($scope.contact.email, {message:'message', title:'titre'}, false)
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
