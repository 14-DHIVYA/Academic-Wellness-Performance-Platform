const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("./models/User");

mongoose.connect("mongodb://localhost:27017/").then(async () => {
  const adminExists = await User.findOne({ email: "admin@school.edu" });
  
  if (!adminExists) {
    const hashedPassword = await bcrypt.hash("admin123", 10);
    await User.create({
      name: "System Administrator",
      email: "admin@school.edu",
      password: hashedPassword,
      role: "admin"
    });
    console.log("Admin account created successfully!");
  } else {
    console.log("Admin account already exists.");
  }
  process.exit(0);
}).catch(console.error);
