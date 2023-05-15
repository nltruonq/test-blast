const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "Required"],
        },
        teacher: {
            type: String,
            required: [true, "Required"],
        }, 
        history: [],
    },
    { timestamps: true }
);

module.exports = mongoose.model("Student", studentSchema);
