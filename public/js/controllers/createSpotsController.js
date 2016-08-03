angular.module('app').controller('createSpotsController', function($scope, $http, $q, $window, $rootScope, $location, $routeParams, spotsFactory, spotsService, emailService, NgMap) {

    if ($window.localStorage.currentUser) $scope.currentUser = JSON.parse($window.localStorage.getItem('currentUser'));
    else $scope.currentUser = {
        _id: null
    };
    $scope.centerMap = 'current-location';

    var marker=null;
    $scope.placeMarker = function(e) {
     $scope.myMap.panTo(e.latLng);
     if(marker==null){
         marker = new  google.maps.Marker({position: e.latLng, map: $scope.myMap});
     }else{
         marker.setPosition(e.latLng);
     }
     $scope.obj.longitude = marker.position.lng();
     $scope.obj.latitude = marker.position.lat();
    }
    $scope.reloadMap = function() {
        $scope.myMap = NgMap.initMap('myMap');
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
    if ($routeParams.id) {
        $scope.isAction = 'modification';
        spotsService.getOne($routeParams.id).then(function(res) {
            if (res.data.owner != $scope.currentUser._id || !$scope.currentUser.isAdmin) $location.path('/');
            $scope.obj = res.data;
            $scope.obj.modification = new Date();
        })
    } else {
        $scope.isAction = 'création';
    }


    $scope.send = function() {
        var act;
        if ($scope.isAction == 'création') {
            act = spotsService.create({
                content: $scope.obj
            });
        } else {
            act = spotsService.update($scope.obj._id, {
                content: $scope.obj
            });
        }
        act.then(function(res) {
            $scope.isAction == 'création' && emailService.sendToAdmin(
                'Un spot à été créé sur hobbnb',
                'Un spot a été créé sur hobbnb !' + "\n<br />" + '<a href="http://hobbnb.com/spot/' + res.data._id + '">Le consulter</a>'
            );
            $scope.obj = {};
            resetObj();
            $location.path('/picture/spots/0/' + res.data._id);
        }, function(err) {
            $scope.error = err;
        });
    };
});
