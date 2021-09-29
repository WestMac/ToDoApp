const nodemailer = require('nodemailer');

module.exports.sendEmail = async (email, subject, text) => {
    try {
        const transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 465,
            secure: true,
            auth: {
                user: process.env.MAIL_USERNAME,
                pass: process.env.MAIL_PASS
            }
        })
        await transporter.sendMail({
            from: 'ToDoApp',
            to: email,
            subject: subject,
            text:text,
        })
        console.log("Email has been sent")
    } catch (err) {
        console.log(err, "Email has NOT been sent")
    }
};

