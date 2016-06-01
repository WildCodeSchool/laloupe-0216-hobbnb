function globalUserController($scope, usersFactory, $cookies) {
    if($cookies.get('token')) {
        //TODO - Get user infos from token and put in on service
    }
    $scope.currentUser = usersFactory.currentUser;
};
