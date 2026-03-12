const express = require('express');
const cors = require('cors');
const path = require('path');
const multer = require('multer');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Mock Data
let complaints = [
  {
    id: "CMD-1001",
    name: "John Doe",
    mobile: "9876543210",
    email: "john@example.com",
    category: "Electricity",
    location: "Downtown Avenue, Block A",
    description: "Streetlights are completely off for the last 3 days.",
    photoUrl: "",
    status: "Resolved",
    department: "Electricity Department",
    filedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    resolutionDeadline: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "CMD-1002",
    name: "Jane Smith",
    mobile: "8765432109",
    email: "jane.smith@example.com",
    category: "Water",
    location: "River Side, Block B",
    description: "No water supply since yesterday morning.",
    photoUrl: "",
    status: "Assigned",
    department: "Water Department",
    filedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    resolutionDeadline: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "CMD-1003",
    name: "Alan Walker",
    mobile: "7654321098",
    email: "alan@example.com",
    category: "Roads",
    location: "Main Street, Sector 45",
    description: "Huge pothole causing traffic jams and accidents.",
    photoUrl: "",
    status: "In Progress",
    department: "Public Works Department",
    filedAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    resolutionDeadline: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "CMD-1004",
    name: "Lisa Wong",
    mobile: "6543210987",
    email: "lisa@example.com",
    category: "Sanitation",
    location: "Market Square, Sector 12",
    description: "Garbage not picked up for a week.",
    photoUrl: "",
    status: "Received",
    department: "Sanitation Department",
    filedAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(),
    resolutionDeadline: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), // Delayed
  },
  {
    id: "CMD-1005",
    name: "Michael Chang",
    mobile: "5432109876",
    email: "mike@example.com",
    category: "Police",
    location: "Central Park, City Center",
    description: "Loud music playing after midnight every day.",
    photoUrl: "",
    status: "Resolved",
    department: "Police Department",
    filedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    resolutionDeadline: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
  }
];

const categoryToDept = {
  "Water": "Water Department",
  "Electricity": "Electricity Department",
  "Roads": "Public Works Department",
  "Sanitation": "Sanitation Department",
  "Police": "Police Department"
};

let nextId = 1006;
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

app.post('/api/complaints', upload.single('photo'), (req, res) => {
  const { name, mobile, email, category, location, description } = req.body;
  const id = `CMD-${nextId++}`;
  const department = categoryToDept[category] || "General Administration";

  const newComplaint = {
    id,
    name,
    mobile,
    email,
    category,
    location,
    description,
    photoUrl: req.file ? "Uploaded" : "",
    status: "Received",
    department,
    filedAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    resolutionDeadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
  };

  complaints.push(newComplaint);
  res.status(201).json({ success: true, complaintId: id, message: "Complaint registered successfully." });
});

app.get('/api/complaints/:id', (req, res) => {
  const complaint = complaints.find(c => c.id === req.params.id);
  if (complaint) {
    res.json(complaint);
  } else {
    res.status(404).json({ error: "Complaint not found." });
  }
});

app.get('/api/admin/stats', (req, res) => {
  const total = complaints.length;
  const pending = complaints.filter(c => c.status !== 'Resolved').length;
  const resolved = complaints.filter(c => c.status === 'Resolved').length;

  const byDepartment = {};
  const byArea = {};

  complaints.forEach(c => {
    byDepartment[c.department] = (byDepartment[c.department] || 0) + 1;
    let area = "General";
    if (c.location.includes(',')) {
      area = c.location.split(',')[1].trim();
    } else {
      area = c.location;
    }
    byArea[area] = (byArea[area] || 0) + 1;
  });

  res.json({ total, pending, resolved, byDepartment, byArea, allComplaints: complaints });
});

app.get('/api/officer/complaints', (req, res) => {
  // Sort by newest first
  const sorted = [...complaints].sort((a, b) => new Date(b.filedAt) - new Date(a.filedAt));
  res.json(sorted);
});

app.put('/api/officer/complaints/:id/status', (req, res) => {
  const complaint = complaints.find(c => c.id === req.params.id);
  if (complaint) {
    complaint.status = req.body.status;
    complaint.updatedAt = new Date().toISOString();
    res.json({ success: true, complaint });
  } else {
    res.status(404).json({ error: "Complaint not found" });
  }
});

// Serve frontend for unknown routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`PS-CRM Server running on http://localhost:${PORT}`);
});
