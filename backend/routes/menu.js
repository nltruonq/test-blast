const router = require("express").Router();

const menuController = require("../controllers/menuController");
const middlewareController = require("../controllers/middlewareController");

//get menu
router.get("/", middlewareController.verifyToken, menuController.getMenu);

//add default
router.post('/default', middlewareController.verifyTokenAndAdmin, menuController.addDefault);

module.exports = router;
