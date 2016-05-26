// FILE UPLOAD CONTROLLER
angular.module('app').controller('fileUploadController', function($scope, $http, fileUploadService, $routeParams) {

    $scope.param = {};
    $scope.title = "places/" + $routeParams.id;
    $scope.width = 1900;
    $scope.height = 400;
});
