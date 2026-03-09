const mongoose = require('mongoose');

const ExperienceSchema = new mongoose.Schema({
  company: { type: String, required: true }, // Organization Name (e.g., VCET Student Council)
  image: { type: String }, // Logo
  location: { type: String },
  type: { type: String, enum: ['internship', 'committee'], required: true },
  order: { type: Number, required: true },
  
  // For Internships: Single role data
  role: { type: String },
  duration: { type: String },
  description: { type: String },
  link: { type: String },

  // For Committees: Array of roles for the timeline
  roles: [{
    title: { type: String },
    date: { type: String },
    points: [String] // Array of bullet points
  }]
}, { timestamps: true });

module.exports = mongoose.model('Experience', ExperienceSchema);