const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const multer = require('multer'); // Added for file uploads
const path = require('path');
const fs = require('fs');
require('dotenv').config();

// Import Your Models
const Project = require('./models/Project');
const Skill = require('./models/Skill');
const Experience = require('./models/Experience');
const Education = require('./models/Education');
const Achievement = require('./models/Achievement');
const Contact = require('./models/Contact');

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// --- MULTER CONFIGURATION FOR LOCAL STORAGE ---
// Create 'uploads' directory securely using absolute paths
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        // Strip spaces from the original name to prevent broken browser URLs
        const cleanFileName = file.originalname.replace(/\s+/g, '-');
        cb(null, Date.now() + '-' + cleanFileName);
    }
});

const upload = multer({ storage });

// Serve the 'uploads' folder as static so the frontend can view images
app.use('/uploads', express.static(uploadDir));

// Database Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ MongoDB Connected'))
  .catch(err => console.log('❌ DB Error:', err));

// --- ADMIN LOGIN API ---
app.post('/api/auth/login', (req, res) => {
  const { password } = req.body;
  if (password === process.env.ADMIN_PASSWORD) {
    res.json({ token: "admin_authorized_token_777" });
  } else {
    res.status(401).json({ error: "Invalid password!" });
  }
});

// --- FILE UPLOAD API ---
app.post('/api/upload', upload.single('file'), (req, res) => {
    try {
        if (!req.file) return res.status(400).json("No file uploaded");
        
        // Return a relative path so it works locally AND on a live server
        const imageUrl = `/uploads/${req.file.filename}`;
        res.json({ url: imageUrl });
    } catch (err) {
        res.status(500).json(err);
    }
});

// --- GENERIC CRUD ROUTE GENERATOR ---
// --- GENERIC CRUD ROUTE GENERATOR ---
// --- Updated GENERIC CRUD ROUTE GENERATOR in server.js ---
const createCrudRoute = (Model) => {
  const router = express.Router();

  router.get('/', async (req, res) => {
    try {
      // Sort by order and then by newest created
      const items = await Model.find().sort({ order: 1, createdAt: -1 });
      res.json(items);
    } catch (err) { res.status(500).json(err); }
  });

  // Use upload.fields to support both 'image' (logo) and 'certificate' (file)
  router.post('/', upload.fields([{ name: 'image', maxCount: 1 }, { name: 'certificate', maxCount: 1 }]), async (req, res) => {
    try {
      const data = { ...req.body };

      // 1. Handle Logo Upload (if exists)
      if (req.files && req.files['image']) {
        data.image = `http://localhost:5000/uploads/${req.files['image'][0].filename}`;
      }

      // 2. Handle Certificate Upload (Saves to the 'link' field in your schema)
      if (req.files && req.files['certificate']) {
        data.link = `http://localhost:5000/uploads/${req.files['certificate'][0].filename}`;
      }

      // 3. IMPORTANT: Parse 'roles' array if it arrives as a string (FormData requirement)
      if (data.roles && typeof data.roles === 'string') {
        data.roles = JSON.parse(data.roles);
      }

      // 4. Handle Tags (for Projects/Skills models using the same generator)
      if (data.tags && typeof data.tags === 'string') {
        data.tags = data.tags.split(',').map(tag => tag.trim()).filter(Boolean);
      }

      const newItem = new Model(data);
      const savedItem = await newItem.save();
      res.json(savedItem);
    } catch (err) { 
      console.error("Save Error:", err);
      res.status(500).json(err); 
    }
  });

  router.put('/:id', upload.fields([{ name: 'image', maxCount: 1 }, { name: 'certificate', maxCount: 1 }]), async (req, res) => {
    try {
      const data = { ...req.body };

      if (req.files && req.files['image']) {
        data.image = `http://localhost:5000/uploads/${req.files['image'][0].filename}`;
      }

      if (req.files && req.files['certificate']) {
        data.link = `http://localhost:5000/uploads/${req.files['certificate'][0].filename}`;
      }

      if (data.roles && typeof data.roles === 'string') {
        data.roles = JSON.parse(data.roles);
      }

      const updatedItem = await Model.findByIdAndUpdate(req.params.id, data, { new: true });
      res.json(updatedItem);
    } catch (err) { res.status(500).json(err); }
  });

  router.delete('/:id', async (req, res) => {
    try {
      await Model.findByIdAndDelete(req.params.id);
      res.json("Deleted Successfully");
    } catch (err) { res.status(500).json(err); }
  });

  return router;
};

// Register API Routes
app.use('/api/projects', createCrudRoute(Project));
app.use('/api/skills', createCrudRoute(Skill));
app.use('/api/experience', createCrudRoute(Experience));
app.use('/api/education', createCrudRoute(Education));
app.use('/api/achievements', createCrudRoute(Achievement));
app.use('/api/contact', createCrudRoute(Contact));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));