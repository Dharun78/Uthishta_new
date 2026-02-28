const mongoose = require('mongoose')

const alumniFundSchema = new mongoose.Schema({
  alumniId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Alumni',
    required: true
  },
  alumniName: {
    type: String,
    required: true
  },
  alumniEmail: {
    type: String,
    required: true
  },
  school: {
    type: String,
    required: true,
    enum: ['Ballari', 'Bhadravati', 'Hubballi', 'Bagalkot', 'Kalburgi', 'Mangalore']
  },
  amount: {
    type: Number,
    required: true,
    min: 0
  },
  currency: {
    type: String,
    default: 'INR'
  },
  donationType: {
    type: String,
    enum: ['one-time', 'monthly', 'annual'],
    default: 'one-time'
  },
  purpose: {
    type: String,
    enum: ['general', 'infrastructure', 'scholarship', 'equipment', 'event', 'other'],
    default: 'general'
  },
  paymentMethod: {
    type: String,
    enum: ['upi', 'card', 'bank-transfer', 'cheque', 'cash'],
    required: true
  },
  transactionId: {
    type: String,
    unique: true,
    sparse: true
  },
  status: {
    type: String,
    enum: ['pending', 'completed', 'failed', 'refunded'],
    default: 'pending'
  },
  receiptNumber: {
    type: String,
    unique: true
  },
  taxDeductible: {
    type: Boolean,
    default: true
  },
  notes: {
    type: String
  },
  aiAnalysis: {
    donorPattern: String,
    predictedNextDonation: Date,
    engagementScore: Number,
    recommendations: [String]
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
})

// Generate receipt number
alumniFundSchema.pre('save', function(next) {
  if (!this.receiptNumber && this.status === 'completed') {
    const year = new Date().getFullYear()
    const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0')
    this.receiptNumber = `GJTS-${this.school.substring(0, 3).toUpperCase()}-${year}-${random}`
  }
  this.updatedAt = Date.now()
  next()
})

module.exports = mongoose.model('AlumniFund', alumniFundSchema)
