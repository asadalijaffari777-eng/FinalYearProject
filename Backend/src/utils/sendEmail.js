const nodemailer = require('nodemailer');

async function sendEmail(to, subject, htmlContent){
    try{
        const transport = nodemailer.createTransport(
            {
                service: 'gmail',
                auth:{
                    user: process.env.EMAIL_USER,
                    pass: process.env.EMAIL_PASS
                }
            }
        );

        await transport.sendMail(
            {
                from: process.env.EMAIL_USER,
                to,
                subject,
                html: htmlContent
            }
        );
        console.log('Email is sent')
    }catch(err){
        console.log('Email send error: ', err)
    }
}

module.exports = sendEmail