const mongoose = require('mongoose')

const alumniSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  phone: {
    type: String,
    required: true
  },
  school: {
    type: String,
    required: true,
    enum: ['Ballari', 'Bhadravati', 'Hubballi', 'Bagalkot', 'Kalburgi', 'Mangalore']
  },
  graduationYear: {
    type: Number,
    required: true,
    min: 1950,
    max: new Date().getFullYear()
  },
  currentOccupation: {
    type: String,
    trim: true
  },
  company: {
    type: String,
    trim: true
  },
  message: {
    type: String,
    trim: true
  },
  registeredAt: {
    type: Date,
    default: Date.now
  },
  verified: {
    type: Boolean,
    default: false
  }
})

module.exports = mongoose.model('Alumni', alumniSchema)
