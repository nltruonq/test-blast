const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { getAuth } = require("firebase-admin/auth");
const { sendMail, templateVerifyEmail } = require("../utils/mailer");

const authController = {
    //REGISTER
    registerUser: async (req, res) => {
        try {
            // const salt = await bcrypt.genSalt(10);
            // const hashed = await bcrypt.hash(req.body.password, salt);

            //Create new user
            const newUser = new User({
                email: req.body.email,
                recommender: req.query.recommender || null,
            });

            //Save user to DB
            const user = await newUser.save();

            //verify email
            // const hashedEmail = await bcrypt.hash(user.email, 10);
            // sendMail(
            //     user.email,
            //     "Verify Email",
            //     `${templateVerifyEmail(
            //         user.username,
            //         user.email,
            //         `${process.env.SERVER_URL}/api/auth/verify?email=${user.email}&token=${hashedEmail}`
            //     )}`
            // );

            return res.status(200).json(user);
        } catch (err) {
            return res.status(500).json(err.message);
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
                id: user._id,
                isAdmin: user.isAdmin,
            },
            process.env.JWT_KEY,
            { expiresIn: "7d" }
        );
    },

    generateRefreshToken: (user) => {
        return jwt.sign(
            {
                id: user._id,
                isAdmin: user.isAdmin,
            },
            process.env.JWT_REFRESH_KEY,
            { expiresIn: "365d" }
        );
    },

    //LOGIN
    loginUser: async (req, res) => {
        try {
            const { idToken, email } = req.body;
            if (!idToken || !email) {
                return res.status(401).json({ message: "You are not authenticated" });
            }
            getAuth()
                .verifyIdToken(idToken)
                .then(async (decodedToken) => {
                    if (decodedToken.email !== email) {
                        return res.status(401).json({ message: "You are not authenticated!" });
                    }
                    const user = await User.findOne({ email: req.body.email });
                    if (!user) {
                        const newUser = new User({
                            email: req.body.email,
                            displayName: decodedToken.name,
                            profilePicture: decodedToken.picture,
                            recommender: req.query.recommender || null,
                        });

                        //Save user to DB
                        const user = await newUser.save();
                    }
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
                })
                .catch((err) => {
                    return res.status(500).json(err.message);
                });
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
