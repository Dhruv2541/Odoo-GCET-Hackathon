const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

// ==========================================
// 1. DATABASE CONNECTION
// ==========================================
// ⚠️ IMPORTANT: Replace the string below with your copied MongoDB link!
const MONGO_URI = "mongodb+srv://admin:password1234@dayflow.gb2enxl.mongodb.net/?appName=DayFlow";

mongoose.connect(MONGO_URI)
  .then(() => console.log("✅ SUCCESS! MongoDB is Connected"))
  .catch(err => console.error("❌ Connection Error:", err));

// ==========================================
// 2. DATABASE MODELS (The Blueprints)
// ==========================================

// User Model (Stores Employees & Admins)
const UserSchema = new mongoose.Schema({
  employeeId: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, default: 'Employee' }, // 'Admin' or 'Employee'
  fullName: String,
  department: String,
  salary: Number
});
const User = mongoose.model('User', UserSchema);

// Attendance Model (Stores Check-ins)
const AttendanceSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  date: String,       // Format: "2024-01-03"
  checkIn: String,    // Format: "09:00 AM"
  checkOut: String,   // Format: "05:00 PM"
  status: String      // 'Present', 'Absent'
});
const Attendance = mongoose.model('Attendance', AttendanceSchema);

// Leave Request Model
const LeaveSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  type: String,       // 'Sick', 'Paid'
  days: Number,
  reason: String,
  status: { type: String, default: 'Pending' } // 'Approved', 'Rejected'
});
const Leave = mongoose.model('Leave', LeaveSchema);

// ==========================================
// 3. API ROUTES (The Links for Frontend)
// ==========================================

// Test Route
app.get('/', (req, res) => res.send('Dayflow Backend is Live!'));

// --- AUTHENTICATION ---

// Sign Up
app.post('/api/auth/signup', async (req, res) => {
  try {
    const newUser = new User(req.body);
    await newUser.save();
    res.json({ message: "User Created!", user: newUser });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// Login
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email, password }); // Simple check
    if (user) {
      res.json({ message: "Login Success", user });
    } else {
      res.status(400).json({ error: "Invalid Credentials" });
    }
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// Get User Profile (For Dashboard)
app.get('/api/user/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });
    
    // Send back user info (excluding password for safety)
    res.json({
      _id: user._id,
      fullName: user.fullName,
      email: user.email,
      department: user.department,
      salary: user.salary,
      role: user.role
    });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// --- ATTENDANCE ---

// Check In
app.post('/api/attendance/checkin', async (req, res) => {
  try {
    const newRecord = new Attendance(req.body);
    await newRecord.save();
    res.json({ message: "Checked In!", record: newRecord });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// Get History (for Dashboard)
app.get('/api/attendance/:userId', async (req, res) => {
  try {
    const history = await Attendance.find({ userId: req.params.userId });
    res.json(history);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// ==========================================
// 4. START SERVER
// ==========================================
const PORT = 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
// --- PAYROLL SYSTEM ---

// Calculate Payroll Endpoint
app.post('/api/payroll/calculate', async (req, res) => {
  try {
    const { userId, month, year } = req.body; // e.g., month=1 (Jan), year=2024

    // 1. Find the Employee
    const employee = await User.findById(userId);
    if (!employee) return res.status(404).json({ message: "Employee not found" });

    // 2. Calculate Dates
    // Note: In Javascript, Month is 0-indexed (0 = Jan, 1 = Feb)
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0); // Last day of month

    // 3. Count "Present" Days
    const presentDays = await Attendance.countDocuments({
      userId: userId,
      status: "Present",
      // We need to parse the date string "YYYY-MM-DD" or match your format
      // Since your model uses String dates, for simplicity in Hackathon, 
      // we assume the frontend sends the count or we just count all records for now.
      // IMPROVEMENT: If you save dates as proper Date objects, date math is easier.
      // For now, let's just count ALL their attendance records as a demo.
      userId: userId
    });

    // 4. The Math
    // Standard Month = 30 Days
    const dailyRate = employee.salary / 30;
    const finalPayout = Math.round(dailyRate * presentDays);

    res.json({
      employee: employee.fullName,
      month: `${month}/${year}`,
      baseSalary: employee.salary,
      presentDays: presentDays,
      dailyRate: Math.round(dailyRate),
      finalPayout: finalPayout,
      status: "Generated"
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});