angular.module('app')
    .service('spotsService', function($http) {
        return {
            get: function() {
                return $http.get('/api/spots');
            },
            getOne: function(id) {
                return $http.get('/api/spots/' + id);
            },
            addComment: function(id, comment) {
                return $http.put('/api/spots/addComment/' + id, comment);
            },
            update: function(id, data) {
                return $http.put('/api/spots/' + id, data);
            },
            updatePictures: function(id, data) {
                return $http.put('/api/spots/updatePictures/' + id, data);
            },
            create: function(data) {
                return $http.post('/api/spots', data);
            },
            delete: function(id) {
                return $http.delete('/api/spots/' + id);
            }
        };
    });
