// FILE UPLOAD CONTROLLER
angular.module('app').controller('fileUploadController', function($scope, $http, $routeParams) {

    $scope.param = {};
    if($routeParams.step == 0) {
        $scope.width = 1900;
        $scope.height = 400;
    } else {
        $scope.width = 600;
        $scope.height = 600;
    }
    $scope.title = $routeParams.where + "/" + $routeParams.id;
});
