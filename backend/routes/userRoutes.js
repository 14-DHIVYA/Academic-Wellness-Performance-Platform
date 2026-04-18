const express = require("express");
const router = express.Router();

const {
  getMyProfile,
  updateMyProfile,
  getTeachers
} = require("../controllers/userController");

const protect = require("../middleware/authMiddleware");

router.get("/me", protect, getMyProfile);
router.put("/me", protect, updateMyProfile);
router.get("/teachers", protect, getTeachers);

module.exports = router;