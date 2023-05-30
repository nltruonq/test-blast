const router = require("express").Router();

const tokenController = require("../controllers/tokenController");
const middlewareController = require("../controllers/middlewareController");

router.get("/", tokenController.get);
// router.post("/", tokenController.add);
// router.get("/calculate", tokenController.calculate);

module.exports = router;
