const router = require("express").Router();

const packageController = require("../controllers/packageController");

const middlewareController = require("../controllers/middlewareController");

//get all package
router.get('/all', middlewareController.verifyTokenAndAdmin, packageController.getAllPackage);

//add new package
router.post("/", middlewareController.verifyTokenAndAdmin, packageController.addPackage);

//remove package
router.delete("/:id", middlewareController.verifyTokenAndAdmin, packageController.deletePackage);

module.exports = router;
