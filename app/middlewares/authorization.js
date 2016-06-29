var jwt = require('jsonwebtoken'),
    secretToken = require('../../config/secretToken.js');

exports.user = {

    hasAuthorization: function(req, res, next) {
        if (req.headers.authorization) {
            jwt.verify(req.headers.authorization, secretToken, function(err, decoded) {
                if (err) return res.sendStatus(401);
                if (decoded._doc && decoded._doc.isValidate) {
                    next();
                } else {
                    return res.sendStatus(401);
                }
            });
        } else {
            return res.sendStatus(401);
        }
    },

    isOwner: function(req, res, next) {
        if (req.headers.authorization) {
            jwt.verify(req.headers.authorization, secretToken, function(err, decoded) {
                if (err) return res.sendStatus(401);
                if (decoded._doc && ((req.params.id && decoded._doc._id == req.params.id && decoded._doc.isValidate) || decoded._doc.isAdmin)) {
                    next();
                } else {
                    return res.sendStatus(401);
                }
            });
        } else {
            return res.sendStatus(401);
        }
    },

    isAdministrator: function(req, res, next) {
        if (req.headers.authorization) {
            jwt.verify(req.headers.authorization, secretToken, function(err, decoded) {
                if (err) return res.sendStatus(401);
                if (decoded._doc && decoded._doc.isAdmin && decoded._doc.isValidate) {
                    next();
                } else {
                    return res.sendStatus(401);
                }
            });
        } else {
            return res.sendStatus(401);
        }
    }
};
