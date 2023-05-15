const router = require("express").Router();

const middlewareController = require("../controllers/middlewareController");
const promptController = require("../controllers/promptController");

//Get prompt
router.get("/", middlewareController.verifyTokenAndAdmin, promptController.getAllPrompt);

//add prompt
router.post("/", middlewareController.verifyTokenAndAdmin, promptController.addPrompt);

//delete prompt
router.delete("/:id", middlewareController.verifyTokenAndAdmin, promptController.deletePrompt);

//uodate prompt
router.patch("/:id", middlewareController.verifyTokenAndAdmin, promptController.updatePrompt);

//add all prompt default
router.post('/default', middlewareController.verifyTokenAndAdmin, promptController.addAllPrompt);

module.exports = router;
