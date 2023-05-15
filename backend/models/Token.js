const mongoose = require("mongoose");

const tokenSchema = new mongoose.Schema(
    {
        userId: {
            type: String,
            required: [true, "Required"],
        },
        amount: {
            type: Number,
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model("Token", tokenSchema);
