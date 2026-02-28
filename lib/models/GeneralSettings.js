import mongoose from 'mongoose'

const generalSettingsSchema = new mongoose.Schema({
  settingKey: {
    type: String,
    required: true,
    unique: true,
    default: 'general'
  },
  siteName: {
    type: String,
    default: 'GJTS Karnataka'
  },
  siteDescription: {
    type: String,
    default: 'Government Junior Technical Schools in Karnataka'
  },
  aboutUs: {
    type: String,
    default: ''
  },
  contactEmail: {
    type: String,
    default: 'info@gjtskarnataka.edu.in'
  },
  contactPhone: {
    type: String,
    default: '+91-XXX-XXX-XXXX'
  },
  officeAddress: {
    type: String,
    default: ''
  },
  officeHours: {
    type: String,
    default: 'Monday - Friday: 9:00 AM - 5:00 PM'
  },
  socialMedia: {
    facebook: String,
    twitter: String,
    instagram: String,
    linkedin: String,
    youtube: String
  },
  announcements: [{
    title: String,
    content: String,
    priority: {
      type: String,
      enum: ['low', 'medium', 'high'],
      default: 'medium'
    },
    active: {
      type: Boolean,
      default: true
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  updatedBy: {
    type: String,
    default: ''
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
})

// Update timestamp on save
generalSettingsSchema.pre('save', function(next) {
  this.updatedAt = Date.now()
  next()
})

export default mongoose.models.GeneralSettings || mongoose.model('GeneralSettings', generalSettingsSchema)
