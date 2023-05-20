const router = require("express").Router();

const authController = require("../controllers/authController");

const middlewareController = require("../controllers/middlewareController");
//REGISTER
router.post("/register", authController.registerUser);
//VERIFI EMAIL
router.get("/verify", authController.verifyEmail);
//REFRESH TOKEN
router.post("/refresh", authController.requestRefreshToken);
//LOG IN
router.post("/login", authController.loginUser);
//LOGIN ADMIN
router.post("/loginadmin", authController.loginAdmin);
//LOG OUT
router.post("/logout", middlewareController.verifyToken, authController.logOut);

module.exports = router;
