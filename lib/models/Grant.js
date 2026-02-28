import mongoose from 'mongoose'

const grantSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  grantProvider: {
    type: String,
    required: true
  },
  providerType: {
    type: String,
    enum: ['government', 'private', 'ngo', 'corporate', 'international'],
    required: true
  },
  amount: {
    min: Number,
    max: Number,
    currency: {
      type: String,
      default: 'INR'
    }
  },
  totalAmount: {
    type: String  // e.g., "Rs 2,94,283 crore (2021-26)" - total scheme budget
  },
  perSchoolAmount: {
    type: String  // e.g., "Rs 5-15 lakh per school" - amount per school
  },
  eligibilityCriteria: [{
    criterion: String,
    met: Boolean,
    notes: String
  }],
  applicationDeadline: {
    type: Date,
    required: true
  },
  grantUrl: {
    type: String
  },
  applicationUrl: {
    type: String
  },
  category: {
    type: String,
    enum: ['education', 'infrastructure', 'technology', 'research', 'skill-development', 'other']
  },
  targetBeneficiaries: [String],
  aiEligibilityScore: {
    type: Number,
    min: 0,
    max: 100
  },
  aiRecommendation: {
    shouldApply: Boolean,
    reasoning: String,
    successProbability: Number,
    requiredDocuments: [String],
    estimatedEffort: String
  },
  applicableSchools: [{
    type: String,
    enum: ['Ballari', 'Bhadravati', 'Hubballi', 'Bagalkot', 'Kalburgi', 'Mangalore']
  }],
  status: {
    type: String,
    enum: ['discovered', 'under-review', 'eligible', 'not-eligible', 'applied', 'approved', 'rejected'],
    default: 'discovered'
  },
  applicationStatus: {
    appliedDate: Date,
    appliedBy: String,
    documents: [String],
    followUpDates: [Date],
    outcome: String
  },
  discoveredBy: {
    type: String,
    enum: ['ai-agent', 'manual', 'notification'],
    default: 'ai-agent'
  },
  discoveredAt: {
    type: Date,
    default: Date.now
  },
  lastUpdated: {
    type: Date,
    default: Date.now
  }
})

// Update timestamp
grantSchema.pre('save', function(next) {
  this.lastUpdated = Date.now()
  next()
})

export default mongoose.models.Grant || mongoose.model('Grant', grantSchema)
