const User = require("../models/User");
const Token = require("../models/Token");

const changeSubmit = async (userId, type = "feedback", amount = 1, decrease = true) => {
    try {
        const user = await User.findOne({ _id: userId }).select("packages promotions");
        const now = new Date(Date.now());
        const day = now.getDate();
        const month = now.getMonth() + 1;
        const year = now.getFullYear();
        if (decrease) {
            let isChange = false;
            for (let i = 0; i < user.promotions.length; i++) {
                const [d, m, y] = user.promotions[i].expiration_date.split("/");
                if (new Date(`${y}-${m}-${d}`) < now && !(parseInt(d) === day && parseInt(m) === month && parseInt(y) === year)) {
                    continue;
                }
                if (type === "feedback") {
                    if (user.promotions[i].numberSubmitFeedback > 0) {
                        user.promotions[i].numberSubmitFeedback -= 1;
                        isChange = true;
                        break;
                    }
                } else {
                    if (user.promotions[i].numberSubmitRefine > 0) {
                        user.promotions[i].numberSubmitRefine -= 1;
                        isChange = true;
                        break;
                    }
                }
            }
            if (!isChange) {
                for (let i = 0; i < user.packages.length; i++) {
                    if (type === "feedback") {
                        if (user.packages[i].numberSubmitFeedback > 0) {
                            user.packages[i].numberSubmitFeedback -= 1;
                            isChange = true;
                            break;
                        }
                    } else {
                        if (user.packages[i].numberSubmitRefine > 0) {
                            user.packages[i].numberSubmitRefine -= 1;
                            isChange = true;
                            break;
                        }
                    }
                }
            }
            const result = await User.findByIdAndUpdate(
                userId,
                { $set: { packages: user.packages, promotions: user.promotions } },
                { returnDocument: "after" }
            );
            return result;
        }
    } catch (err) {
        return err.message;
    }
};

const checkSubmit = async (userId, type = "feedback") => {
    try {
        const packagesUser = await User.findOne({ _id: userId }).select("packages promotions");

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
        if (type === "feedback") {
            return result.numberSubmitFeedback > 0;
        } else {
            return result.numberSubmitRefine > 0;
        }
    } catch (err) {
        return err.message;
    }
};

const userUsedToken = async (userId, feature = "feedback", promptTokens, completionTokens) => {
    try {
        const now = new Date(Date.now());
        const day = now.getDate();
        const month = now.getMonth() + 1;
        const year = now.getFullYear();

        const newToken = new Token({
            userId: userId,
            feature,
            promptTokens,
            completionTokens,
            date: `${day}/${month}/${year}`,
        });

        await newToken.save();
        return newToken;
    } catch (err) {
        return err.message;
    }
};

module.exports = { changeSubmit, checkSubmit, userUsedToken };
