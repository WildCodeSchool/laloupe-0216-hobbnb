angular.module('app').controller('createSpotsController', function($scope, $http, $q, $window, $location, spotsFactory, spotsService) {

    if ($window.localStorage.currentUser) $scope.currentUser = JSON.parse($window.localStorage.getItem('currentUser'));
    else $scope.currentUser = {
        _id: null
    };

    $scope.hobbiesListing = ["Randonnée", "VTT", "Cyclisme", "Equitation", "Pêche", "Plongée", "Golf", "Escalade", "Canoë Kayak", "Surf", "Stand up Paddle", "Kitesurf", "Windsurf", "Ski", "Alpinisme", "Parapente", "Spéléologie", "Cannoning"];
    $scope.obj = {};
    resetObj = function() {
        $scope.obj.isActive = "1";
        $scope.obj.owner = $scope.currentUser._id;
        $scope.obj.spot = {};
        $scope.obj.rating = [];
        $scope.obj.secondarySports = [];
        $scope.obj.creation = new Date();
        $scope.obj.modification = new Date();
        $scope.obj.address = {};
        $scope.obj.address.country = 'France';
        $scope.obj.comments = [{
            creation: new Date()
        }];
    };
    resetObj();
    $scope.step = 1;
    $scope.send = function() {
        console.dir($scope.obj);
        spotsService.create({
            content: $scope.obj
        }).then(function(res) {
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
