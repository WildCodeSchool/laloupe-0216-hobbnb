function globalUserController($scope, $window, $rootScope) {

    $scope.currentUser = JSON.parse($window.localStorage.getItem('currentUser'));
    $rootScope.$on('userUpdated', function(event, user){
        $scope.currentUser = JSON.parse($window.localStorage.getItem('currentUser'));
    });

};
