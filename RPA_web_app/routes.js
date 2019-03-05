var nodeMailer = require('nodemailer');
const url = require('url');
var fs = require('fs');

module.exports = function (app) {

    app.get('/', function (req, res, next) {
        res.redirect(url.format({
            pathname: "/home",
            query: {
                "message": ''
            }
        }));
    });

    app.get('/home', function (req, res, next) {
        console.log('url : /home , loading home.html');
        console.log(req.query);
        if(req.query && req.query.message){
            res.render('home', req.query);
        }else {
            res.render('home', {message : ''});
        }
    });

    app.post('/upload', function (req, res, next) {

        var email = req.body.email;
        if (!email || email === '') {
            res.redirect(url.format({
                pathname: "/home",
                query: {
                    "message": 'Mail not sent. Email is mandatory.'
                }
            }));
        }else {
            if (!req.files)
            return res.status(400).send('No files were uploaded.');

            // The name of the input field (i.e. "sampleFile") is used to retrieve the uploaded file
            let sampleFile = req.files.fileUploaded;
            console.log(sampleFile.sendMail);

            // Use the mv() method to place the file somewhere on your server
            sampleFile.mv(__dirname + '/files/' + sampleFile.name, function (err) {
                if (err) {
                    res.redirect(url.format({
                        pathname: "/home",
                        query: {
                            "message": 'Mail not sent. Failed to Upload the File'
                        }
                    }));
                }

                let transporter = nodeMailer.createTransport({
                    host: 'smtp.gmail.com',
                    port: 465,
                    secure: true,
                    auth: {
                        user: 'prokarma.no.reply@gmail.com',
                        pass: 'Prokarma@2018'
                    }
                });
                let mailOptions = {
                    from: 'prokarma.no.reply@gmail.com', // sender address
                    to: email, // list of receivers
                    subject: 'PaySlip for the current month', // Subject line
                    text: '', // plain text body
                    html: '<b>Please find the pay slip attached to the mail. Thanks.</b>', // html body
                    attachments: [
                        {
                            path: __dirname + '/files/' + sampleFile.name
                        }
                    ]

                };

                transporter.sendMail(mailOptions, (error, info) => {
                    if (error) {
                        res.redirect(url.format({
                            pathname: "/home",
                            query: {
                                "message": 'Failed to send the Mail'
                            }
                        }));
                    }
                    console.log('Message %s sent: %s', info.messageId, info.response);
                    console.log('Deleting the File : '+sampleFile.name);

                    fs.unlink(__dirname + '/files/' + sampleFile.name, function (error) {
                        if (error) {
                            console.log('Failed to Delete File : '+sampleFile.name);
                            res.redirect(url.format({
                                pathname: "/home",
                                query: {
                                    "message": 'Mail sent but the Failed to delete the file from server'
                                }
                            }));
                        }
                        res.redirect(url.format({
                            pathname: "/home",
                            query: {
                                "message": 'Mail sent Successfully'
                            }
                        }));
                    });

                });
            });
        }
        
    });

};
