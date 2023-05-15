const configOPENAI = require("../configs/openAI");

const feedbackController = {
    CallApi: async (req, res, next) => {
        try {
            const openai = configOPENAI();
            const promptOne = process.env.PROMPT_TASK_ONE;
            const options = req.body.options;
            const response = await openai.createChatCompletion({
                model: "gpt-3.5-turbo",
                messages: [
                    { role: "user", content: promptOne },
                    { role: "user", content: options },
                ],
                temperature: 0.5,
                frequency_penalty: 0,
                presence_penalty: 0,
                max_tokens: 1200,
                top_p: 1,
            });
            res.status(200).json({
                message: response.data.choices[0].message.content,
            });
        } catch (error) {
            res.status(500).json("Something went wrong");
        }
    },
};

module.exports = feedbackController;
