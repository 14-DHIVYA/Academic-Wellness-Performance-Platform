const express = require("express");
const Academic = require("../models/Academic");
const protect = require("../middleware/authMiddleware");

const router = express.Router();

// ADD MARKS
router.post("/add", protect, async (req, res) => {
  try {
    const academic = new Academic({
      userId: req.user,
      subject: req.body.subject,
      marks: req.body.marks,
      semester: req.body.semester,
      date: req.body.date || Date.now()
    });

    await academic.save();
    res.json({ message: "Marks added successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET MARKS
router.get("/", protect, async (req, res) => {
  try {
    const records = await Academic.find({ userId: req.user });
    res.json(records);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;