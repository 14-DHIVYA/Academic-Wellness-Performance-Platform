const mongoose = require("mongoose");
const User = require("./models/User");

const uniqueNames = [
  "Alice Smith", "Bob Johnson", "Charlie Williams", "David Brown", "Eva Jones",
  "Frank Garcia", "Grace Miller", "Henry Davis", "Ivy Rodriguez", "Jack Martinez",
  "Karen Hernandez", "Leo Lopez", "Mia Gonzalez", "Noah Wilson", "Olivia Anderson",
  "Peter Thomas", "Quinn Taylor", "Rachel Moore", "Samuel Jackson", "Tina Martin",
  "Ulysses Lee", "Victoria Perez", "William Thompson", "Xena White", "Yosef Harris",
  "Zoe Sanchez", "Aiden Clark", "Bella Ramirez", "Carter Lewis", "Diana Robinson",
  "Ethan Walker", "Fiona Young", "George Allen", "Hannah King", "Isaac Wright",
  "Julia Scott", "Kevin Torres", "Lily Nguyen", "Mason Hill", "Nora Flores",
  "Oscar Green", "Penelope Adams", "Quincy Nelson", "Riley Baker", "Sophia Hall",
  "Tyler Rivera", "Uma Campbell", "Victor Mitchell", "Wendy Carter", "Xavier Roberts"
];

mongoose.connect("mongodb://localhost:27017/").then(async () => {
  console.log("Connected to MongoDB. Updating student names...");

  try {
    const students = await User.find({ role: "student", email: /student\d+@school\.edu/ }).sort({ email: 1 });
    
    if (students.length === 0) {
      console.log("No dummy students found to update.");
    } else {
      for (let i = 0; i < students.length; i++) {
        if (i < uniqueNames.length) {
          students[i].name = uniqueNames[i];
          await students[i].save();
        }
      }
      console.log(`Successfully updated ${students.length} students with unique names!`);
    }
  } catch (err) {
    console.error("Error updating students:", err);
  }

  process.exit(0);
}).catch(console.error);
