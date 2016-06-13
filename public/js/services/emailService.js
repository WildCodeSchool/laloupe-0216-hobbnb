angular.module('app')
    .service('emailService', function($http) {
        return {
            send: function(dest, msg, copyToAdmin) {
                return $http.post('/sendEmail', {dest:dest, msg:msg, copyToAdmin:copyToAdmin});
            }
        };
    });
