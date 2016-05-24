angular.module('app').controller('createPlacesController', function($scope, $http, placesFactory, placesService) {
    $scope.obj = {};
    resetObj = function() {
        $scope.obj.isActive = "1";
        $scope.obj.address = {};
        $scope.obj.address.country = 'France';
        $scope.obj.address.postalCode = 28240;
        $scope.obj.address.state = 'Somewhere over the rainbow';
        $scope.obj.name = "Une jolie maizon";
        $scope.obj.shortDescription = 'Gût gût';
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
        placesService.create({content:$scope.obj}).then(function() {
            console.log('Place créée');
            $scope.obj = {};
            resetObj();
        });
    };

    $scope.places = {};
    placesService.get().then(function(res) {
        $scope.places = res.data;
    });
});
