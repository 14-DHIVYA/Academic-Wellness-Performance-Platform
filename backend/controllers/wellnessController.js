const Wellness = require("../models/wellness");

// CREATE wellness entry
const createWellness = async (req, res) => {
  try {
    const wellness = await Wellness.create({
      ...req.body,
      user: req.user._id   // 👈 link to logged-in user
    });

    res.status(201).json(wellness);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// GET wellness entries for logged-in user
export const getWellnessData = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;
    const skip = (page - 1) * limit;

    const totalRecords = await Wellness.countDocuments({
      user: req.user.id
    });

    const data = await Wellness.find({ user: req.user.id })
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    res.status(200).json({
      totalRecords,
      currentPage: page,
      totalPages: Math.ceil(totalRecords / limit),
      data
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createWellness,
  getWellness
};