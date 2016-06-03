module.exports = function(app) {
    'use strict';
    var nodemailer = require('nodemailer');
    var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: "fmod31@gmail.com", // your email here
            pass: "gbwpvkegzmtegpyh" // your password here
        }
    });

    app.post('/sendEmail', function(req, res) {
        console.log(req.body);
        var htmlContent = '<p>Name: ' + req.body.name + '</p>' +
            '<p>Email: ' + req.body.email + '</p>' +
            '<p>Message: <b>' + req.body.message + '</b></p>';
        var mailOptions = {
            from: 'fmod31@gmail.com', // your email here
            subject: 'New message from Hobbnb',
            to: req.body.name + ' <' + req.body.email + '>',
            sender: req.body.email,
            html: htmlContent
        };
        transporter.sendMail(mailOptions, function(err, info) {
            if (err) {
                console.log(err);
            } else {
                console.log('Message sent: ' + info.response);
                return res.json(201, info);
            }
        });
    });

};
