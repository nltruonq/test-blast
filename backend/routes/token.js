const router = require("express").Router();

const tokenController = require("../controllers/tokenController");
const middlewareController = require("../controllers/middlewareController");

router.get("/", tokenController.get);

module.exports = router;
