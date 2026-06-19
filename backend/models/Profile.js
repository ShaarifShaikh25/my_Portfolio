const mongoose = require('mongoose');

const profileSchema = new mongoose.Schema({
  about: {
    type: String,
    required: [true, 'Please add about text']
  },
  resumeLink: {
    type: String
  },
  socialLinks: {
    github: String,
    linkedin: String,
    twitter: String
  }
}, { timestamps: true });

module.exports = mongoose.model('Profile', profileSchema);
