angular.module('app')
    .service('messagingService', function($http) {
    return {
        get: function() {
            return $http.get('/msg');
        },
        getOne: function(id) {
            return $http.get('/msg/' + id);
        },
        getExp: function(id) {
            return $http.get('/msg/exp/' + id);
        },
        getRec: function(id) {
            return $http.get('/msg/rec/' + id);
        },
        create: function(data) {
            return $http.post('/msg', data);
        },
        delete: function(id) {
            return $http.delete('/msg/' + id);
        }
    };
});
