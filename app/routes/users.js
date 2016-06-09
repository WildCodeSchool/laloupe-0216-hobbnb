var express = require('express'),
    usersRouter = express.Router(),
    Users = require('../models/users.js'),
    Auth = require('../middlewares/authorization.js');

module.exports = function(app) {

    usersRouter.get('/', Auth.user.hasAuthorization, Auth.user.isAdministrator, Users.findAll);

    usersRouter.get('/loggedin', Auth.user.hasAuthorization, function(req, res) {
        res.sendStatus(200);
    });

    usersRouter.post('/login', Users.login);

    usersRouter.get('/:id', Auth.user.hasAuthorization, Users.findOne);

    usersRouter.post('/', Users.create);

    usersRouter.put('/:id', Auth.user.hasAuthorization, Users.update);

    usersRouter.delete('/:id', Auth.user.hasAuthorization, Auth.user.isAdministrator, Users.delete);

    app.use('/users', usersRouter);
};
