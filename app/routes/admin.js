var Admin = require('../models/admin.js'),
    Auth = require('../middlewares/authorization.js');

module.exports = function(app) {
    app.get('/admin', Admin.findAll);
    app.post('/admin', Auth.user.isAdministrator, Admin.create);
    app.put('/admin/:id', Auth.user.isAdministrator, Admin.update);
};
