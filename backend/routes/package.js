const router = require("express").Router();

const packageController = require("../controllers/packageController");

const middlewareController = require("../controllers/middlewareController");

//update package
router.patch("/:id", middlewareController.verifyTokenAndAdmin, packageController.updatePackage);

//get all package
router.get("/all", middlewareController.verifyTokenAndAdmin, packageController.getAllPackage);

//add new package
router.post("/", middlewareController.verifyTokenAndAdmin, packageController.addPackage);

//remove package
router.delete("/:id", middlewareController.verifyTokenAndAdmin, packageController.deletePackage);

module.exports = router;
