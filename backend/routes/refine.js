const router = require("express").Router();

const refineController = require("../controllers/refineController");

router.post("/CallAPI", refineController.CallApi);
router.post("/CallAnalyse", refineController.CallAnalyse);
router.post("/CallCompare", refineController.CallCompare);

module.exports = router;
