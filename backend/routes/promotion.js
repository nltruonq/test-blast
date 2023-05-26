const router = require("express").Router();

const promotionController = require("../controllers/promotionController");

const middlewareController = require("../controllers/middlewareController");

//update promotion
router.patch("/:id", middlewareController.verifyTokenAndAdmin, promotionController.updatePromotion);

//get all promotion
router.get("/all", promotionController.getAllPromotion);
router.get("/:id", promotionController.getPromotion);

//add new promotion
router.post("/", middlewareController.verifyTokenAndAdmin, promotionController.addPromotion);

//remove promotion
router.delete("/:id", middlewareController.verifyTokenAndAdmin, promotionController.deletePromotion);

module.exports = router;
