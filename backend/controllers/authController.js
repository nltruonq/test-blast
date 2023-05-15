const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { sendMail, templateVerifyEmail } = require("../utils/mailer");

const authController = {
    //REGISTER
    registerUser: async (req, res) => {
        if (req.body.password.length > 6) {
            try {
                const salt = await bcrypt.genSalt(10);
                const hashed = await bcrypt.hash(req.body.password, salt);

                //Create new user
                const newUser = new User({
                    username: req.body.username,
                    email: req.body.email,
                    password: hashed,
                    recommender: req.query.recommender || null,
                });

                //Save user to DB
                const user = await newUser.save();

                //verify email
                const hashedEmail = await bcrypt.hash(user.email, 10);
                sendMail(
                    user.email,
                    "Verify Email",
                    `${templateVerifyEmail(
                        user.username,
                        user.email,
                        `${process.env.SERVER_URL}/api/auth/verify?email=${user.email}&token=${hashedEmail}`
                    )}`
                );

                return res.status(200).json(user);
            } catch (err) {
                return res.status(500).json(err.message);
            }
        } else {
            return res.status(401).json({ message: "Must be 7 character or more" });
        }
    },

    verifyEmail: async (req, res, next) => {
        const isValid = await bcrypt.compare(req.query.email, req.query.token);
        if (isValid) {
            await User.findOneAndUpdate({ email: req.query.email, isVerified: false }, { $set: { isVerified: true } });
            return res.redirect(`${process.env.APP_URL}/login`);
        }
        return res.redirect(`${process.env.APP_URL}/404`);
    },

    generateAccessToken: (user) => {
        return jwt.sign(
            {
                id: user.id,
                isAdmin: user.isAdmin,
            },
            process.env.JWT_KEY,
            { expiresIn: "7d" }
        );
    },

    generateRefreshToken: (user) => {
        return jwt.sign(
            {
                id: user.id,
                isAdmin: user.isAdmin,
            },
            process.env.JWT_REFRESH_KEY,
            { expiresIn: "365d" }
        );
    },

    //LOGIN
    loginUser: async (req, res) => {
        try {
            const user = await User.findOne({ username: req.body.username }).select("+password");
            if (!user) {
                return res.status(404).json({ message: "Incorrect username" });
            }
            const validPassword = await bcrypt.compare(req.body.password, user.password);
            if (!validPassword) {
                return res.status(404).json({ message: "Incorrect password" });
            } else if (user && validPassword) {
                //Generate access token
                const accessToken = authController.generateAccessToken(user);
                //Generate refresh token
                const refreshToken = authController.generateRefreshToken(user);
                //STORE REFRESH TOKEN IN COOKIE
                res.cookie("refreshToken", refreshToken, {
                    httpOnly: true,
                    secure: false,
                    path: "/",
                    sameSite: "none",
                });
                const { password, ...resUser } = user._doc;
                const returnedUser = {
                    ...resUser,
                    accessToken: accessToken,
                };
                return res.status(200).json(returnedUser);
            }
        } catch (err) {
            return res.status(500).json(err);
        }
    },

    requestRefreshToken: async (req, res) => {
        //Take refresh token from user
        const refreshToken = req.cookies.refreshToken;
        //Send error if token is not valid
        if (!refreshToken) return res.status(401).json({ message: "You're not authenticated" });

        jwt.verify(refreshToken, process.env.JWT_REFRESH_KEY, (err, user) => {
            if (err) {
                console.log(err);
            }
            //create new access token, refresh token and send to user
            const newAccessToken = authController.generateAccessToken(user);
            const newRefreshToken = authController.generateRefreshToken(user);
            res.cookie("refreshToken", refreshToken, {
                httpOnly: true,
                secure: false,
                path: "/",
                // sameSite: "strict",
            });
            res.status(200).json({
                accessToken: newAccessToken,
                refreshToken: newRefreshToken,
            });
        });
    },

    //LOG OUT
    logOut: async (req, res) => {
        //Clear cookies when user logs out
        res.clearCookie("refreshToken");
        return res.status(200).json({ message: "Logged out successfully!" });
    },
};

module.exports = authController;
