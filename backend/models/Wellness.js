const mongoose = require("mongoose");

const wellnessSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    mood: {
      type: String,
      required: true
    },
    exerciseMinutes: {
      type: Number,
      required: true
    },
    sleepHours: {
      type: Number,
      required: true
    },
    date: {
      type: Date,
      default: Date.now
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Wellness", wellnessSchema);