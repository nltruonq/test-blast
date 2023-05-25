const mongoose = require("mongoose");

const packageScheme = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "Required"],
            minlength: [3, "Must be at least 3 characters"],
        },
        description: {
            type: String,
        },
        time: {
            type: Number,
            // required: [true, "Required"],
            default: 30,
        },
        price: {
            type: Number,
            required: [true, "Required"],
        },
        numberSubmitRefine: {
            type: Number,
            required: [true, "Required"],
        },
        numberSubmitFeedback: {
            type: Number,
            required: [true, "Required"],
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model("Package", packageScheme);
