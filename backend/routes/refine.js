const router = require("express").Router();

const refineController = require("../controllers/refineController");

router.post("/CallAPI/:id", refineController.CallApi);
router.post("/CallAnalyse/:id", refineController.CallAnalyse);
router.post("/CallCompare/:id", refineController.CallCompare);

router.get("/getOptions", refineController.getPromptRefine);

module.exports = router;
