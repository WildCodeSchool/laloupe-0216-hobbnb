angular.module('app')
    .service('sendEmailService', function($http) {
      return {
        postMail: function(contact) {
            return $http.post('/sendEmail', contact);
        }
      };
});
