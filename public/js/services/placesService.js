function placesService($http) {
    return {
        get : function() {
            return $http.get('/api/places');
        },
        update : function(id, data){
            return $http.put('/api/places/' + id, data);
        },
        create : function(data) {
            return $http.post('/api/places', data);
        },
        delete : function(id) {
            return $http.delete('/api/places/' + id);
        }
    };
}
