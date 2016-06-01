angular.module('app')
    .factory('usersFactory', function() {
        return {
            currentUser: {
                _id: null
            },
            datas: {}
        };
    });
