// MAIN CONTROLLER
angular.module('app').controller('mainController', function($scope, $location, $http, searchFactory) {
    $scope.hideCtrl = false;
    $scope.toggle = function() {
        $scope.hideCtrl = !$scope.hideCtrl;
    };
    $scope.hobbiesListing = ["Randonnée", "VTT", "Cyclisme", "Equitation", "Pêche", "Plongée", "Golf", "Escalade", "Canoë Kayak", "Surf", "Stand up Paddle", "Kitesurf", "Windsurf", "Ski", "Alpinisme", "Parapente", "Spéléologie", "Cannoning"];
    $scope.search = function() {
        searchFactory.data.city = $scope.city;
        searchFactory.data.hobby = $scope.hobby;
        searchFactory.data.selectHome = $scope.selectHome;
        $location.path('/search');
    };
});
