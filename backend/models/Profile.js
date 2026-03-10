const mongoose = require('mongoose');

const ProfileSchema = new mongoose.Schema({
  name: String,
  resumeUrl: String, // This will store the Cloudinary link
});

module.exports = mongoose.model('Profile', ProfileSchema);