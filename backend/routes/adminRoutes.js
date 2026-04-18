const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const User = require("../models/User");
const LoginActivity = require("../models/LoginActivity");
const BlockedUser = require("../models/BlockedUser");
const protect = require("../middleware/authMiddleware");

// Middleware to check admin role
const adminOnly = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    next();
  } else {
    res.status(403).json({ message: "Not authorized as an admin" });
  }
};

// Apply protect and adminOnly to all routes in this file
router.use(protect);
router.use(adminOnly);

// GET /api/admin/teachers - Get all teachers
router.get("/teachers", async (req, res) => {
  try {
    const teachers = await User.find({ role: "teacher" }).select("-password");
    res.json(teachers);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST /api/admin/teachers - Add a new teacher
router.post("/teachers", async (req, res) => {
  try {
    const { name, email, password } = req.body;
    
    // Check if email is in BlockedUser
    const blocked = await BlockedUser.findOne({ email });
    if (blocked) {
      return res.status(403).json({ message: "This email has been permanently blocked." });
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "Teacher already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const teacher = await User.create({
      name,
      email,
      password: hashedPassword,
      role: "teacher"
    });

    res.status(201).json({
      _id: teacher._id,
      name: teacher.name,
      email: teacher.email,
      role: teacher.role,
      assignedStudents: teacher.assignedStudents
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// DELETE /api/admin/teachers/:id - Delete a teacher (Moves to BlockedUser)
router.delete("/teachers/:id", async (req, res) => {
  try {
    const teacher = await User.findById(req.params.id);
    if (!teacher || teacher.role !== "teacher") {
      return res.status(404).json({ message: "Teacher not found" });
    }

    // Add to BlockedUsers
    await BlockedUser.create({
      name: teacher.name,
      email: teacher.email,
      role: teacher.role
    });

    await User.findByIdAndDelete(req.params.id);
    // Optional: remove this teacher from assignedTeacher in students
    await User.updateMany({ assignedTeacher: req.params.id }, { $unset: { assignedTeacher: "" } });

    res.json({ message: "Teacher deleted and permanently blocked" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/admin/students - Get all students
router.get("/students", async (req, res) => {
  try {
    const students = await User.find({ role: "student" }).select("-password").populate("assignedTeacher", "name email");
    res.json(students);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST /api/admin/students - Add a new student
router.post("/students", async (req, res) => {
  try {
    const { name, email, password } = req.body;
    
    // Check if email is in BlockedUser
    const blocked = await BlockedUser.findOne({ email });
    if (blocked) {
      return res.status(403).json({ message: "This email has been permanently blocked." });
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "Student already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const student = await User.create({
      name,
      email,
      password: hashedPassword,
      role: "student"
    });

    res.status(201).json({
      _id: student._id,
      name: student.name,
      email: student.email,
      role: student.role,
      assignedTeacher: student.assignedTeacher
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// DELETE /api/admin/students/:id - Delete a student (Moves to BlockedUser)
router.delete("/students/:id", async (req, res) => {
  try {
    const student = await User.findById(req.params.id);
    if (!student || student.role !== "student") {
      return res.status(404).json({ message: "Student not found" });
    }

    // Add to BlockedUsers
    await BlockedUser.create({
      name: student.name,
      email: student.email,
      role: student.role
    });

    await User.findByIdAndDelete(req.params.id);
    
    // Optional: pull from teacher's assignedStudents
    if (student.assignedTeacher) {
      await User.findByIdAndUpdate(student.assignedTeacher, {
        $pull: { assignedStudents: req.params.id }
      });
    }

    res.json({ message: "Student deleted and permanently blocked" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST /api/admin/assign - Assign students to a teacher
router.post("/assign", async (req, res) => {
  try {
    const { teacherId, studentIds } = req.body;
    
    const teacher = await User.findById(teacherId);
    if (!teacher || teacher.role !== "teacher") {
      return res.status(404).json({ message: "Teacher not found" });
    }

    // Assign teacher to students
    await User.updateMany(
      { _id: { $in: studentIds }, role: "student" },
      { $set: { assignedTeacher: teacherId } }
    );

    // Update teacher's assignedStudents array
    const addedStudents = await User.find({ _id: { $in: studentIds }, role: "student" }).select("_id");
    const addedStudentIds = addedStudents.map(s => s._id);

    await User.findByIdAndUpdate(teacherId, {
      $addToSet: { assignedStudents: { $each: addedStudentIds } }
    });

    res.json({ message: "Students assigned successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/admin/login-activity - Get all login activity
router.get("/login-activity", async (req, res) => {
  try {
    const activities = await LoginActivity.find().sort({ loginTime: -1 });
    res.json(activities);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/admin/blocked-users - Get all blocked users
router.get("/blocked-users", async (req, res) => {
  try {
    const blocked = await BlockedUser.find().sort({ deletedAt: -1 });
    res.json(blocked);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
