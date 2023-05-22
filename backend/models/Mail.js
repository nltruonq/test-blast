const mongoose = require("mongoose");

const mailSchema = new mongoose.Schema(
    {
        email: {
            type: String,
            required: [true, "Required"],
        },
        content: {
            type: String,
            required: [true, "Required"],
        },
        subject: {
            type: String,
        },
        type: {
            type: String,
            default: "contact",
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model("Mail", mailSchema);
