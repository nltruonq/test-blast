const configOPENAI = require("../configs/openAI");
const Prompt = require("../models/Prompt");
const changeSubmit = require("../utils/changeSubmit");

const feedbackController = {
    CallApi: async (req, res, next) => {
        try {
            const openai = configOPENAI();
            const promptOne = process.env.PROMPT_TASK_ONE;
            const options = req.body.options;
            const response = await openai.createChatCompletion({
                model: "gpt-3.5-turbo",
                messages: [
                    { role: "system", content: promptOne },
                    { role: "user", content: options },
                ],
                temperature: 0.5,
                frequency_penalty: 0,
                presence_penalty: 0,
                max_tokens: 1200,
                top_p: 1,
            });
            await changeSubmit(req.params.id);
            res.status(200).json({
                message: response.data.choices[0].message.content,
            });
        } catch (error) {
            res.status(500).json("Something went wrong");
        }
    },
    getPromptFeedback: async (req, res) => {
        try {
            const q = req.query;
            const prompts = await Prompt.find(q);
            return res.status(200).json(prompts);
        } catch (err) {
            return res.status(500).json(err.message);
        }
    },
};

module.exports = feedbackController;
