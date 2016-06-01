angular.module('app')
    .service('usersService', function($http) {
    return {
        get : function() {
            return $http.get('/users');
        },
        getOne : function(id) {
            return $http.get('/users/' + id);
        },
        update : function(id, data){
            return $http.put('/users/' + id, data);
        },
        create : function(data) {
            return $http.post('/users', data);
        },
        delete : function(id) {
            return $http.delete('/users/' + id);
        }
    };
});
