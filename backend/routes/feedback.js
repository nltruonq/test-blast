const router = require("express").Router();

const feedbackController = require("../controllers/feedbackController");

router.post("/CallApi/:id", feedbackController.CallApi);

router.get("/", feedbackController.getPromptFeedback);

module.exports = router;
