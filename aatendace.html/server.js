const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = 3000;

// For demo purposes, store attendance in memory
let attendance = {
  face: [],
  qr: []
};

app.use(bodyParser.json({ limit: '10mb' })); // To handle base64 images


// Face attendance endpoint
app.post('/api/auth/face', (req, res) => {
  const { studentId, faceData } = req.body;
  if (!studentId || !faceData) {
    return res.status(400).json({ error: 'Missing studentId or faceData.' });
  }

  // TODO: Perform real facial recognition here using faceData image
  // For now, just log and mark attendance
  attendance.face.push({ studentId, timestamp: new Date().toISOString() });
  console.log(`Face attendance marked for ${studentId}`);

  return res.json({ message: 'Face attendance marked successfully.' });
});


// QR attendance endpoint
app.post('/api/auth/qr', (req, res) => {
  const { qrCodeData } = req.body;
  if (!qrCodeData) {
    return res.status(400).json({ error: 'Missing qrCodeData.' });
  }
  // Extract student ID from QR code payload, e.g., "STUDENT:12345"
  const matches = qrCodeData.match(/^STUDENT:(\w+)$/);
  if (!matches) {
    return res.status(400).json({ error: 'Invalid QR code data.' });
  }
  const studentId = matches[1];

  attendance.qr.push({ studentId, timestamp: new Date().toISOString() });
  console.log(`QR attendance marked for ${studentId}`);

  return res.json({ message: 'QR attendance marked successfully.' });
});


// Admin login (simple demo)
app.post('/api/admin/login', (req, res) => {
  const { password } = req.body;
  if (password === 'admin123') {
    return res.json({ message: 'Admin logged in.' });
  }
  return res.status(401).json({ error: 'Invalid admin password.' });
});


// Start the server
app.listen(port, () => {
  console.log(`Backend listening on http://localhost:${port}`);
});
