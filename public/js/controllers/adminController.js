angular.module('app').controller('adminController', function($scope, $http) {
    var creation = false;
    $scope.message = {};
    $http.get('/admin').then(function(res) {
        if (res.data.length == 0) {
            creation = true;
        } else {
            $scope.message = res.data[0];
        }
    });
    $scope.send = function() {
        if (creation == true) {
            $http.post('/admin', {
                content: {
                    comment1: $scope.message.comment1,
                    comment2: $scope.message.comment2,
                    comment3: $scope.message.comment3,
                    photo1: $scope.message.photo1,
                    photo2: $scope.message.photo2,
                    photo3: $scope.message.photo3,
                    title1: $scope.message.title1,
                    title2: $scope.message.title2,
                    title3: $scope.message.title3
                }
            })
        } else {
            console.dir($scope.message);
            $http.put('/admin/' + $scope.message._id, {
                content: {
                    comment1: $scope.message.comment1,
                    comment2: $scope.message.comment2,
                    comment3: $scope.message.comment3,
                    photo1: $scope.message.photo1,
                    photo2: $scope.message.photo2,
                    photo3: $scope.message.photo3,
                    title1: $scope.message.title1,
                    title2: $scope.message.title2,
                    title3: $scope.message.title3
                }
            })
        }
    };
});
