angular.module('app').controller('sendEmailController', function($scope, $http, $routeParams) {

    $scope.contact = {};

    $scope.postMail = function() {
        // Check form validation
        // wrap all your input values in $scope.postData

        $http.post('/sendEmail', $scope.contact)
            .then(function(data) {
                // Show success message
                $scope.contact = {};
                console.log("message sent");
            },function(data) {
                // Show error message
                console.log("message error");
            });
    };

});
