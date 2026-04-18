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
    enum: ["student", "teacher", "admin"],
    default: "student"
  },
  assignedStudents: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  }],
  assignedTeacher: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  }
});

module.exports = mongoose.model("User", userSchema);