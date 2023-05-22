const router = require("express").Router();

const middlewareController = require("../controllers/middlewareController");
const userController = require("../controllers/userController");

//GET ALL USER
router.get("/all", middlewareController.verifyTokenAndAdmin, userController.getAllUser);
//GET USERS HAVE USAGE PACKAGE 3 DAYS LEFT
router.get("/3days", middlewareController.verifyTokenAndAdmin, userController.findUserHasUsagePackage);
//GET the package currently being used by a user
router.get("/currently/:id", middlewareController.verifyToken, userController.findPackageCurrentlyUse);
//GET the package currently being used by a user
router.get("/unexpired/:id", middlewareController.verifyToken, userController.findAllPackagesUnexpired);
//GET A USER
router.get("/:id", middlewareController.verifyToken, userController.getUser);

// Add package to user
router.patch("/add_package", middlewareController.verifyTokenAndAdmin, userController.addPackage);
//UPDATE A USER
router.patch("/:id", middlewareController.verifyTokenAndUserAuthorization, userController.updateUserForAdmin);
//UPDATE PASSWORD
router.patch("/pw/:id", middlewareController.verifyTokenAndUserAuthorization, userController.updateUser);

//DELETE A USER
router.delete("/:id", middlewareController.verifyTokenAndAdmin, userController.deleteUser);

module.exports = router;
