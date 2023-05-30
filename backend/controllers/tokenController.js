const Token = require("../models/Token");

const tokenController = {
    get: async (req, res) => {
        try {
            const query = req.query;
            const tokens = await Token.find({});
            return res.status(200).json(tokens);
        } catch (err) {
            return res.status(500).json(err.message);
        }
    },
    calculate: async (req, res) => {
        try {
            const query = req.query;
            const tokens = await Token.find({ query });

            const init = {};

            const result = tokens.reduce((acc, cur) => {
                if (cur.promptTokens && cur.completionTokens) {
                    return acc;
                }
            }, 0);
        } catch (err) {
            return res.status(500).json(err.message);
        }
    },
};

module.exports = tokenController;
