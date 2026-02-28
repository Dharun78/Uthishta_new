import mongoose from 'mongoose'

const schoolContentSchema = new mongoose.Schema({
  school: {
    type: String,
    required: true,
    unique: true,
    enum: ['Ballari', 'Bhadravati', 'Hubballi', 'Bagalkot', 'Kalburgi', 'Mangalore']
  },
  description: {
    type: String,
    default: ''
  },
  vision: {
    type: String,
    default: ''
  },
  mission: {
    type: String,
    default: ''
  },
  facilities: [{
    name: String,
    description: String
  }],
  achievements: [{
    title: String,
    description: String,
    year: Number
  }],
  courses: [{
    name: String,
    duration: String,
    description: String
  }],
  contactInfo: {
    email: {
      type: String,
      default: ''
    },
    phone: {
      type: String,
      default: ''
    },
    address: {
      type: String,
      default: ''
    },
    website: {
      type: String,
      default: ''
    }
  },
  images: {
    banner: {
      type: String,
      default: ''
    },
    gallery: [{
      url: String,
      caption: String
    }]
  },
  socialMedia: {
    facebook: String,
    twitter: String,
    instagram: String,
    linkedin: String
  },
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
schoolContentSchema.pre('save', function(next) {
  this.updatedAt = Date.now()
  next()
})

export default mongoose.models.SchoolContent || mongoose.model('SchoolContent', schoolContentSchema)
