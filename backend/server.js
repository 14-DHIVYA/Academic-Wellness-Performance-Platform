const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();
const connectDB = require("./config/db");
const { errorHandler } = require("./middleware/errorMiddleware");
const healthRoutes = require("./routes/healthRoutes");


const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use("/api/users", require("./routes/userRoutes"));

// Connect Database
connectDB();

// ROUTES
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/academic", require("./routes/academicRoutes"));
app.use("/api/wellness", require("./routes/wellnessRoutes"));
app.use("/api/teacher", require("./routes/teacherRoutes"));
app.use("/api/health", healthRoutes);

// Test route
app.get("/", (req, res) => {
  res.send("Backend is running successfully 🚀");
});
// Centralized error handler (must be last middleware)
app.use(errorHandler);

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});