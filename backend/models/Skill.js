const mongoose = require('mongoose');

const skillSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a skill name'],
    trim: true
  },
  proficiency: {
    type: Number,
    min: 1,
    max: 100,
    default: 50
  }
}, { timestamps: true });

module.exports = mongoose.model('Skill', skillSchema);
