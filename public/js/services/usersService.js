angular.module('app')
    .service('usersService', function($http) {
    return {
        login : function(d) {
            return $http.post('/users/login', d);
        },
        get : function() {
            return $http.get('/users');
        },
        getOne : function(id) {
            return $http.get('/users/' + id);
        },
        update : function(id, d){
            return $http.put('/users/' + id, d);
        },
        create : function(d) {
            return $http.post('/users', d);
        },
        delete : function(id) {
            return $http.delete('/users/' + id);
        }
    };
});
