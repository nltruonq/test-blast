const mongoose = require("mongoose");

const tokenSchema = new mongoose.Schema(
    {
        userId: {
            type: String,
            required: [true, "Required"],
        },
        promptTokens: {
            type: Number,
        },
        completionTokens: {
            type: Number,
        },
        feature: {
            type: String,
        },
        date: {
            type: String,
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model("Token", tokenSchema);
