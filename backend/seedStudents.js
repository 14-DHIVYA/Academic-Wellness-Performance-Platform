const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("./models/User");

const students = Array.from({ length: 50 }).map((_, i) => ({
  name: `Student ${i + 1}`,
  email: `student${i + 1}@school.edu`,
  password: "password123", // Will be hashed in the loop
  role: "student"
}));

mongoose.connect("mongodb://localhost:27017/").then(async () => {
  console.log("Connected to MongoDB. Seeding students...");

  const existingStudents = await User.countDocuments({ role: "student", email: /student\d+@school\.edu/ });
  if (existingStudents >= 50) {
    console.log("50 students already exist in the database!");
    process.exit(0);
  }

  const hashedPassword = await bcrypt.hash("password123", 10);
  
  const studentDocs = students.map(s => ({
    ...s,
    password: hashedPassword
  }));

  try {
    for (const doc of studentDocs) {
      await User.updateOne(
        { email: doc.email },
        { $setOnInsert: doc },
        { upsert: true }
      );
    }
    console.log("Successfully seeded 50 students into the database!");
  } catch (err) {
    console.error("Error seeding students:", err);
  }

  process.exit(0);
}).catch(console.error);
