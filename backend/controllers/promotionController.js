const Promotion = require("../models/Promotion");

const promotionController = {
    getAllPromotion: async (req, res) => {
        try {
            const promotions = await Promotion.find({});
            return res.status(200).json(promotions);
        } catch (err) {
            return res.status(500).json(err.message);
        }
    },
    getPromotion: async (req, res) => {
        try {
            const id = req.params.id;
            const promotion = await Promotion.find({ _id: id });
            return res.status(200).json(promotion);
        } catch (err) {
            return res.status(500).json(err.message);
        }
    },
    addPromotion: async (req, res) => {
        const promotion = req.body;
        try {
            const newPromotion = new Promotion({
                name: promotion.name,
                description: promotion.description,
                time: promotion?.time || 30,
                numberSubmitFeedback: promotion.numberSubmitFeedback,
                numberSubmitRefine: promotion.numberSubmitRefine,
            });

            const savePromotion = await newPromotion.save();
            return res.status(200).json(savePromotion);
        } catch (err) {
            return res.status(500).json(err.message);
        }
    },
    deletePromotion: async (req, res) => {
        const promotionId = req.params.id;
        try {
            await Promotion.findByIdAndDelete(promotionId);
            return res.status(200).json({ message: "Promotion deleted" });
        } catch (err) {
            return res.status(500).json(err.message);
        }
    },
    updatePromotion: async (req, res) => {
        try {
            const id = req.params.id;
            const promotion = await Promotion.findByIdAndUpdate(id, { $set: req.body }, { returnDocument: "after" });
            return res.status(200).json(promotion);
        } catch (err) {
            return res.status(500).json(err.message);
        }
    },
};

module.exports = promotionController;
