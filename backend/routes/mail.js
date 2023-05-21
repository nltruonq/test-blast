const router = require("express").Router();

const mailController = require("../controllers/mailController");

const middlewareController = require("../controllers/middlewareController");

router.get("/", middlewareController.verifyTokenAndAdmin, mailController.getAll);

router.post("/", middlewareController.verifyToken, mailController.addMail);

router.post("/payment", middlewareController.verifyToken, mailController.sendMailPayment);

router.delete("/:id", middlewareController.verifyTokenAndAdmin, mailController.deleteMail);

module.exports = router;
