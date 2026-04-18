const mongoose = require("mongoose");

const blockedUserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  role: {
    type: String,
    enum: ["student", "teacher", "admin"]
  },
  deletedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("BlockedUser", blockedUserSchema);
