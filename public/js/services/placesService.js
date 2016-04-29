function placesService($http) {
    return {
        get: function() {
            return $http.get('/places');
        },
        getOne: function(id) {
            return $http.get('/places/' + id);
        },
        update: function(id, data) {
            return $http.put('/places/' + id, data);
        },
        create: function(data) {
            return $http.post('/places', data);
        },
        delete: function(id) {
            return $http.delete('/places/' + id);
        }
    };
}
