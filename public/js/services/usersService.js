angular.module('app')
    .service('usersService', function($http) {
        return {
            login: function(data) {
                return $http.post('/api/users/login', data);
            },
            get: function() {
                return $http.get('/api/users');
            },
            getOne: function(id) {
                return $http.get('/api/users/' + id);
            },
            findHost: function(id) {
                return $http.get('/api/places/user/' + id);
            },
            findSpot: function(id) {
                return $http.get('/api/spots/user/' + id);
            },
            findMsg: function(id) {
                return $http.get('/api/msg/rec/' + id);
            },
            findMsgExp: function(id) {
                return $http.get('/api/msg/exp/' + id);
            },
            update: function(id, data) {
                return $http.put('/api/users/' + id, {
                    obj: data
                });
            },
            create: function(data) {
                return $http.post('/api/users', {
                    obj: data
                });
            },
            delete: function(id) {
                return $http.delete('/api/users/' + id);
            }
        };
    });
