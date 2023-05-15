const User = require("../models/User");

const bcrypt = require("bcrypt");
const { sendMail } = require("../utils/mailer");

const userController = {
    //GET ALL USER
    getAllUser: async (req, res) => {
        try {
            const users = await User.find({}).select("-password");
            return res.status(200).json(users);
        } catch (err) {
            return res.status(500).json(err);
        }
    },

    //GET A USER
    getUser: async (req, res) => {
        try {
            const user = await User.findById(req.params.id);
            return res.status(200).json(user);
        } catch (err) {
            return res.status(500).json(err);
        }
    },

    //DELETE A USER
    deleteUser: async (req, res) => {
        if (req.body.userId === req.params.id) {
            try {
                await User.findByIdAndDelete(req.params.id);
                return res.status(200).json({ message: "User deleted" });
            } catch (err) {
                return res.status(500).json(err);
            }
        } else {
            return res.status(403).json({ message: "You can only delete your account" });
        }
    },

    //UPDATE A USER
    updateUser: async (req, res) => {
        if (req.body.password) {
            try {
                const salt = await bcrypt.genSalt(10);
                req.body.password = await bcrypt.hash(req.body.password, salt);
            } catch (err) {
                return res.status(500).json(err);
            }
        }
        try {
            const user = await User.findByIdAndUpdate(
                req.params.id.trim(),
                {
                    $set: req.body,
                },
                { returnDocument: "after" }
            ).select("+password");
            const accessToken = await authController.generateAccessToken(user);
            // if (req.body.profilePicture || req.body.theme) {
            //     try {
            //         await User.updateMany(
            //             { userId: req.params.id },
            //             {
            //                 $set: { avaUrl: req.body.profilePicture, theme: req.body.theme },
            //             }
            //         );
            //         await Comment.updateMany(
            //             { ownerId: req.params.id },
            //             {
            //                 $set: { avaUrl: req.body.profilePicture, theme: req.body.theme },
            //             }
            //         );
            //     } catch (err) {
            //         return res.status(500).json(err);
            //     }
            // }
            const returnedUser = {
                ...user._doc,
                accessToken: accessToken,
            };
            res.status(200).json(returnedUser);
        } catch (err) {
            res.status(500).json(err);
        }
    },

    //SEARCH FOR USERS
    searchAllUser: async (req, res) => {
        try {
            const username = req.query.username;
            const user = await User.find({ username: { $regex: username } })
                .limit(2)
                .select("username profilePicture")
                .exec();
            return res.status(200).json(user);
        } catch (err) {
            return res.status(500).json(err);
        }
    },

    //GET LEADER BOARDS
    // getLeaderboard: async (req, res) => {
    //     try {
    //         const users = await User.find().sort({ karmas: -1 }).limit(10);
    //         res.status(200).json(users);
    //     } catch (err) {
    //         return res.status(500).json(err);
    //     }
    // },

    //Add Package for user
    addPackage: async (req, res) => {
        try {
            //body {username, id_package}
            const { username, package } = req.body;
            const packagesUser = await User.findOne({ username: username }).select("packages recommender");
            const user = await User.findOneAndUpdate(
                { username: username },
                { $set: { packages: [...packagesUser.packages, package] } },
                { returnDocument: "after" }
            );
            if (packagesUser.recommender) {
                await User.findByIdAndUpdate(packagesUser.recommender, { $push: { affiliate: packagesUser._id } });
            }
            return res.status(200).json(user);
        } catch (err) {
            return res.status(500).json(err);
        }
    },

    //Find user has usage package 3 days left
    findUserHasUsagePackage: async (req, res) => {
        try {
            const users = await User.find({}, { packages: { $slice: -1 } });
            const list = [];
            users.forEach((e, i) => {
                let threedays = new Date(Date.now());
                threedays.setDate(threedays.getDate() + 30);
                if (e.packages.length === 1) {
                    const expiration_date = e.packages[0].expiration_date;
                    const [d, m, y] = expiration_date.split("/");
                    if (
                        threedays.getDate() === parseInt(d) &&
                        threedays.getMonth() + 1 === parseInt(m) &&
                        threedays.getFullYear() === parseInt(y)
                    ) {
                        sendMail(e.email, "BLAST", "<p>Gói bạn đang sử dụng sắp hết hạn</p>");
                        list.push(e);
                    }
                }
            });
            return res.status(200).json(list);
        } catch (err) {
            return res.status(500).json(err);
        }
    },

    //UPDATE A USER FOR ADMIN
    updateUserForAdmin: async (req, res) => {
        try {
            console.log(req.body);
            const user = await User.findOneAndUpdate(
                { _id: req.params.id },
                {
                    $set: { username: req.body.username, email: req.body.email },
                }
            );
            if (req.body.expiration_date !== "1/1/1970") {
                const packagesUser = await User.findOne({ _id: req.params.id }).select("packages -_id");
                packagesUser.packages[packagesUser.packages.length - 1].expiration_date = req.body.expiration_date;
                user = await User.findOneAndUpdate(
                    { _id: req.params.id },
                    { $set: { packages: packagesUser.packages } },
                    { returnDocument: "after" }
                );
            }
            return res.status(200).json(user);
        } catch (err) {
            res.status(500).json(err);
        }
    },
};

module.exports = userController;
