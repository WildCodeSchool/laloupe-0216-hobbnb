// MAIN CONTROLLER
angular.module('app').controller('mainController', function($scope, $location, $http, placesService, spotsService, searchFactory) {
    $scope.hideCtrl = false;
    $scope.toggle = function() {
        $scope.hideCtrl = !$scope.hideCtrl;
    };
    $scope.hobbiesListing = ["Randonnée", "VTT", "Cyclisme", "Equitation", "Pêche", "Plongée", "Golf", "Escalade", "Canoë Kayak", "Surf", "Stand up Paddle", "Kitesurf", "Windsurf", "Ski", "Alpinisme", "Parapente", "Spéléologie", "Cannoning"];
    $scope.search = function() {
        searchFactory.data.city = $scope.city;
        searchFactory.data.hobby = $scope.hobby;
        if($scope.selectHome=="Spot"){
            $location.path('/searchSpot');
        }else{
            $location.path('/search');
        }
    };
    $scope.searchSpot = function(activity) {
        searchFactory.data.hobby = activity;
        $('.tooltipped').tooltip('remove');
        $location.path('/search');
    };
    spotsService.get().then(function(res) {
        $scope.pSpots = res.data;
    });
    placesService.get().then(function(res) {
        $scope.pPlaces = res.data;
    });
    $scope.hobbyIco = function(widget) {
        return "../assets/hobbies/" + widget.primarySports + ".png";
    };
    $scope.pictPlace = function(widget) {
        var url = "uploads/places/" + widget._id + "/" + widget.picture;
        return "{'background-image': 'url(" + url + ")', 'background-size': 'cover'}";
    };
    $scope.pictSpot = function(widget) {
        var url = "uploads/spots/" + widget._id + "/" + widget.picture;
        return "{'background-image': 'url(" + url + ")', 'background-size': 'cover'}";
    };
// dispay testimonials
    $scope.message = {};
    $http.get('/api/admin').then(function(res) {
        if (res.data.length == 0) {
            $scope.message.title1="En attente de témoignage";
            $scope.message.title2="En attente de témoignage";
            $scope.message.title3="En attente de témoignage";
        } else {
            $scope.message = res.data[0];
        }
    });
});
