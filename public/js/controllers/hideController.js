angular.module('app').controller('hideController', function($scope) {
	$scope.myVar = false;
    $scope.toggle = function() {
        $scope.myVar = !$scope.myVar;
    };
});
