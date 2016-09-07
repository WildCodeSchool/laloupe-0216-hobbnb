function navBarController($scope, $window, $rootScope, searchFactory) {
    $scope.currentUser = $rootScope.currentUser;
    $scope.$watch(function() {
        return $scope.details;
    }, function() {
        if ($scope.details) {
            searchFactory.data.center = {
                latitude: $scope.details.geometry.location.lat(),
                longitude: $scope.details.geometry.location.lng()
            };
            $rootScope.$emit('city', searchFactory.data.center);
        }
    });
}
