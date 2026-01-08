// backend/index.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const csvStringify = require('csv-stringify/sync').stringify;

const app = express();
const PORT = 3000;
const ADMIN_PASSWORD = 'admin123';   // change later if you want

app.use(cors());
app.use(bodyParser.json({ limit: '10mb' }));   // needed for face-image base64

// -------------------------------------------------
// 1. CONNECT TO LOCAL MongoDB
// -------------------------------------------------
mongoose
  .connect('mongodb://127.0.0.1:27017/smartAttendance', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.error('MongoDB Error:', err));

// -------------------------------------------------
// 2. SCHEMAS & MODELS
// -------------------------------------------------
const Student = mongoose.model(
  'Student',
  new mongoose.Schema({
    regNo: { type: String, unique: true, required: true },
    email: { type: String, required: true },
    name: { type: String, required: true },
  })
);

const Attendance = mongoose.model(
  'Attendance',
  new mongoose.Schema({
    regNo: String,
    email: String,
    name: String,
    method: String,               // "face" or "qr"
    date: String,
    time: String,
    latitude: Number,
    longitude: Number,
    distance: Number,
    faceImage: String,
    timestamp: { type: Date, default: Date.now },
  })
);

const Config = mongoose.model(
  'Config',
  new mongoose.Schema({
    key: String,
    value: mongoose.Mixed,
  })
);

// -------------------------------------------------
// 3. SEED INITIAL DATA (runs only once)
// -------------------------------------------------
async function seed() {
  // ---- Students ----
  if ((await Student.countDocuments()) === 0) {
    await Student.insertMany([
      { regNo: '2024BCS026', email: '2024BCS026@sggs.ac.in', name: 'Kadam Vikas' },
      { regNo: '2024BCS030', email: '2024BCS030@sggs.ac.in', name: 'Pundkar Vivek' },
      { regNo: '2024BCS034', email: '2024BCS034@sggs.ac.in', name: 'Bhoyar Ayush' },
      { regNo: '2024BCS032', email: '2024BCS032@sggs.ac.in', name: 'Dake Sai' },
      { regNo: '2024BCS036', email: '2024BCS036@sggs.ac.in', name: 'Joshi Mayur' },
    ]);
    console.log('Students seeded');
  }

  // ---- Config (location + time window) ----
  if ((await Config.countDocuments()) === 0) {
    await Config.create([
      {
        key: 'allowedLocation',
        value: {
          latitude: 19.1118218,
          longitude: 77.2952027,
          radius: 500,                 // metres
          name: 'SGGS Institute',
        },
      },
      {
        key: 'attendanceConfig',
        value: {
          startHour: 20,
          startMinute: 0,
          endHour: 22,
          endMinute: 0,
        },
      },
    ]);
    console.log('Configs seeded');
  }
}
seed();

// -------------------------------------------------
// 4. HELPER FUNCTIONS
// -------------------------------------------------
function calcDist(lat1, lon1, lat2, lon2) {
  const R = 6371e3; // metres
  const toRad = n => (n * Math.PI) / 180;
  const φ1 = toRad(lat1),
    φ2 = toRad(lat2);
  const Δφ = toRad(lat2 - lat1),
    Δλ = toRad(lon2 - lon1);
  const a =
    Math.sin(Δφ / 2) ** 2 +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

async function getCfg(key) {
  const doc = await Config.findOne({ key });
  return doc?.value;
}

// -------------------------------------------------
// 5. API ROUTES
// -------------------------------------------------

// List all students (optional)
app.get('/api/students', async (req, res) => {
  const students = await Student.find();
  res.json(students);
});

// Verify student credentials + time window
app.post('/api/verify-student', async (req, res) => {
  const { regNo, email, name } = req.body;
  const cfg = await getCfg('attendanceConfig');

  const now = new Date();
  const mins = now.getHours() * 60 + now.getMinutes();
  const start = cfg.startHour * 60 + cfg.startMinute;
  const end = cfg.endHour * 60 + cfg.endMinute;

  if (mins < start || mins > end) {
    return res
      .status(403)
      .json({ valid: false, message: 'Attendance window closed' });
  }

  const student = await Student.findOne({ regNo: regNo.toLowerCase() });
  if (
    !student ||
    student.email.toLowerCase() !== email.toLowerCase() ||
    student.name.toLowerCase() !== name.toLowerCase()
  ) {
    return res
      .status(404)
      .json({ valid: false, message: 'Invalid credentials' });
  }

  res.json({ valid: true, student });
});

// Mark attendance (face or QR)
app.post('/api/mark-attendance', async (req, res) => {
  const { regNo, method, latitude, longitude, faceImage } = req.body;

  // ---- location check ----
  const loc = await getCfg('allowedLocation');
  const dist = calcDist(latitude, longitude, loc.latitude, loc.longitude);
  if (dist > loc.radius) {
    return res
      .status(403)
      .json({ message: `Too far: ${Math.round(dist)}m` });
  }

  // ---- one-per-day check ----
  const today = new Date().toLocaleDateString();
  if (await Attendance.findOne({ regNo, date: today })) {
    return res.status(409).json({ message: 'Already marked today' });
  }

  const student = await Student.findOne({ regNo });
  const record = new Attendance({
    regNo: student.regNo,
    email: student.email,
    name: student.name,
    method,
    date: today,
    time: new Date().toLocaleTimeString(),
    latitude,
    longitude,
    distance: Math.round(dist),
    faceImage,
  });
  await record.save();
  res.json({ success: true, record });
});

// Get attendance records (with optional date filter)
app.get('/api/attendance', async (req, res) => {
  const { date } = req.query;
  const filter = date ? { date } : {};
  const records = await Attendance.find(filter).sort({ timestamp: -1 });
  res.json(records);
});

// Export CSV
app.get('/api/attendance/export', async (req, res) => {
  const { date } = req.query;
  const filter = date ? { date } : {};
  const records = await Attendance.find(filter);
  if (!records.length)
    return res.status(404).json({ message: 'No data' });

  const csv = csvStringify([
    [
      'Reg No',
      'Email',
      'Name',
      'Method',
      'Date',
      'Time',
      'Lat',
      'Lng',
      'Dist',
      'Timestamp',
    ],
    ...records.map(r => [
      r.regNo,
      r.email,
      r.name,
      r.method,
      r.date,
      r.time,
      r.latitude,
      r.longitude,
      r.distance,
      r.timestamp,
    ]),
  ]);

  res.header('Content-Type', 'text/csv');
  res.attachment(`attendance_${date || 'all'}.csv`);
  res.send(csv);
});

// Admin login
app.post('/api/admin/login', (req, res) => {
  if (req.body.password === ADMIN_PASSWORD) {
    res.json({ success: true });
  } else {
    res.status(401).json({ success: false, message: 'Wrong password' });
  }
});

// Config (for frontend to read location / time window)
app.get('/api/config', async (req, res) => {
  res.json({
    location: await getCfg('allowedLocation'),
    attendance: await getCfg('attendanceConfig'),
  });
});

// -------------------------------------------------
// 6. START SERVER
// -------------------------------------------------
app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
});