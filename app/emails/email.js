module.exports = function(app) {
    'use strict';
    var nodemailer = require('nodemailer');

    var transport = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: "", // your email here
            pass: "" // your password here
        }
    });

    app.post('/sendEmail', function(req, res) {

        var htmlContent =
        '<table style="width:70%; margin-left: 15%;">' +
            '<thead align="center">' +
              '<tr>' +
                '<td colspan="4"><img style="width:100%; heigth: auto;" src="https://lh6.googleusercontent.com/-JtO0NKb7Zmg/V1XN7BNJv3I/AAAAAAAAAYo/ciwbl1oK2BwF3FNpUojH2XP9OrrWt73awCL0B/w900-h100-no/blud_logo.png"/></td>'+
              '</tr>' +
            '</thead>' +
            '<tbody>'+
              '<tr>'+
                '<td style="padding-top:15px;padding-left:10px;"><p>Bienvenue <b>'+ req.body.name + '</b>,</p></td>'+
              '</tr>'+
              '<tr>'+
                '<td align="left" style="padding-left:10px;"><p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris venenatis sem et erat facilisis cursus. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Aliquam porttitor neque at nunc aliquet, a pulvinar velit pretium. Mauris mollis eros ut faucibus mattis. Aliquam sed augue tempor est fermentum bibendum in at elit</p></td>'+
              '</tr>'+
                '<tr align="center" style="background-color:#64737c;width:100%;heigth:60px;padding-top: 5px;color:#fff;">'+
                  '<td colspan="4" style="padding-top:10px;">&copy; 2016 - Hobbnb </td>'+
                '</tr>'+
            '</tbody>'+
          '</table>'+
        '<table style="width:70%; margin-left: 15%;text-align:center;">' +
            '<tr style="padding-top:5px;">'+
              '<td><a href="https://www.facebook.com/"><img src="https://lh5.googleusercontent.com/-x-Hmsu_OW5Q/V1XXAqCuWrI/AAAAAAAAAZc/0VFBChKUDNk1jmcXAdQwUsG_Srlk89xPACL0B/s44-no/facebook.png"/></a></td>'+
              '<td><a href="https://www.youtube.com/"><img src="https://lh4.googleusercontent.com/-JgyrqdMsgRw/V1XXAus8PdI/AAAAAAAAAZY/Wi9LtQ8alwQKj_ap6QLfyJ-zhVW9M6GgQCL0B/s50-no/ico-youtube-v.gif"/></a></td>'+
              '<td><a href="https://twitter.com/?lang=fr"><img src="https://lh4.googleusercontent.com/-gspJsJCP6uw/V1XXAcXxw5I/AAAAAAAAAZU/MZ4sWbN-cPcRH0kmluTrw5LPaG51FLgKACL0B/s50-no/Twitterl1.png"/></a></td>'+
              '<td><a href="https://www.instagram.com/"><img src="https://lh6.googleusercontent.com/-CgQX1L3tp7Y/V1XXA8h1qGI/AAAAAAAAAZk/eOY1JAdEYVYekmKEtBamWYYNPu-xgJ6lgCL0B/s50-no/instagram.jpg"/></a></td>'+
            '</tr>'+
          '</table>';

        var mailOptions = {
            from: '', // your email here
            subject: 'New message from Hobbnb',
            to: req.body.name + ' <' + req.body.email + '>',
            sender: req.body.email,
            html: htmlContent
        };
        transport.sendMail(mailOptions, function(err, info) {
            if (err) {
                console.log(err);
            } else {
                console.log('Message sent: ' + info.response);
                return res.json(201, info);
            }
            transporter.close();
        });
    });

};
