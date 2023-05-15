const mongoose = require("mongoose");

const menuSchema = new mongoose.Schema(
    {
        feature: [],
        band: [],
        type: [],
        getBy: {
            type: String,
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model("Menu", menuSchema);
