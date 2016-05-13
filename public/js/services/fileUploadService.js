angular.module('app')
    .service('fileUploadService', function($http) {
    return {
        get : function() {
            return $http.get('/picture');
        },
        update : function(id, data){
            return $http.put('/picture/' + id, data);
        },
        create : function(data) {
            return $http.post('/picture', data);
        },
        delete : function(id) {
            return $http.delete('/picture/' + id);
        }
    };
});
