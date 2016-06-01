angular.module('app')
    .service('spotsService', function($http) {
    return {
        get: function() {
            return $http.get('/spots');
        },
        getOne: function(id) {
            return $http.get('/spots/' + id);
        },
        update: function(id, data) {
            return $http.put('/spots/' + id, data);
        },
        create: function(data) {
            return $http.post('/spots', data);
        },
        delete: function(id) {
            return $http.delete('/spots/' + id);
        }
    };
});
