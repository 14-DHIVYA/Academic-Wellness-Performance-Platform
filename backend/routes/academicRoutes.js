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

// GET AVERAGE AND HIGHEST MARKS OF ALL STUDENTS
router.get("/average", protect, async (req, res) => {
  try {
    const records = await Academic.find({});
    if (records.length === 0) {
      return res.json({ averageMarks: 0, highestMarks: 0 });
    }
    
    // Calculate global average
    const totalMarks = records.reduce((sum, record) => sum + record.marks, 0);
    const averageMarks = totalMarks / records.length;

    // Calculate highest average marks among all students
    const studentAverages = {};
    records.forEach(record => {
      const uId = record.userId.toString();
      if (!studentAverages[uId]) {
        studentAverages[uId] = { sum: 0, count: 0 };
      }
      studentAverages[uId].sum += record.marks;
      studentAverages[uId].count += 1;
    });

    let highestMarks = 0;
    let highestScorerId = null;
    Object.keys(studentAverages).forEach(uId => {
      const avg = studentAverages[uId].sum / studentAverages[uId].count;
      if (avg > highestMarks) {
        highestMarks = avg;
        highestScorerId = uId;
      }
    });

    const isHighestScorer = highestScorerId === req.user.toString();

    res.json({ averageMarks, highestMarks, isHighestScorer });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// DELETE MARKS
router.delete("/:id", protect, async (req, res) => {
  try {
    const record = await Academic.findOne({ _id: req.params.id, userId: req.user });
    if (!record) {
      return res.status(404).json({ message: "Record not found" });
    }
    await record.deleteOne();
    res.json({ message: "Record deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;