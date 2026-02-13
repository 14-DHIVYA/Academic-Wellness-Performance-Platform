const express = require("express");
const router = express.Router();
const User = require("../models/User");
const Academic = require("../models/Academic");
const Wellness = require("../models/Wellness");

// Middleware to check if user is a teacher
const verifyTeacher = async (req, res, next) => {
    // Assuming req.user is populated by auth middleware (which we need to make sure is used)
    // For now, we'll need to import the auth middleware or ensure it's applied in server.js
    // Let's assume we'll use a middleware that decodes the token and adds user to req

    // TODO: Import auth middleware here or in server.js
    next();
};

// GET all students with their data
router.get("/students", async (req, res) => {
    try {
        // 1. Find all users with role "student"
        const students = await User.find({ role: "student" }).select("-password");

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

        const student = await User.findById(studentId).select("-password");
        if (!student) {
            return res.status(404).json({ message: "Student not found" });
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
