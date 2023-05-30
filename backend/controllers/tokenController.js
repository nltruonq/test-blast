const Token = require("../models/Token");

const tokenController = {
    get: async (req, res) => {
        try {
            const query = req.query;
            const tokens = await Token.find({ query });
            return res.status(200).json(tokens);
        } catch (err) {
            return res.status(500).json(err.message);
        }
    },
};

module.exports = tokenController;
