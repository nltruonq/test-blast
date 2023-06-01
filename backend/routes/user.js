const router = require("express").Router();

const middlewareController = require("../controllers/middlewareController");
const userController = require("../controllers/userController");

//GET ALL USER
router.get("/all", middlewareController.verifyTokenAndAdmin, userController.getAllUser);
//GET the package currently being used by a user
router.get("/currently/:id", middlewareController.verifyToken, userController.findPackageCurrentlyUse);
//GET package history of user
router.get("/history/:id", middlewareController.verifyToken, userController.findPackageHistory);
//calculate
router.get("/calculate", middlewareController.verifyTokenAndAdmin, userController.calculateRevenue);
//GET A USER
router.get("/:id", middlewareController.verifyToken, userController.getUser);

//add free package
router.post("/free", middlewareController.verifyToken, userController.addPackageFree);

// Add package to user
router.patch("/add_package", middlewareController.verifyTokenAndAdmin, userController.addPackage);
// Add promotion to user
router.patch("/add_promotion", middlewareController.verifyTokenAndAdmin, userController.addPromotion);
//UPDATE A USER
router.patch("/:id", middlewareController.verifyTokenAndUserAuthorization, userController.updateUserForAdmin);
//UPDATE PASSWORD
router.patch("/pw/:id", middlewareController.verifyTokenAndUserAuthorization, userController.updateUser);

//DELETE A USER
router.delete("/:id", middlewareController.verifyTokenAndAdmin, userController.deleteUser);

//TEST
// const {changeSubmit} = require("../utils/userUtils");
// router.patch("/submit/:id", async (req, res) => {
//     const user = await changeSubmit(req.params.id);
//     return res.status(200).json(user);
// });

module.exports = router;
