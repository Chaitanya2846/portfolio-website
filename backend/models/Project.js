const mongoose = require('mongoose');

const ProjectSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  image: { type: String, required: true }, // We will store the Image URL
  techStack: [{
    name: String,
    icon: String // e.g., "FaReact"
  }],
  features: [String], // Array of strings for key features
  links: {
    live: String,
    github: String,
    docs: String
  }
}, { timestamps: true });

module.exports = mongoose.model('Project', ProjectSchema);