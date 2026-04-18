const express = require("express");
const bcrypt = require("bcryptjs");
const User = require("../models/User");
const LoginActivity = require("../models/LoginActivity");
const BlockedUser = require("../models/BlockedUser");
const router = express.Router();

// REGISTER ROUTE
router.post("/register", async (req, res) => {
  try {
    // Check if email is in BlockedUser
    const blocked = await BlockedUser.findOne({ email: req.body.email });
    if (blocked) {
      return res.status(403).json({ message: "This account has been permanently blocked by the administrator." });
    }

    const hashedPassword = await bcrypt.hash(req.body.password, 10);

    const user = new User({
      name: req.body.name,
      email: req.body.email,
      password: hashedPassword,
      department: req.body.department,
      semester: req.body.semester,
      academicGoal: req.body.academicGoal,
      role: req.body.role || "student" // Default to student if not provided
    });

    await user.save();
    res.json({ message: "User registered successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const jwt = require("jsonwebtoken");

// LOGIN ROUTE
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid password" });
    }

    // Generate token
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    // Log the activity
    await LoginActivity.create({
      name: user.name,
      email: user.email,
      role: user.role
    });

    res.json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ADMIN LOGIN ROUTE
router.post("/admin-login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check user exists and is admin
    const user = await User.findOne({ email, role: "admin" });
    if (!user) {
      return res.status(403).json({ message: "Access denied. Admin privileges required." });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid password" });
    }

    // Generate token
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    // Log the activity
    await LoginActivity.create({
      name: user.name,
      email: user.email,
      role: user.role
    });

    res.json({
      message: "Admin login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;