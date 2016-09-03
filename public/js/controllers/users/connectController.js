angular.module('app').controller('connectController', function($scope, $rootScope, $location, $window, usersService, emailService) {

  $scope.login = function() {
      usersService.login({
          email: $scope.email,
          password: $scope.password
      }).then(function(res) {
          $window.localStorage.setItem('currentUser', JSON.stringify(res.data.user));
          $window.localStorage.token = res.data.token;
          $rootScope.currentUser = res.data.user;
          $location.path('/user/' + res.data.user._id);
      }, function(err) {
          $scope.error = err.data;
      });
  };

  $scope.create = function() {
      if ($scope.hobbinaut.password === $scope.hobbinaut.passwordConfirm) {
          console.log($scope.hobbinaut);
          usersService.create($scope.hobbinaut).then(function(res) {
              // emailService.send(res.data.user.identity.firstName, res.data.user.email, 'Bonjour ' + res.data.user.identity.firstName + ',<br />Vous avez créé un compte sur hobbnb, pour l\'activer cliquez sur le lien suivant : <a href="https://hobbnb.innoveduc.fr/api/users/activate/' + res.data.user._id + '">Activer mon compte</a>');
              $scope.message = 'Votre compte a été créé, consultez votre boîte mail pour l\'activer ! ;-)';
          }, function(err) {
              $scope.error = err.data;
          });
      } else {
          $scope.error = 'Mots de passes différents';
      }
  };

  // $scope.save = function() {
  //     if ($scope.user.password === $scope.passwordConfirm) {
  //         usersService.update($scope.user._id, $scope.user).then(function(res) {
  //             $window.localStorage.setItem('currentUser', JSON.stringify(res.data.user));
  //             $window.localStorage.token = res.data.token;
  //             $rootScope.user = res.data.user;
  //             $location.path('/user/' + res.data.user._id);
  //         }, function(res) {
  //             $scope.error = res.data;
  //         });
  //     } else {
  //         $scope.error = 'Mots de passes différents';
  //     }
  // };

});
