var Users = require('../models/users.js');
var Auth = require('../middlewares/authorization.js');

module.exports = function(app) {

    app.get('/users', Auth.user.isAdministrator, Users.findAll);
    app.get('/users/loggedin', Auth.user.hasAuthorization, function(req, res) {
        res.sendStatus(200);
    });
    app.post('/users/login', Users.login);
    app.get('/users/:id', Auth.user.hasAuthorization, Users.findOne);
    app.post('/users', Users.create);
    app.put('/users/:id', Auth.user.hasAuthorization, Users.update);
    app.delete('/users/:id', Auth.user.isAdministrator, Users.delete);

};
