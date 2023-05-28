const User = require("../models/User");

const changeSubmit = async (userId, type = "feedback", amount = 1, decrease = true) => {
    try {
        const user = await User.findOne({ _id: userId }).select("packages promotions");
        const now = new Date(Date.now());

        if (decrease) {
            let isChange = false;
            for (let i = 0; i < user.promotions.length; i++) {
                const [d, m, y] = user.promotions[i].expiration_date.split("/");
                if (new Date(`${y}-${m}-${d}`) < now) {
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

module.exports = changeSubmit;
