const mongoose = require("mongoose");

const loginActivitySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  role: {
    type: String,
    required: true
  },
  loginTime: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("LoginActivity", loginActivitySchema);
