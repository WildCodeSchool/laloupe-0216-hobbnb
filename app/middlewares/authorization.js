var jwt = require('jsonwebtoken'),
    secretToken = require('../../config/secretToken.js');

exports.user = {

    hasAuthorization: function(req, res, next) {
        if (req.headers.authorization) {
            jwt.verify(req.headers.authorization, secretToken, function(err, decoded) {
                if (err) {
                    return res.sendStatus(403);
                } else
                    next();
            });
        } else {
            return res.sendStatus(403);
        }
    },

    isOwner: function(req, res, next) {
        if (req.headers.authorization) {
            jwt.verify(req.headers.authorization, secretToken, function(err, decoded) {
                if (decoded._doc && req.params.id && decoded._doc._id == req.params.id ||  !err)
                    next();
                else
                    return res.sendStatus(403);
            });
        } else {
            return res.sendStatus(403);
        }
    },

    isAdministrator: function(req, res, next) {
        if (req.headers.authorization) {
            jwt.verify(req.headers.authorization, secretToken, function(err, decoded) {
                if (decoded._doc && decoded._doc.isAdmin ||  !err)
                    next();
                else
                    return res.sendStatus(403);
            });
        } else {
            return res.sendStatus(401);
        }
    }
};
