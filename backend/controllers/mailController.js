const Mail = require("../models/Mail");

const mailer = require("../utils/mailer");

const mailController = {
    getAll: async (req, res) => {
        try {
            const mails = await Mail.find({});
            return res.status(200).json(mails);
        } catch (err) {
            return res.status(500).json(err.message);
        }
    },
    addMail: async (req, res) => {
        try {
            const mail = req.body;
            const newMail = new Mail({
                email: mail.email,
                content: mail.content,
                subject: mail?.subject || "BLAST - Feedback",
            });
            await newMail.save();
            mailer.sendMail(newMail.email, newMail.subject, mailer.templateFeedbackEmail(newMail.email, newMail.content));
            return res.status(200).json(newMail);
        } catch (err) {
            return res.status(500).json(err.message);
        }
    },
    deleteMail: async (req, res) => {
        try {
            const id = req.params.id;
            await Mail.findByIdAndDelete(id);
            return res.status(200).json({ message: "Mail deleted" });
        } catch (err) {
            return res.status(500).json(err.message);
        }
    },
    sendMailPayment: async (req, res) => {
        try {
            const mail = req.body;
            mailer.sendMail(mail.email, "BLAST - Payment", mailer.templatePayment(mail.email, mail.packageName));
            mailer.sendMail(process.env.MAIL_FROM_ADDRESS, "BLAST - Payment", mailer.templatePayment(mail.email, mail.packageName));
            return res.status(200).json({ message: "Success!" });
        } catch (err) {
            return res.status(500).json(err.message);
        }
    },
};

module.exports = mailController;
