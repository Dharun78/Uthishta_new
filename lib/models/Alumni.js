import mongoose from 'mongoose'

const AlumniSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
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
    required: true
  },
  currentOccupation: {
    type: String,
    default: ''
  },
  company: {
    type: String,
    default: ''
  },
  city: {
    type: String,
    default: ''
  },
  message: {
    type: String,
    default: ''
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'approved'
  },
  registeredAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
})

export default mongoose.models.Alumni || mongoose.model('Alumni', AlumniSchema)
