const router = require("express").Router();

const middlewareController = require("../controllers/middlewareController");
const userController = require("../controllers/userController");

//GET ALL USER
router.get('/all', middlewareController.verifyTokenAndAdmin, userController.getAllUser);

//GET USERS HAVE USAGE PACKAGE 3 DAYS LEFT
router.get('/3days', middlewareController.verifyTokenAndAdmin, userController.findUserHasUsagePackage);

// Add package to user
router.patch('/add_package', middlewareController.verifyTokenAndAdmin, userController.addPackage);

//DELETE A USER
router.delete("/:id", middlewareController.verifyTokenAndAdmin, userController.deleteUser);

//GET A USER
router.get("/:id", middlewareController.verifyToken, userController.getUser);

//UPDATE A USER
router.patch("/:id", middlewareController.verifyTokenAndUserAuthorization, userController.updateUserForAdmin);

module.exports = router;
