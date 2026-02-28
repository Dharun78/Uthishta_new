import mongoose from 'mongoose'

const notificationSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['alumni', 'donation', 'grant', 'event', 'system', 'alert'],
    required: true
  },
  title: {
    type: String,
    required: true
  },
  message: {
    type: String,
    required: true
  },
  school: {
    type: String,
    enum: ['All', 'Ballari', 'Bhadravati', 'Hubballi', 'Bagalkot', 'Kalburgi', 'Mangalore']
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'urgent'],
    default: 'medium'
  },
  read: {
    type: Boolean,
    default: false
  },
  readBy: [{
    username: String,
    readAt: Date
  }],
  actionUrl: {
    type: String
  },
  metadata: {
    type: mongoose.Schema.Types.Mixed
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  expiresAt: {
    type: Date
  }
})

// Index for faster queries
notificationSchema.index({ school: 1, createdAt: -1 })
notificationSchema.index({ read: 1, createdAt: -1 })
notificationSchema.index({ type: 1, createdAt: -1 })

export default mongoose.models.Notification || mongoose.model('Notification', notificationSchema)
