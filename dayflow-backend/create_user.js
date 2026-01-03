const mongoose = require('mongoose');

// PASTE YOUR MONGODB LINK HERE
const MONGO_URI = "mongodb+srv://admin:password1234@dayflow.gb2enxl.mongodb.net/?appName=DayFlow";

const User = mongoose.model('User', new mongoose.Schema({
  employeeId: String,
  email: String,
  password: String,
  role: String,
  fullName: String
}));

mongoose.connect(MONGO_URI).then(async () => {
  console.log("Creating Admin User...");
  
  // Create the Admin
  await User.create({
    employeeId: "ADM001",
    email: "admin@dayflow.com",
    password: "123",  // The password needed to login
    role: "Admin",
    fullName: "System Admin"
  });

  console.log("✅ Admin Created! You can now log in.");
  process.exit();
});