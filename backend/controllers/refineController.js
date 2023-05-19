const configOPENAI = require("../configs/openAI");

const Prompt = require("../models/Prompt");

const refineController = {
    CallApi: async (req, res, next) => {
        try {
            const openai = configOPENAI();
            const promptOne = process.env.PROMPT_TASK_TWO;
            const promptTwo = req.body.options + req.body.prompt;
            const response = await openai.createChatCompletion({
                model: "gpt-4",
                messages: [
                    { role: "system", content: promptOne },
                    { role: "user", content: promptTwo },
                ],
                temperature: 0,
                frequency_penalty: 0,
                presence_penalty: 1.0,
                max_tokens: 3000,
                top_p: 1,
            });
            res.status(200).json({
                message: response.data.choices[0].message.content,
            });
        } catch (error) {
            console.log(error);
            res.status(500).json("Something went wrong");
        }
    },
    CallAnalyse: async (req, res, next) => {
        try {
            const openai = configOPENAI();
            const promptOne = req.body.content;
            const promptTwo = req.body.history;
            const promptAnalyse = req.body.prompt;
            const response = await openai.createChatCompletion({
                model: "gpt-4",
                messages: [
                    { role: "system", content: promptOne },
                    { role: "system", content: promptTwo },
                    { role: "user", content: promptAnalyse },
                ],
                temperature: 0,
                frequency_penalty: 0,
                presence_penalty: 1.0,
                max_tokens: 3000,
                top_p: 1,
            });
            res.status(200).json({
                message: response.data.choices[0].message.content,
            });
        } catch (error) {
            console.log(error);
            res.status(500).json("Something went wrong");
        }
    },
    CallCompare: async (req, res, next) => {
        try {
            const openai = configOPENAI();
            const listHistory = req.body.listHistory;
            const compare = req.body.prompt;
            let prompts = [{ role: "user", content: compare }];

            listHistory.forEach((history) => {
                const item = {
                    role: "user",
                    content: history,
                };
                prompts.push(item);
            });
            console.log(prompts);
            const response = await openai.createChatCompletion({
                model: "gpt-4",
                messages: prompts,
                temperature: 0,
                frequency_penalty: 0,
                presence_penalty: 1.0,
                max_tokens: 3000,
                top_p: 1,
            });
            res.status(200).json({
                message: response.data.choices[0].message.content,
            });
        } catch (error) {
            console.log(error);
            res.status(500).json("Something went wrong");
        }
    },
    getPromptRefine: async (req, res) => {
        try {
            const prompts = await Prompt.find({ feature: "refine" });
            return res.status(200).json(prompts);
        } catch (err) {
            return res.status(500).json(err.message);
        }
    },
};

module.exports = refineController;
