const router = require("express").Router();

const middlewareController = require("../controllers/middlewareController");
const studentController = require("../controllers/studentController");

//get all students of user
router.get('/:id', middlewareController.verifyToken, studentController.getStudentsOfUser);

//add new student
router.post("/", middlewareController.verifyToken, studentController.addStudent);

//delete student
router.delete('/:id', middlewareController.verifyToken, studentController.deleteStudent);

module.exports = router;
