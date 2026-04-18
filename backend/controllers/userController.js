// Get logged-in user's profile
const User = require("../models/User");
const getMyProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// Update logged-in user's profile
const updateMyProfile = async (req, res) => {
  try {
    const { name, department, semester, academicGoal } = req.body;

    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.name = name || user.name;
    user.department = department || user.department;
    user.semester = semester || user.semester;
    user.academicGoal = academicGoal || user.academicGoal;

    await user.save();

    res.status(200).json({
      message: "Profile updated successfully",
      user
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// Get all teachers
const getTeachers = async (req, res) => {
  try {
    const teachers = await User.find({ role: 'teacher' }).select("-password");
    res.status(200).json(teachers);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  getMyProfile,
  updateMyProfile,
  getTeachers
};