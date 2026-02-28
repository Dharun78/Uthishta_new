import mongoose from 'mongoose'

const announcementSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  message: {
    type: String,
    required: true
  },
  sender: {
    username: {
      type: String,
      required: true
    },
    fullName: {
      type: String,
      required: true
    },
    school: String,
    role: {
      type: String,
      enum: ['super_admin', 'school_admin'],
      required: true
    }
  },
  recipients: {
    type: String,
    enum: ['all_admins', 'super_admin', 'specific_school'],
    required: true
  },
  targetSchool: {
    type: String,
    enum: ['Ballari', 'Bhadravati', 'Hubballi', 'Bagalkot', 'Kalburgi', 'Mangalore'],
    required: false
  },
  priority: {
    type: String,
    enum: ['low', 'normal', 'high', 'urgent'],
    default: 'normal'
  },
  readBy: [{
    username: String,
    readAt: Date
  }],
  replies: [{
    sender: {
      username: String,
      fullName: String,
      school: String,
      role: String
    },
    message: String,
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  status: {
    type: String,
    enum: ['active', 'archived'],
    default: 'active'
  }
}, { timestamps: true })

// Index for faster queries
announcementSchema.index({ recipients: 1, status: 1, createdAt: -1 })
announcementSchema.index({ 'sender.username': 1 })
announcementSchema.index({ targetSchool: 1 })

export default mongoose.models.Announcement || mongoose.model('Announcement', announcementSchema)
