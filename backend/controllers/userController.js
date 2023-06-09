const User = require("../models/User");
const Package = require("../models/Package");
const bcrypt = require("bcrypt");
const { sendMail } = require("../utils/mailer");
const Promotion = require("../models/Promotion");

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
            res.status(200).json(user);
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
            const { package, email } = req.body;
            const packagesUser = await User.findOne({ email: email }).select("packages recommender");

            let hasPackage = false;
            packagesUser.packages.forEach((e, i) => {
                if (package.packageId === e.packageId) {
                    hasPackage = true;
                }
            });
            const user = await User.findOneAndUpdate({ email: email }, { $push: { packages: package } }, { returnDocument: "after" });

            const now = new Date(Date.now());
            const purchase_date = `${now.getDate()}/${now.getMonth() + 1}/${now.getFullYear()}`;

            if (hasPackage) {
                const promotionPackage = await Promotion.findOne({ packageId: package.packageId, isAffiliate: false });
                if (promotionPackage) {
                    now.setDate(now.getDate() + promotionPackage.time);
                    const expiration_date = `${now.getDate()}/${now.getMonth() + 1}/${now.getFullYear()}`;
                    const promotionPkg = {
                        promotionId: promotionPackage._id,
                        promotionName: promotionPackage.name,
                        numberSubmitFeedback: promotionPackage.numberSubmitFeedback,
                        numberSubmitRefine: promotionPackage.numberSubmitRefine,
                        purchase_date,
                        expiration_date,
                    };
                    await User.findOneAndUpdate({ email: email }, { $push: { promotions: promotionPkg } });
                }
            }
            if (packagesUser.recommender && packagesUser.recommender !== "none") {
                const promotionPackage = await Promotion.findOne({ packageId: package.packageId, isAffiliate: true });
                if (promotionPackage) {
                    now.setDate(now.getDate() + promotionPackage.time);
                    const expiration_date = `${now.getDate()}/${now.getMonth() + 1}/${now.getFullYear()}`;
                    const promotionPkg = {
                        promotionId: promotionPackage._id,
                        promotionName: promotionPackage.name,
                        numberSubmitFeedback: promotionPackage.numberSubmitFeedback,
                        numberSubmitRefine: promotionPackage.numberSubmitRefine,
                        purchase_date,
                        expiration_date: expiration_date,
                    };
                    await User.findByIdAndUpdate(packagesUser.recommender, {
                        $addToSet: { affiliate: packagesUser._id },
                        $push: { promotions: promotionPkg },
                    });
                }
            }
            return res.status(200).json(user);
        } catch (err) {
            return res.status(500).json(err.message);
        }
    },

    addPromotion: async (req, res) => {
        try {
            const { promotion, email } = req.body;
            const user = await User.findOneAndUpdate({ email: email }, { $push: { promotions: promotion } }, { returnDocument: "after" });
            return res.status(200).json(user);
        } catch (err) {
            return res.status(500).json(err);
        }
    },

    //Find the package currently being used by a user
    findPackageCurrentlyUse: async (req, res) => {
        try {
            const id = req.params.id;
            const packagesUser = await User.findOne({ _id: id }).select("packages promotions");

            const init = {
                numberSubmitFeedback: 0,
                numberSubmitRefine: 0,
            };

            const now = new Date(Date.now());
            const day = now.getDate();
            const month = now.getMonth() + 1;
            const year = now.getFullYear();

            const sumPromotions = packagesUser.promotions.reduce((acc, cur) => {
                const [d, m, y] = cur.expiration_date.split("/");

                if (new Date(`${y}-${m}-${d}`) < now && !(parseInt(d) === day && parseInt(m) === month && parseInt(y) === year)) {
                    return {
                        numberSubmitFeedback: acc.numberSubmitFeedback,
                        numberSubmitRefine: acc.numberSubmitRefine,
                    };
                }

                return {
                    numberSubmitFeedback: acc.numberSubmitFeedback + cur.numberSubmitFeedback,
                    numberSubmitRefine: acc.numberSubmitRefine + cur.numberSubmitRefine,
                };
            }, init);
            const result = packagesUser.packages.reduce((acc, cur) => {
                return {
                    numberSubmitFeedback: acc.numberSubmitFeedback + cur.numberSubmitFeedback,
                    numberSubmitRefine: acc.numberSubmitRefine + cur.numberSubmitRefine,
                };
            }, sumPromotions);
            return res.status(200).json(result);
        } catch (err) {
            return res.status(500).json(err);
        }
    },

    //Find the package being used by a user
    findPackageHistory: async (req, res) => {
        try {
            const id = req.params.id;
            const packagesUser = await User.findOne({ _id: id }).select("packages");
            return res.status(200).json(packagesUser.packages);
        } catch (err) {
            return res.status(500).json(err);
        }
    },

    //Find the package being used by a user
    addPackageFree: async (req, res) => {
        try {
            const { userId, packageId } = req.body;
            const packagesUser = await User.findOne({ _id: userId }).select("packages");
            let hasFree = false;
            packagesUser.packages.forEach((e) => {
                if (e.packageId.toString() === packageId && e.packageName.toLowerCase() === "free") {
                    hasFree = true;
                }
            });
            if (hasFree) {
                return res.status(400).json({ message: "Free package can only be received once" });
            }
            const freePackage = await Package.findOne({ _id: packageId });
            const date = new Date(Date.now());
            const newPkg = {
                packageId: freePackage._id,
                packageName: freePackage.name,
                numberSubmitFeedback: freePackage.numberSubmitFeedback,
                numberSubmitRefine: freePackage.numberSubmitRefine,
                price: 0,
                purchase_date: `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`,
            };
            await User.findOneAndUpdate({ _id: userId }, { $push: { packages: newPkg } });
            return res.status(200).json({
                message: "Success!",
                numberSubmitFeedback: freePackage.numberSubmitFeedback,
                numberSubmitRefine: freePackage.numberSubmitRefine,
            });
        } catch (err) {
            return res.status(500).json(err.message);
        }
    },

    //Find all find all unexpired packages of user
    // findAllPackagesUnexpired: async (req, res) => {
    //     try {
    //         const id = req.params.id;
    //         const packagesUser = await User.findOne({ _id: id }).select("packages");
    //         if (packagesUser.packages.length > 0) {
    //             const now = new Date(Date.now());
    //             const day = now.getDate();
    //             const month = now.getMonth() + 1;
    //             const year = now.getFullYear();
    //             let pkgs = packagesUser.packages.filter((e, i) => {
    //                 const [d, m, y] = e.expiration_date.split("/");
    //                 if (new Date(`${y}-${m}-${d}`) > now || (parseInt(d) === day && parseInt(m) === month && parseInt(y) === year)) {
    //                     return e;
    //                 }
    //             });
    //             return res.status(200).json(pkgs);
    //         } else {
    //             return res.status(200).json([]);
    //         }
    //     } catch (err) {
    //         return res.status(500).json(err);
    //     }
    // },

    // findAllPackagesUnexpired: async (req, res) => {
    //     try {
    //         const id = req.params.id;
    //         const packagesUser = await User.findOne({ _id: id }).select("packages");
    //         if (packagesUser.packages.length > 0) {
    //             const now = new Date(Date.now());
    //             const day = now.getDate();
    //             const month = now.getMonth() + 1;
    //             const year = now.getFullYear();
    //             let pkgs = packagesUser.packages.filter((e, i) => {
    //                 const [d, m, y] = e.expiration_date.split("/");
    //                 if (new Date(`${y}-${m}-${d}`) > now || (parseInt(d) === day && parseInt(m) === month && parseInt(y) === year)) {
    //                     return e;
    //                 }
    //             });
    //             return res.status(200).json(pkgs);
    //         } else {
    //             return res.status(200).json([]);
    //         }
    //     } catch (err) {
    //         return res.status(500).json(err);
    //     }
    // },

    //Find user has usage package 3 days left
    // findUserHasUsagePackage: async (req, res) => {
    //     try {
    //         const users = await User.find({}, { packages: { $slice: -1 } });
    //         const list = [];
    //         users.forEach((e, i) => {
    //             let threedays = new Date(Date.now());
    //             threedays.setDate(threedays.getDate() + 30);
    //             if (e.packages.length === 1) {
    //                 const expiration_date = e.packages[0].expiration_date;
    //                 const [d, m, y] = expiration_date.split("/");
    //                 if (
    //                     threedays.getDate() === parseInt(d) &&
    //                     threedays.getMonth() + 1 === parseInt(m) &&
    //                     threedays.getFullYear() === parseInt(y)
    //                 ) {
    //                     sendMail(e.email, "BLAST", "<p>Gói bạn đang sử dụng sắp hết hạn</p>");
    //                     list.push(e);
    //                 }
    //             }
    //         });
    //         return res.status(200).json(list);
    //     } catch (err) {
    //         return res.status(500).json(err);
    //     }
    // },

    //UPDATE A USER FOR ADMIN
    updateUserForAdmin: async (req, res) => {
        try {
            let user = await User.findOneAndUpdate(
                { _id: req.params.id },
                {
                    $set: { username: req.body.username, email: req.body.email },
                }
            );
            // if (req.body.expiration_date !== "1/1/1970") {
            //     const packagesUser = await User.findOne({ _id: req.params.id }).select("packages -_id");
            //     packagesUser.packages[packagesUser.packages.length - 1].expiration_date = req.body.expiration_date;
            //     user = await User.findOneAndUpdate(
            //         { _id: req.params.id },
            //         { $set: { packages: packagesUser.packages } },
            //         { returnDocument: "after" }
            //     );
            // }
            return res.status(200).json(user);
        } catch (err) {
            return res.status(500).json(err.message);
        }
    },
    calculateRevenue: async (req, res) => {
        try {
            const query = req.query;
            let pkgs = await User.find({}).select("packages");
            if (query.date) {
                pkgs = pkgs.filter((e) => {
                    e.packages = e.packages.filter((p) => p.purchase_date.includes(query.date));
                    return e;
                });
            }
            pkgs = pkgs.map((pkg) => {
                pkg.packages = userController.groupBy(pkg.packages, function (e) {
                    return e.packageName;
                });
                return pkg;
            });

            for (let i = 0; i < pkgs.length; i++) {
                for (let key in pkgs[i].packages[0]) {
                    if (pkgs[i].packages[0][key].length > 1) {
                        pkgs[i].packages[0][key][0].discount = 0;
                    }
                }
            }

            let total = 0;
            for (let i = 0; i < pkgs.length; i++) {
                for (let key in pkgs[i].packages[0]) {
                    for (let j = 0; j < pkgs[i].packages[0][key].length; j++) {
                        total += (pkgs[i].packages[0][key][j].price * (100 - pkgs[i].packages[0][key][j].discount)) / 100;
                    }
                }
            }

            return res.status(200).json({ pkgs, total });
        } catch (err) {
            return res.status(500).json(err.message);
        }
    },
    groupBy: (arr, keySelector) => {
        return arr.reduce(function (groups, item) {
            const key = keySelector(item);
            if (!groups[key]) {
                groups[key] = [];
            }
            groups[key].push(item);
            return groups;
        }, {});
    },
};

module.exports = userController;
