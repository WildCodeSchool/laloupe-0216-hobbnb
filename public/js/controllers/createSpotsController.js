angular.module('app').controller('createSpotsController', function($scope, $http, $location, spotsFactory, spotsService) {
    $scope.hobbiesListing = ["Randonnée", "VTT", "Cyclisme", "Equitation", "Pêche", "Plongée", "Golf", "Escalade", "Canoë Kayak", "Surf", "Stand up Paddle", "Kitesurf", "Windsurf", "Ski", "Alpinisme", "Parapente", "Spéléologie", "Cannoning"];
    $scope.obj = {};
    resetObj = function() {
        $scope.obj.spot={};
        $scope.obj.rating = [];
        $scope.obj.secondarySports = [];
        $scope.obj.creation = new Date();
        $scope.obj.modification = new Date();
        $scope.obj.comments = [{
            creation: new Date()
        }];
    };
    resetObj();
    $scope.send = function() {
        console.dir($scope.obj);
        spotsService.create({content:$scope.obj}).then(function(res) {
            console.log('Spot créée');
            $scope.obj = {};
            resetObj();
            $location.path('/picture/spots/0/'+res.data._id);
        });
    };

    $scope.places = {};
    spotsService.get().then(function(res) {
        $scope.places = res.data;
    });
});
