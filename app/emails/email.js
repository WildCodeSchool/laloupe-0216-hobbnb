module.exports = function(app) {
    'use strict';
    var nodemailer = require('nodemailer'),
        userInfos = require('../../config/mail.js'),
        social = require('../../config/social.js');

    var transport = nodemailer.createTransport({
//		host: "mail.hobbnb.com",
		host: "vps630.fr.ns.planethoster.net",
		port: 465,
		secure: true,
//		debug: true,
		auth: {
			user: userInfos.user,
			pass: userInfos.pass
		}
	});
//	transport.on('log', console.log);
    var header = '<table style="width:70%; margin-left: 15%;">' +
    '<thead align="center">' +
    '<tr>' +
    '<td colspan="4"><img style="width:100%; heigth: auto;" src="https://lh6.googleusercontent.com/-JtO0NKb7Zmg/V1XN7BNJv3I/AAAAAAAAAYo/ciwbl1oK2BwF3FNpUojH2XP9OrrWt73awCL0B/w900-h100-no/blud_logo.png"/></td>' +
    '</tr>' +
    '</thead>' +
    '<tbody>' +
    '<tr>' ;

    var footer = '</tr>' +
    '<tr align="center" style="background-color:#64737c;width:100%;heigth:60px;padding-top: 5px;color:#fff;">' +
    '<td colspan="4" style="padding-top:10px;">&copy; 2016 - Hobbnb </td>' +
    '</tr>' +
    '</tbody>' +
    '</table>' +
    '<table style="width:70%; margin-left: 15%;text-align:center;">' +
    '<tr style="padding-top:5px;">' +
    '<td><a href="'+social.facebook+'"><img src="https://lh5.googleusercontent.com/-x-Hmsu_OW5Q/V1XXAqCuWrI/AAAAAAAAAZc/0VFBChKUDNk1jmcXAdQwUsG_Srlk89xPACL0B/s44-no/facebook.png"/></a></td>' +
    '<td><a href="'+social.youtube+'"><img src="https://lh4.googleusercontent.com/-JgyrqdMsgRw/V1XXAus8PdI/AAAAAAAAAZY/Wi9LtQ8alwQKj_ap6QLfyJ-zhVW9M6GgQCL0B/s50-no/ico-youtube-v.gif"/></a></td>' +
    '<td><a href="'+social.twitter+'"><img src="https://lh4.googleusercontent.com/-gspJsJCP6uw/V1XXAcXxw5I/AAAAAAAAAZU/MZ4sWbN-cPcRH0kmluTrw5LPaG51FLgKACL0B/s50-no/Twitterl1.png"/></a></td>' +
    '<td><a href="'+social.instagram+'"><img src="https://lh6.googleusercontent.com/-CgQX1L3tp7Y/V1XXA8h1qGI/AAAAAAAAAZk/eOY1JAdEYVYekmKEtBamWYYNPu-xgJ6lgCL0B/s50-no/instagram.jpg"/></a></td>' +
    '</tr>' +
    '</table>';

    var send = function(mailOptions) {
        transport.sendMail(mailOptions, function(err, info) {
	    if (err)
		console.log(err);
            transport.close();
        });
    }

    app.post('/api/sendEmail', function(req, res) {

        var htmlContent =
            header +
            '<td style="padding-top:15px;padding-left:10px;"><p>Name: <b>' + req.body.name + '</b>,</p></td>' +
            '</tr>' +
            '<tr>' +
            '<td style="padding-top:15px;padding-left:10px;"><p>Email: <b>' + req.body.email + '</b>,</p></td>' +
            '</tr>' +
            '<tr>' +
            '<td align="left" style="padding-left:10px;"><p> Message: ' + req.body.msg + '</p></td>' +
            footer;

        send({
            from: userInfos.user, // your email here
            subject: 'Formulaire de contact',
            to: req.body.email,
            sender: 'hobbnb <' + userInfos.user + '>',
            html: htmlContent
        });

        res.send(200);


    });

    app.post('/api/sendToAdmin', function(req, res) {

        var htmlContent =
            header +
            '<td align="left" style="padding-left:10px;"><p>' + req.body.msg + '</p></td>' +
            footer;

        send({
            from: userInfos.user, // your email here
            subject: req.body.title,
            to: userInfos.ADMIN_EMAIL,
            sender: 'hobbnb <' + userInfos.user + '>',
            html: htmlContent
        });
        res.send(200);
    });

};
