angular.module('app')
    .service('emailService', function($http) {
        return {
            send: function(name, email, msg) {
                return $http.post('/api/sendEmail', {name:name, email:email, msg:msg});
            },
            sendToAdmin: function(title, msg) {
                return $http.post('/api/sendToAdmin', {title:title,msg:msg});
            }
        };
    });
