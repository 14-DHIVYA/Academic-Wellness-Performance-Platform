const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  department: {
    type: String
  },
  semester: {
    type: Number
  },
  academicGoal: {
    type: String
  },
  role: {
    type: String,
    enum: ["student", "teacher"],
    default: "student"
  }
});

module.exports = mongoose.model("User", userSchema);