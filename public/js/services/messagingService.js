angular.module('app')
    .service('messagingService', function($http) {
        return {
            get: function() {
                return $http.get('/api/msg');
            },
            getOne: function(id) {
                return $http.get('/api/msg/' + id);
            },
            getExp: function(id) {
                return $http.get('/api/msg/exp/' + id);
            },
            getRec: function(id) {
                return $http.get('/api/msg/rec/' + id);
            },
            create: function(data) {
                return $http.post('/api/msg', {
                    obj: data
                });
            },
            delete: function(id) {
                return $http.delete('/api/msg/' + id);
            },
            format: function(date) {
                return new Date(date).toLocaleString();
            }
        };
    });
