import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'

const schoolAdminSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true
  },
  school: {
    type: String,
    enum: ['All', 'Ballari', 'Bhadravati', 'Hubballi', 'Bagalkot', 'Kalburgi', 'Mangalore']
  },
  schoolId: {
    type: String,
    required: true,
    unique: true
  },
  role: {
    type: String,
    enum: ['super_admin', 'school_admin'],
    default: 'school_admin',
    required: true
  },
  permissions: {
    canEditAllSchools: { type: Boolean, default: false },
    canEditOwnSchool: { type: Boolean, default: false },
    canViewReports: { type: Boolean, default: true },
    canManageFunds: { type: Boolean, default: false },
    canManageGrants: { type: Boolean, default: false },
    canManageEvents: { type: Boolean, default: false },
    canManageAlumni: { type: Boolean, default: false }
  },
  fullName: {
    type: String,
    required: true
  },
  phone: {
    type: String
  },
  isActive: {
    type: Boolean,
    default: true
  },
  lastLogin: {
    type: Date
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
})

// Hash password before saving
schoolAdminSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next()
  
  try {
    const salt = await bcrypt.genSalt(10)
    this.password = await bcrypt.hash(this.password, salt)
    next()
  } catch (error) {
    next(error)
  }
})

// Method to compare password
schoolAdminSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password)
}

// Set permissions based on role
schoolAdminSchema.pre('save', function(next) {
  if (this.role === 'super_admin') {
    this.permissions = {
      canEditAllSchools: true,
      canEditOwnSchool: true,
      canViewReports: true,
      canManageFunds: true,
      canManageGrants: true,
      canManageEvents: true,
      canManageAlumni: true
    }
    this.school = 'All'
  } else if (this.role === 'school_admin') {
    this.permissions = {
      canEditAllSchools: false,
      canEditOwnSchool: true,
      canViewReports: true,
      canManageFunds: true,
      canManageGrants: true,
      canManageEvents: true,
      canManageAlumni: true
    }
  }
  next()
})

export default mongoose.models.SchoolAdmin || mongoose.model('SchoolAdmin', schoolAdminSchema)
