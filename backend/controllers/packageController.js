const Package = require("../models/Package");

const packageController = {
    getAllPackage: async (req, res) => {
        try {
            const packages = await Package.find({});
            return res.status(200).json(packages);
        } catch (err) {
            return res.status(500).json(err.message);
        }
    },
    getPackage: async (req, res) => {
        try {
            const id = req.params.id;
            const package = await Package.find({ _id: id });
            return res.status(200).json(package);
        } catch (err) {
            return res.status(500).json(err.message);
        }
    },
    addPackage: async (req, res) => {
        const package = req.body;
        try {
            const newPackage = new Package({
                name: package.name,
                description: package.description,
                price: package.price,
                // time: package?.time || 30,
                numberSubmitFeedback: package.numberSubmitFeedback,
                numberSubmitRefine: package.numberSubmitRefine,
            });

            const savePackage = await newPackage.save();
            return res.status(200).json(savePackage);
        } catch (err) {
            return res.status(500).json(err.message);
        }
    },
    deletePackage: async (req, res) => {
        const packageId = req.params.id;
        try {
            await Package.findByIdAndDelete(packageId);
            return res.status(200).json({ message: "Package deleted" });
        } catch (err) {
            return res.status(500).json(err.message);
        }
    },
    updatePackage: async (req, res) => {
        try {
            const id = req.params.id;
            const package = await Package.findByIdAndUpdate(id, { $set: req.body }, { returnDocument: "after" });
            return res.status(200).json(package);
        } catch (err) {
            return res.status(500).json(err.message);
        }
    },
};

module.exports = packageController;
