const mongoose = require('mongoose');

const SkillSchema = new mongoose.Schema({
  category: { 
    type: String, 
    required: true,
    enum: ["Languages", "Frameworks & Libraries", "Tools & Platforms", "Databases"] 
  },
  // Add an order number to force the sequence
  order: { type: Number, required: true }, 
  items: [{
    name: { type: String, required: true },
    icon: { type: String, default: "FaCode" } 
  }]
}, { timestamps: true });

module.exports = mongoose.model('Skill', SkillSchema);