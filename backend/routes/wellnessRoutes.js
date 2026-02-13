const { body, validationResult } = require("express-validator");
const express = require("express");
const router = express.Router();
const Wellness = require("../models/Wellness");
const authMiddleware = require("../middleware/authMiddleware");

router.post(
  "/",
  authMiddleware,
  [
    body("mood")
      .notEmpty()
      .withMessage("Mood is required")
      .isString()
      .withMessage("Mood must be a string"),

    body("exerciseMinutes")
      .notEmpty()
      .withMessage("Exercise minutes are required")
      .isNumeric()
      .withMessage("Exercise minutes must be a number")
      .custom(value => value >= 0)
      .withMessage("Exercise minutes cannot be negative"),

    body("sleepHours")
      .notEmpty()
      .withMessage("Sleep hours are required")
      .isNumeric()
      .withMessage("Sleep hours must be a number")
      .custom(value => value >= 0 && value <= 24)
      .withMessage("Sleep hours must be between 0 and 24")
  ],
  async (req, res) => {
    try {
      // ✅ validation check
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          message: "Validation failed",
          errors: errors.array()
        });
      }

      const { mood, exerciseMinutes, sleepHours } = req.body;

      const wellness = new Wellness({
        mood,
        exerciseMinutes,
        sleepHours,
        user: req.user.id
      });

      await wellness.save();

      res.status(201).json({
        message: "Wellness data added successfully",
        data: wellness
      });

    } catch (error) {
      console.error("Wellness add error:", error.message);
      res.status(500).json({ message: "Server error" });
    }
  }
);


// ✅ GET /api/wellness
router.get("/", authMiddleware, async (req, res) => {
  try {
    const wellnessData = await Wellness.find({ user: req.user.id })
      .sort({ createdAt: -1 });

    res.status(200).json({
      message: "Wellness data fetched successfully",
      count: wellnessData.length,
      data: wellnessData
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Server error while fetching wellness data"
    });
  }
});

// ✅ GET /api/wellness/recent (last 5 entries)
router.get("/recent", authMiddleware, async (req, res) => {
  try {
    const recentData = await Wellness.find({ user: req.user.id })
      .sort({ createdAt: -1 })
      .limit(5);

    res.status(200).json({
      message: "Recent wellness entries fetched successfully",
      count: recentData.length,
      data: recentData
    });
  } catch (error) {
    console.error("Recent wellness error:", error.message);
    res.status(500).json({
      message: "Server error while fetching recent wellness data"
    });
  }
});


// ✅ GET /api/wellness/summary
router.get("/summary", authMiddleware, async (req, res) => {
  try {
    // 1️⃣ Fetch all wellness entries of logged-in user
    const wellnessData = await Wellness.find({ user: req.user.id })
      .sort({ createdAt: -1 });

    // 2️⃣ If no data exists
    if (wellnessData.length === 0) {
      return res.status(200).json({
        averageExerciseMinutes: 0,
        averageSleepHours: 0,
        lastMood: null,
        totalEntries: 0
      });
    }

    // 3️⃣ Calculate totals
    let totalExerciseMinutes = 0;
    let totalSleepHours = 0;

    wellnessData.forEach(entry => {
      totalExerciseMinutes += entry.exerciseMinutes;
      totalSleepHours += entry.sleepHours;
    });

    // 4️⃣ Calculate averages
    const totalEntries = wellnessData.length;

    const averageExerciseMinutes = (
      totalExerciseMinutes / totalEntries
    ).toFixed(1);

    const averageSleepHours = (
      totalSleepHours / totalEntries
    ).toFixed(1);

    // 5️⃣ Get latest mood
    const lastMood = wellnessData[0].mood;

    // 6️⃣ Send response
    res.status(200).json({
      averageExerciseMinutes: Number(averageExerciseMinutes),
      averageSleepHours: Number(averageSleepHours),
      lastMood,
      totalEntries
    });

  } catch (error) {
    console.error("Wellness summary error:", error.message);
    res.status(500).json({ message: "Server error" });
  }
});

// ✅ PUT /api/wellness/:id  (Update wellness entry)
router.put("/:id", authMiddleware, async (req, res) => {
  try {
    const { mood, exerciseMinutes, sleepHours } = req.body;

    // 1️⃣ Find entry belonging to logged-in user
    const entry = await Wellness.findOne({
      _id: req.params.id,
      user: req.user.id
    });

    if (!entry) {
      return res.status(404).json({ message: "Entry not found" });
    }

    // 2️⃣ Update only provided fields
    if (mood !== undefined) entry.mood = mood;
    if (exerciseMinutes !== undefined) {
      if (exerciseMinutes < 0) {
        return res.status(400).json({ message: "Exercise minutes cannot be negative" });
      }
      entry.exerciseMinutes = exerciseMinutes;
    }

    if (sleepHours !== undefined) {
      if (sleepHours < 0 || sleepHours > 24) {
        return res.status(400).json({ message: "Sleep hours must be between 0 and 24" });
      }
      entry.sleepHours = sleepHours;
    }

    // 3️⃣ Save changes
    await entry.save();

    res.status(200).json({
      message: "Wellness entry updated successfully",
      data: entry
    });

  } catch (error) {
    console.error("Update error:", error.message);
    res.status(500).json({ message: "Update failed" });
  }
});

// ✅ DELETE /api/wellness/:id
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    // 1️⃣ Find entry by ID AND user (security check)
    const entry = await Wellness.findOne({
      _id: req.params.id,
      user: req.user.id
    });

    // 2️⃣ If entry not found
    if (!entry) {
      return res.status(404).json({
        message: "Wellness entry not found"
      });
    }

    // 3️⃣ Delete the entry
    await entry.deleteOne();

    // 4️⃣ Success response
    res.status(200).json({
      message: "Wellness entry deleted successfully"
    });

  } catch (error) {
    console.error("Delete error:", error.message);
    res.status(500).json({
      message: "Server error while deleting"
    });
  }
});

module.exports = router;