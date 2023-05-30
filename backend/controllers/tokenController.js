const Token = require("../models/Token");

const tokenController = {
    add: async (req, res) => {
        try {
            const { userId, feature, promptTokens, completionTokens } = req.body;
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
            return res.status(200).json(newToken);
        } catch (err) {
            return res.status(500).json(err.message);
        }
    },
    get: async (req, res) => {
        try {
            const query = req.query;
            if (query === {}) {
                const tokens = await Token.find({});
                const result = tokenController.calculate(tokens);
                return res.status(200).json(result);
            }
            if (query.date) {
                const tokens = await Token.find({});
                const result = tokens.filter((e) => {
                    if (e.date.includes(query.date)) {
                        return e;
                    }
                });
                const rs = tokenController.calculate(result);
                return res.status(200).json(rs);
            }
            const tokens = await Token.find(query);
            const result = tokenController.calculate(tokens);
            return res.status(200).json(result);
        } catch (err) {
            return res.status(500).json(err.message);
        }
    },
    calculate: (tokens) => {
        try {
            const { PRICE_FEEDBACK, PRICE_REFINE_PROMPT, PRICE_REFINE_COMPLETION } = process.env;
            const numberTokens = {
                feedback: {
                    promptTokens: 0,
                    completionTokens: 0,
                },
                refine: {
                    promptTokens: 0,
                    completionTokens: 0,
                },
            };
            const result = tokens.reduce((acc, cur) => {
                if (cur.feature === "feedback") {
                    return {
                        ...acc,
                        feedback: {
                            promptTokens: acc.feedback.promptTokens + cur.promptTokens,
                            completionTokens: acc.feedback.completionTokens + cur.completionTokens,
                        },
                    };
                }
                return {
                    ...acc,
                    refine: {
                        promptTokens: acc.refine.promptTokens + cur.promptTokens,
                        completionTokens: acc.refine.completionTokens + cur.completionTokens,
                    },
                };
            }, numberTokens);
            const price =
                (parseFloat(PRICE_FEEDBACK) / 1000) * (result.feedback.promptTokens + result.feedback.completionTokens) +
                (parseFloat(PRICE_REFINE_PROMPT) / 1000) * result.refine.promptTokens +
                (parseFloat(PRICE_REFINE_COMPLETION) / 1000) * result.refine.completionTokens;
            return {
                amount: result,
                price,
            };
        } catch (err) {
            return 0;
        }
    },
};

module.exports = tokenController;
