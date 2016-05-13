angular.module('app')
    .service('mainService', function($http) {
    return {
        get : function() {
            return $http.get('/api');
        },
        update : function(id, data){
            return $http.put('/api/' + id, data);
        },
        create : function(data) {
            return $http.post('/api', data);
        },
        delete : function(id) {
            return $http.delete('/api/' + id);
        }
    };
});
