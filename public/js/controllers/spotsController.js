angular.module('app').controller('spotsController', function($scope, $http, $location, $routeParams, spotsFactory, spotsService, usersService, searchFactory) {

  $scope.currentHost = $routeParams.id;
  $scope.howManyPositive = function(t) {
      return !!t ? (~~(t.reduce(function(a,b){
          return a+b;
      }) / t.length) || 0) : 0;
  };
  spotsService.getOne($scope.currentHost).then(function(e) {

      if(!e.data.name) $location.path('/spot');

      usersService.getOne(e.data.owner).then(function(res) {
          $scope.owner = res.data;
          if ($scope.owner.rating.length <= 0) {
              $scope.owner.rating = [3];
          }
          $scope.owner.globalRating = $scope.howManyPositive($scope.owner.rating);
          $scope.owner.globalLowerRating = 5 - $scope.owner.globalRating;
          $scope.owner.numReviews = $scope.owner.rating.length;
      }, function(err) {
          $location.path('/spot');
      });




      $scope.host = e.data;
      if($scope.host.rating.quality.length <= 0) {
          $scope.host.rating.quality = [3];
      }
      if($scope.host.rating.beauty.length <= 0) {
          $scope.host.rating.beauty = [3];
      }
      if($scope.host.rating.accessibility.length <= 0) {
          $scope.host.rating.accessibility = [3];
      }
      $scope.globalRating = $scope.howManyPositive($scope.host.rating.quality.concat($scope.host.rating.beauty, $scope.host.rating.accessibility));
      $scope.globalLowerRating = 5 - $scope.globalRating;
      $scope.numReviews = ~~(($scope.host.rating.quality.length + $scope.host.rating.beauty.length + $scope.host.rating.accessibility.length) / 3);
  });
  $scope.selectTile = function() {
      console.log ($scope.host.primarySports);
      return '../assets/search/tile' + $scope.host.primarySports + '.png';
  };

});
