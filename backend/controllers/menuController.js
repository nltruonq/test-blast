const Menu = require("../models/Menu");

const menuController = {
    getMenu: async (req, res) => {
        try {
            const q = req.query.getby;
            if (q) {
                const menu = await Menu.findOne({ getBy: q });
                return res.status(200).json(menu[q]);
            }
            const result = {};
            const menu = await Menu.find({});
            menu.forEach((e, i) => {
                if (e.getBy === "feature") {
                    result["feature"] = e["feature"];
                }
                if (e.getBy === "band") {
                    result["band"] = e["band"];
                }
                if (e.getBy === "type") {
                    result["type"] = e["type"];
                }
                if (e.getBy === "nav") {
                    result["nav"] = e["nav"];
                }
            });
            return res.status(200).json(result);
        } catch (err) {
            return res.status(500).json(err.message);
        }
    },
    addDefault: async (req, res) => {
        try {
            const features = new Menu({
                feature: ["feedback 1", "feedback 2", "refine"],
                getBy: "feature",
            });
            await features.save();

            const band = new Menu({
                band: ["1", "2", "3", "4", "5", "6", "7", "8", "9"],
                getBy: "band",
            });
            await band.save();

            const type = new Menu({
                type: ["Task Achievement", "Coherence and Cohesion", "Lexical Resource", "Grammatical Range & Accuracy"],
                getBy: "type",
            });
            await type.save();

            const nav = new Menu({
                nav: [
                    {
                        name: "Feedback 1",
                        path: "/feedbackone",
                    },
                    {
                        name: "Feedback 2",
                        path: "/feedbacktwo",
                    },
                    {
                        name: "Refine",
                        path: "/refine",
                    },
                    {
                        name: "Contact",
                        path: "/contact",
                    },
                    {
                        name: "Payment",
                        path: "/payment",
                    },
                ],
                getBy: "nav",
            });
            await nav.save();

            return res.status(200).json({ message: "success!" });
        } catch (err) {
            return res.status(500).json(err.message);
        }
    },
};

module.exports = menuController;
