var Users = require('../models/users.js');
module.exports = function(app) {

    app.get('/users', Users.findAll);
    app.post('/users/login', Users.login);
    app.get('/users/:id', Users.findOne);
    app.post('/users', Users.create);
    app.put('/users/:id', Users.update);
    app.delete('/users/:id', Users.delete);

};
