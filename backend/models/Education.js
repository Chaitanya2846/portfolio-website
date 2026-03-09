const mongoose = require('mongoose');

const EducationSchema = new mongoose.Schema({
  institution: { type: String, required: true },
  degree: { type: String, required: true },
  duration: { type: String, required: true },
  score: { type: String }, // e.g., "CGPA: 8.9"
  location: { type: String },
  order: { type: Number, required: true } // 1 for latest, 2, 3...
}, { timestamps: true });

module.exports = mongoose.model('Education', EducationSchema);