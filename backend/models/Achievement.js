// backend/models/Achievement.js
const mongoose = require('mongoose');

const AchievementSchema = new mongoose.Schema({
  title: { type: String, required: true },
  type: { type: String, enum: ['win', 'certification'], required: true },
  competition: { type: String }, 
  issuer: { type: String },      
  location: { type: String },    // <--- ADDED THIS
  date: { type: String, required: true },
  image: { type: String, required: true },
  description: { type: String },
  tags: [String] 
}, { timestamps: true });

module.exports = mongoose.model('Achievement', AchievementSchema);