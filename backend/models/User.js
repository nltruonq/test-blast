const mongoose = require("mongoose");
const { Schema } = mongoose;
const { isEmail } = require("validator");
var uniqueValidator = require("mongoose-unique-validator");

const userSchema = new mongoose.Schema(
    {
        username: {
            type: String,
            default: "null",
            // required: [true, "Required"],
            // minlength: [6, "Must be at least 6 characters"],
            // maxlength: [20, "Must be less than 20 characters"],
            // unique: true,
        },
        displayName: {
            type: String,
            default: "New User",
        },
        email: {
            type: String,
            required: [true, "Required"],
            maxlength: [50, "Must be 50 characters or less"],
            unique: true,
            validate: [isEmail, "Please enter a valid email"],
        },
        isVerified: {
            type: Boolean,
            default: false,
        },
        password: {
            type: String,
            // required: [true, "Required"],
            select: false,
            // minlength: [8, "Must be 8 characters or more"],
        },
        isAdmin: {
            type: Boolean,
            default: false,
        },
        profilePicture: {
            type: String,
            default: "https://preview.redd.it/rrz3hmsxcll71.png?width=640&crop=smart&auto=webp&s=87cc5ed38d8f088ef9fffef7a4c5756b64309d6a",
        },
        packages: [],
        affiliate: [],
        recommender: {
            type: String,
        },
    },
    { timestamps: true }
);

userSchema.plugin(uniqueValidator, {
    message: "Error, expected {PATH} to be unique",
});

module.exports = mongoose.model("User", userSchema);
