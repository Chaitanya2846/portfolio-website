const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const multer = require('multer');
const cloudinary = require('cloudinary').v2; // Added Cloudinary
const { CloudinaryStorage } = require('multer-storage-cloudinary'); // Added Cloudinary Storage
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

// --- CLOUDINARY CONFIGURATION ---
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Configure Multer to use Cloudinary instead of local storage
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'portfolio_uploads', // All files will be grouped in this Cloudinary folder
    resource_type: 'auto',       // 'auto' is required so it accepts both images AND PDFs
    allowed_formats: ['jpg', 'jpeg', 'png', 'webp', 'pdf']
  }
});

const upload = multer({ storage });

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

// --- SINGLE FILE UPLOAD API (Used by Admin Panel) ---
app.post('/api/upload', upload.single('file'), (req, res) => {
    try {
        if (!req.file) return res.status(400).json("No file uploaded");
        
        // Cloudinary automatically generates the secure URL in req.file.path
        res.json({ url: req.file.path }); 
    } catch (err) {
        console.error("Upload error:", err);
        res.status(500).json(err);
    }
});

// --- GENERIC CRUD ROUTE GENERATOR ---
const createCrudRoute = (Model) => {
  const router = express.Router();

  router.get('/', async (req, res) => {
    try {
      // Sort by order and then by newest created
      const items = await Model.find().sort({ order: 1, createdAt: -1 });
      res.json(items);
    } catch (err) { res.status(500).json(err); }
  });

  // Handle both 'image' (logo) and 'certificate' (file) fields
  router.post('/', upload.fields([{ name: 'image', maxCount: 1 }, { name: 'certificate', maxCount: 1 }]), async (req, res) => {
    try {
      const data = { ...req.body };

      // 1. Handle Logo Upload via Cloudinary
      if (req.files && req.files['image']) {
        data.image = req.files['image'][0].path; // Direct Cloudinary URL
      }

      // 2. Handle Certificate Upload via Cloudinary
      if (req.files && req.files['certificate']) {
        data.link = req.files['certificate'][0].path; // Direct Cloudinary URL
      }

      // 3. Parse 'roles' array if it arrives as a string
      if (data.roles && typeof data.roles === 'string') {
        data.roles = JSON.parse(data.roles);
      }

      // 4. Handle Tags
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
        data.image = req.files['image'][0].path; // Direct Cloudinary URL
      }

      if (req.files && req.files['certificate']) {
        data.link = req.files['certificate'][0].path; // Direct Cloudinary URL
      }

      if (data.roles && typeof data.roles === 'string') {
        data.roles = JSON.parse(data.roles);
      }

      if (data.tags && typeof data.tags === 'string') {
        data.tags = data.tags.split(',').map(tag => tag.trim()).filter(Boolean);
      }

      // --- FIXED MONGOOSE WARNING HERE ---
      const updatedItem = await Model.findByIdAndUpdate(req.params.id, data, { returnDocument: 'after' });
      
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