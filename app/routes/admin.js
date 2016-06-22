var express = require('express'),
    adminRouter = express.Router(),
    Admin = require('../models/admin.js'),
    Auth = require('../middlewares/authorization.js');

module.exports = function(app) {

    adminRouter.get('/', Admin.findAll);
    adminRouter.post('/', Auth.user.isAdministrator, Admin.create);
    adminRouter.put('/:id', Auth.user.isAdministrator, Admin.update);

    app.use('/admin', adminRouter);
};
