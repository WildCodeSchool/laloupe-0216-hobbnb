angular.module('app')
    .service('usersService', function($http) {
        return {
            login: function(data) {
                return $http.post('/users/login', data);
            },
            get: function() {
                return $http.get('/users');
            },
            getOne: function(id) {
                return $http.get('/users/' + id);
            },
            findHost: function(id) {
                return $http.get('/places/user/' + id);
            },
            update: function(id, data) {
                return $http.put('/users/' + id, data);
            },
            create: function(data) {
                return $http.post('/users', {obj:data});
            },
            delete: function(id) {
                return $http.delete('/users/' + id);
            }
        };
    });
