const mongoose = require("mongoose");

const promptScheme = new mongoose.Schema(
    {
        feature: {
            type: String,
            required: [true, "Required"],
        },
        band: {
            type: String,
        },
        content: {
            type: String,
            required: [true, "Required"],
        },
        type: {
            type: String,
        },
        fullType: {
            type: String,
        },
        orderBy: {
            type: Number,
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model("Prompt", promptScheme);
