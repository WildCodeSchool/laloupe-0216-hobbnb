// MAIN CONTROLLER
angular.module('app').controller('mainController', function($scope, $location, $http, placesService, spotsService, searchFactory) {
    $scope.show = 'places';
    $scope.hobbiesListing = ["Randonnée", "VTT", "Cyclisme", "Equitation", "Pêche", "Plongée", "Golf", "Escalade", "Canoë Kayak", "Surf", "Stand up Paddle", "Kitesurf", "Windsurf", "Ski", "Alpinisme", "Parapente", "Spéléologie", "Cannoning"];
    $scope.selectedHobbies = [];
    $scope.toggleSelection = function toggleSelection(hobby) {
        var idx = $scope.selectedHobbies.indexOf(hobby);
        if (idx > -1) {
            $scope.selectedHobbies.splice(idx, 1);
        } else {
            $scope.selectedHobbies.push(hobby);
        }
    };
    $scope.search = function() {
        searchFactory.data.selectedHobbies = $scope.selectedHobbies;
        $location.path('/search');
    };

    $scope.searchSpot = function(activity) {
        searchFactory.data.selectedHobbies = [activity];
        $location.path('/search');
    };
    spotsService.get().then(function(res) {
        $scope.spots = res.data;
    });
    placesService.get().then(function(res) {
        $scope.places = res.data;
    });

    // dispay testimonials
    $scope.message = {};
    $http.get('/api/admin').then(function(res) {
        if (res.data.length === 0) {
            $scope.message.title1 = "En attente de témoignage";
            $scope.message.title2 = "En attente de témoignage";
            $scope.message.title3 = "En attente de témoignage";
        } else {
            $scope.message = res.data[0];
        }
    });
});
