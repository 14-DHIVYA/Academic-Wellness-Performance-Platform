const mongoose = require("mongoose");
const User = require("./models/User");

mongoose.connect("mongodb://localhost:27017/").then(async () => {
  console.log("Connected to MongoDB. Updating student emails based on their names...");

  try {
    const students = await User.find({ role: "student", email: /^student\d+@school\.edu$/ });
    
    if (students.length === 0) {
      console.log("No dummy students found with old email format.");
    } else {
      for (const student of students) {
        if (student.name) {
            // Convert "Alice Smith" -> "alice.smith@school.edu"
            const parts = student.name.toLowerCase().replace(/[^a-z ]/g, "").split(" ");
            const newEmail = `${parts.join(".")}@school.edu`;
            student.email = newEmail;
            await student.save();
        }
      }
      console.log(`Successfully updated ${students.length} student emails to match their unique names!`);
    }
  } catch (err) {
    console.error("Error updating students:", err);
  }

  process.exit(0);
}).catch(console.error);
