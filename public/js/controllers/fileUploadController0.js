// FILE UPLOAD CONTROLLER
angular.module('app').controller('fileUploadController0', function($scope, $http, fileUploadService, $routeParams) {

    $scope.param = {};
    $scope.title = "places/" + $routeParams.id;
    $scope.width = 600;
    $scope.height = 600;
});
