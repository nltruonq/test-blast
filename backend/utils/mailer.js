const mailer = require("nodemailer");

const sendMail = (to, subject, htmlContent) => {
    const transport = mailer.createTransport({
        // host: process.env.MAIL_HOST,
        // port: process.env.MAIL_PORT,
        // secure: false,
        service: "gmail",
        auth: {
            user: process.env.MAIL_USERNAME,
            pass: process.env.MAIL_PASSWORD,
        },
    });

    const options = {
        from: process.env.MAIL_FROM_ADDRESS,
        to: to,
        subject: subject,
        html: htmlContent,
    };

    return transport.sendMail(options);
};

const templateVerifyEmail = (
    username,
    email,
    href
) => `<div style="font-family:'Open Sans','Roboto','Helvetica Neue',Helvetica,Arial,sans-serif;font-size:16px;color:#2c3e50;line-height:150%;letter-spacing:normal">
<div style="background:#f9f9f9;padding:20px 10px">
<div style="max-width:600px;margin:auto;padding:15px 30px 25px 30px;background-color:#ffffff;border-radius:3px;border-bottom:1px solid #dadada;border-top:1px solid #eaeaea">
<div style="margin:5px 0 30px"><span style="color:#2c3e50;font-size:22px;margin-left:8px">BLAST</span></a></div>
<p>Hi ${username},</p>
<p>Thank you for signing up on BLAST! We're excited to have you on board and will be happy to help you set everything up.</p>
<p>Please click the link below to verify your email address: <a href="${href}" target="_blank">${email}</a></p>
<a style="font-weight:500;display:inline-block;padding:10px 35px;margin:8px 0;text-decoration:none;border-radius:3px;background-color:#4460aa;color:#ffffff" href="${href}" rel="noopener" target="_blank">Verify email</a>`;

module.exports = { sendMail, templateVerifyEmail };
