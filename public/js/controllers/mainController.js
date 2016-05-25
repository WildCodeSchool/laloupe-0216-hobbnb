// MAIN CONTROLLER
angular.module('app').controller('mainController', function($scope, $location, $http, mainService, searchFactory) {
    $scope.hobbiesListing = ["Randonnée", "VTT", "Cyclisme", "Equitation", "Pêche", "Plongée", "Golf", "Escalade", "Canoë Kayak", "Surf", "Stand up Paddle", "Kitesurf", "Windsurf", "Ski", "Alpinisme", "Parapente", "Spéléologie", "Cannoning"];
    $scope.search = function() {
      searchFactory.data.city = $scope.city;
      searchFactory.data.hobby = $scope.hobby;
      $location.path('/search');
    };
});
