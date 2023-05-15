const Student = require("../models/Student");

const studentController = {
    addStudent: async (req, res) => {
        try {
            const student = req.body;
            const newStudent = new Student(student);
            await newStudent.save();
            return res.status(200).json(newStudent);
        } catch (err) {
            return res.status(500).json(err.message);
        }
    },
    deleteStudent: async (req, res) => {
        try {
            const id = req.params.id;
            await Student.findByIdAndDelete(id);
            return res.status(200).json({ message: "Student deleted" });
        } catch (err) {
            return res.status(500).json(err.message);
        }
    },
    getStudentsOfUser: async (req, res) => {
        try {
            const id = req.params.id;
            const students = await Student.find({ teacher: id });
            return res.status(200).json(students);
        } catch (err) {
            return res.status(500).json(err.message);
        }
    },
};

module.exports = studentController;
