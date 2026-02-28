import mongoose from 'mongoose'

const eventSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  time: {
    type: String,
    required: true
  },
  venue: {
    type: String,
    required: true
  },
  eventType: {
    type: String,
    required: true,
    enum: ['alumni-meet', 'placement', 'workshop', 'seminar', 'cultural', 'sports', 'other']
  },
  school: {
    type: String,
    required: true
  },
  targetAudience: [{
    type: String,
    enum: ['students', 'alumni', 'faculty', 'all']
  }],
  registrationRequired: {
    type: Boolean,
    default: false
  },
  registrationLink: String,
  maxParticipants: Number,
  status: {
    type: String,
    enum: ['draft', 'published', 'cancelled', 'completed'],
    default: 'published'
  },
  emailSent: {
    type: Boolean,
    default: false
  },
  emailSentAt: Date,
  recipientCount: {
    type: Number,
    default: 0
  },
  createdBy: String
}, { timestamps: true })

export default mongoose.models.Event || mongoose.model('Event', eventSchema)
