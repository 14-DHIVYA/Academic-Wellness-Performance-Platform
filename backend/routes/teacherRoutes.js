const express = require("express");
const router = express.Router();
const User = require("../models/User");
const Academic = require("../models/Academic");
const Wellness = require("../models/Wellness");

const protect = require("../middleware/authMiddleware");

// Middleware to check if user is a teacher
const verifyTeacher = async (req, res, next) => {
    if (req.user && req.user.role === "teacher") {
        next();
    } else {
        res.status(403).json({ message: "Not authorized as a teacher" });
    }
};

router.use(protect);
router.use(verifyTeacher);

// GET all students with their data
router.get("/students", async (req, res) => {
    try {
        // 1. Find all users with role "student" and assigned to this teacher
        const students = await User.find({ role: "student", assignedTeacher: req.user._id }).select("-password");

        // 2. For each student, fetch their latest academic and wellness data
        const studentData = await Promise.all(students.map(async (student) => {
            // FIX: Changed 'user' to 'userId' for Academic model
            const academic = await Academic.find({ userId: student._id });
            const wellness = await Wellness.findOne({ user: student._id }).sort({ date: -1 });

            // Calculate average marks
            const avgMarks = academic.length > 0
                ? (academic.reduce((acc, curr) => acc + curr.marks, 0) / academic.length).toFixed(1)
                : 0;

            return {
                ...student.toObject(),
                stats: {
                    avgMarks,
                    latestWellness: wellness ? {
                        sleep: wellness.sleepHours,
                        exercise: wellness.exerciseMinutes,
                        mood: wellness.mood
                    } : null
                }
            };
        }));

        res.json(studentData);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// GET single student details
router.get("/students/:studentId", async (req, res) => {
    try {
        const studentId = req.params.studentId;

        const student = await User.findOne({ _id: studentId, assignedTeacher: req.user._id }).select("-password");
        if (!student) {
            return res.status(404).json({ message: "Student not found or not assigned to you" });
        }

        // Fetch all records
        const academic = await Academic.find({ userId: studentId }).sort({ date: -1 });
        const wellness = await Wellness.find({ user: studentId }).sort({ date: -1 });

        res.json({
            student,
            academic,
            wellness
        });
    } catch (error) {
        console.error("Error fetching student details:", error);
        res.status(500).json({ error: "Server error" });
    }
});

module.exports = router;
