// Comprehensive database seeding script
// Run with: node scripts/seed-database.js

const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/gjts_karnataka'

// Define schemas
const schoolAdminSchema = new mongoose.Schema({
  username: String,
  email: String,
  password: String,
  school: String,
  schoolId: String,
  role: String,
  permissions: Object,
  fullName: String,
  phone: String,
  isActive: Boolean,
  createdAt: Date
})

const alumniSchema = new mongoose.Schema({
  name: String,
  email: String,
  phone: String,
  school: String,
  graduationYear: Number,
  course: String,
  currentOccupation: String,
  company: String,
  location: String,
  linkedIn: String,
  isActive: Boolean,
  createdAt: Date
})

const alumniFundSchema = new mongoose.Schema({
  alumniId: mongoose.Schema.Types.ObjectId,
  alumniName: String,
  alumniEmail: String,
  school: String,
  amount: Number,
  currency: String,
  donationType: String,
  purpose: String,
  paymentMethod: String,
  transactionId: String,
  status: String,
  receiptNumber: String,
  taxDeductible: Boolean,
  notes: String,
  aiAnalysis: Object,
  createdAt: Date,
  updatedAt: Date
})

const eventSchema = new mongoose.Schema({
  title: String,
  description: String,
  school: String,
  date: Date,
  time: String,
  venue: String,
  category: String,
  targetAudience: [String],
  maxAttendees: Number,
  registeredCount: Number,
  status: String,
  organizer: String,
  contactEmail: String,
  contactPhone: String,
  imageUrl: String,
  createdBy: String,
  createdAt: Date,
  updatedAt: Date
})

const grantSchema = new mongoose.Schema({
  title: String,
  description: String,
  grantProvider: String,
  providerType: String,
  amount: Object,
  eligibilityCriteria: [Object],
  applicationDeadline: Date,
  grantUrl: String,
  applicationUrl: String,
  category: String,
  targetBeneficiaries: [String],
  aiEligibilityScore: Number,
  aiRecommendation: Object,
  applicableSchools: [String],
  status: String,
  discoveredBy: String,
  discoveredAt: Date,
  lastUpdated: Date
})

// Create models
const SchoolAdmin = mongoose.model('SchoolAdmin', schoolAdminSchema)
const Alumni = mongoose.model('Alumni', alumniSchema)
const AlumniFund = mongoose.model('AlumniFund', alumniFundSchema)
const Event = mongoose.model('Event', eventSchema)
const Grant = mongoose.model('Grant', grantSchema)

// Sample data
const schools = ['Ballari', 'Bhadravati', 'Hubballi', 'Bagalkot', 'Kalburgi', 'Mangalore']

async function seedDatabase() {
  try {
    await mongoose.connect(MONGODB_URI)
    console.log('✅ Connected to MongoDB')

    // Clear existing data
    await SchoolAdmin.deleteMany({})
    await Alumni.deleteMany({})
    await AlumniFund.deleteMany({})
    await Event.deleteMany({})
    await Grant.deleteMany({})
    console.log('🗑️  Cleared existing data')

    // 1. Seed Admins
    console.log('\n📝 Seeding Admins...')
    const admins = [
      {
        username: 'superadmin',
        email: 'superadmin@gjts-karnataka.edu.in',
        password: await bcrypt.hash('super123', 10),
        school: 'All',
        schoolId: 'GJTS-SUPER-000',
        role: 'super_admin',
        fullName: 'Super Administrator',
        phone: '+91-9876543210',
        isActive: true,
        permissions: {
          canEditAllSchools: true,
          canEditOwnSchool: true,
          canViewReports: true,
          canManageFunds: true,
          canManageGrants: true,
          canManageEvents: true,
          canManageAlumni: true
        },
        createdAt: new Date()
      }
    ]

    for (let i = 0; i < schools.length; i++) {
      const school = schools[i]
      admins.push({
        username: `admin_${school.toLowerCase()}`,
        email: `admin@gjts-${school.toLowerCase()}.edu.in`,
        password: await bcrypt.hash(`${school.toLowerCase()}123`, 10),
        school: school,
        schoolId: `GJTS-${school.substring(0, 3).toUpperCase()}-00${i + 1}`,
        role: 'school_admin',
        fullName: `${school} Admin`,
        phone: `+91-987654321${i}`,
        isActive: true,
        permissions: {
          canEditAllSchools: false,
          canEditOwnSchool: true,
          canViewReports: true,
          canManageFunds: true,
          canManageGrants: true,
          canManageEvents: true,
          canManageAlumni: true
        },
        createdAt: new Date()
      })
    }

    await SchoolAdmin.insertMany(admins)
    console.log(`✅ Created ${admins.length} admin accounts`)

    // 2. Seed Alumni
    console.log('\n👥 Seeding Alumni...')
    const alumni = []
    const courses = ['Electronics', 'Mechanical Engineering', 'Computer Science', 'Electrical Engineering']
    const occupations = ['Software Engineer', 'Mechanical Engineer', 'Electrician', 'Technician', 'Business Owner', 'Teacher']
    const companies = ['TCS', 'Infosys', 'Wipro', 'Tech Mahindra', 'Quest Global', 'Bosch', 'Self-Employed']

    for (const school of schools) {
      for (let i = 0; i < 20; i++) {
        alumni.push({
          name: `${school} Alumni ${i + 1}`,
          email: `alumni${i + 1}@${school.toLowerCase()}.com`,
          phone: `+91-${9000000000 + Math.floor(Math.random() * 100000000)}`,
          school: school,
          graduationYear: 2015 + Math.floor(Math.random() * 8),
          course: courses[Math.floor(Math.random() * courses.length)],
          currentOccupation: occupations[Math.floor(Math.random() * occupations.length)],
          company: companies[Math.floor(Math.random() * companies.length)],
          location: ['Bangalore', 'Mumbai', 'Pune', 'Hyderabad', school][Math.floor(Math.random() * 5)],
          linkedIn: `https://linkedin.com/in/alumni${i + 1}`,
          isActive: true,
          createdAt: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000)
        })
      }
    }

    const insertedAlumni = await Alumni.insertMany(alumni)
    console.log(`✅ Created ${insertedAlumni.length} alumni records`)

    // 3. Seed Alumni Funds
    console.log('\n💰 Seeding Alumni Funds...')
    const funds = []
    const purposes = ['general', 'infrastructure', 'scholarship', 'equipment', 'event']
    const paymentMethods = ['upi', 'card', 'bank-transfer']

    for (const alumnus of insertedAlumni) {
      // 30% chance of donation
      if (Math.random() < 0.3) {
        const donationCount = Math.floor(Math.random() * 3) + 1
        for (let i = 0; i < donationCount; i++) {
          const amount = [1000, 2000, 5000, 10000, 25000, 50000][Math.floor(Math.random() * 6)]
          const createdDate = new Date(Date.now() - Math.random() * 180 * 24 * 60 * 60 * 1000)
          
          funds.push({
            alumniId: alumnus._id,
            alumniName: alumnus.name,
            alumniEmail: alumnus.email,
            school: alumnus.school,
            amount: amount,
            currency: 'INR',
            donationType: 'one-time',
            purpose: purposes[Math.floor(Math.random() * purposes.length)],
            paymentMethod: paymentMethods[Math.floor(Math.random() * paymentMethods.length)],
            transactionId: `TXN${Date.now()}${Math.floor(Math.random() * 10000)}`,
            status: 'completed',
            receiptNumber: `GJTS-${alumnus.school.substring(0, 3).toUpperCase()}-${new Date().getFullYear()}-${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`,
            taxDeductible: true,
            notes: 'Thank you for your contribution!',
            aiAnalysis: {
              donorPattern: ['new-donor', 'occasional', 'frequent'][Math.floor(Math.random() * 3)],
              engagementScore: Math.floor(Math.random() * 100),
              recommendations: ['Send thank you email', 'Share impact report']
            },
            createdAt: createdDate,
            updatedAt: createdDate
          })
        }
      }
    }

    await AlumniFund.insertMany(funds)
    console.log(`✅ Created ${funds.length} fund records`)

    // 4. Seed Events
    console.log('\n📅 Seeding Events...')
    const events = []
    const eventTypes = [
      { title: 'Alumni Meet 2026', category: 'alumni-meet', description: 'Annual alumni gathering and networking event' },
      { title: 'Technical Workshop', category: 'workshop', description: 'Hands-on technical skills workshop' },
      { title: 'Career Guidance Session', category: 'career', description: 'Career counseling and guidance for students' },
      { title: 'Sports Day', category: 'sports', description: 'Annual sports and games competition' },
      { title: 'Cultural Fest', category: 'cultural', description: 'Cultural programs and performances' },
      { title: 'Industry Visit', category: 'educational', description: 'Visit to local industries and companies' }
    ]

    for (const school of schools) {
      for (const eventType of eventTypes) {
        const futureDate = new Date(Date.now() + Math.random() * 90 * 24 * 60 * 60 * 1000)
        events.push({
          title: `${eventType.title} - ${school}`,
          description: eventType.description,
          school: school,
          date: futureDate,
          time: ['10:00 AM', '2:00 PM', '4:00 PM'][Math.floor(Math.random() * 3)],
          venue: `${school} Campus`,
          category: eventType.category,
          targetAudience: ['students', 'alumni', 'faculty'],
          maxAttendees: Math.floor(Math.random() * 200) + 50,
          registeredCount: Math.floor(Math.random() * 50),
          status: 'upcoming',
          organizer: `${school} Admin`,
          contactEmail: `admin@gjts-${school.toLowerCase()}.edu.in`,
          contactPhone: `+91-987654321${schools.indexOf(school)}`,
          imageUrl: `/images/events/${eventType.category}.jpg`,
          createdBy: `admin_${school.toLowerCase()}`,
          createdAt: new Date(),
          updatedAt: new Date()
        })
      }
    }

    await Event.insertMany(events)
    console.log(`✅ Created ${events.length} events`)

    // 5. Seed Grants
    console.log('\n🎯 Seeding Grants...')
    const grants = [
      {
        title: 'Digital India Initiative - School Technology Grant 2026',
        description: 'Government grant for upgrading school technology infrastructure including computers, internet connectivity, and digital learning tools.',
        grantProvider: 'Ministry of Electronics and IT',
        providerType: 'government',
        amount: { min: 500000, max: 2000000, currency: 'INR' },
        eligibilityCriteria: [
          { criterion: 'Government-recognized institution', met: true },
          { criterion: 'Technical/vocational focus', met: true },
          { criterion: 'Student strength > 100', met: true }
        ],
        applicationDeadline: new Date('2026-06-30'),
        grantUrl: 'https://digitalindia.gov.in/grants',
        applicationUrl: 'https://digitalindia.gov.in/apply',
        category: 'technology',
        targetBeneficiaries: ['government schools', 'technical schools'],
        aiEligibilityScore: 95,
        aiRecommendation: {
          shouldApply: true,
          reasoning: 'Excellent match! You meet 3/3 criteria. Strong recommendation to apply.',
          successProbability: 95,
          requiredDocuments: ['School registration', 'Financial statements', 'Project proposal'],
          estimatedEffort: 'Low - straightforward application'
        },
        applicableSchools: schools,
        status: 'discovered',
        discoveredBy: 'ai-agent',
        discoveredAt: new Date(),
        lastUpdated: new Date()
      },
      {
        title: 'Skill India Mission - Vocational Training Equipment Grant',
        description: 'Funding for purchasing modern equipment and tools for vocational training programs.',
        grantProvider: 'Ministry of Skill Development',
        providerType: 'government',
        amount: { min: 300000, max: 1500000, currency: 'INR' },
        eligibilityCriteria: [
          { criterion: 'Vocational training programs', met: true },
          { criterion: 'Placement track record', met: true }
        ],
        applicationDeadline: new Date('2026-05-15'),
        grantUrl: 'https://skillindia.gov.in/grants',
        category: 'equipment',
        targetBeneficiaries: ['ITIs', 'technical schools'],
        aiEligibilityScore: 88,
        aiRecommendation: {
          shouldApply: true,
          reasoning: 'Good match. You meet 2/2 criteria. Worth applying.',
          successProbability: 88,
          requiredDocuments: ['School registration', 'Equipment list', 'Budget breakdown'],
          estimatedEffort: 'Medium - requires detailed documentation'
        },
        applicableSchools: schools,
        status: 'discovered',
        discoveredBy: 'ai-agent',
        discoveredAt: new Date(),
        lastUpdated: new Date()
      },
      {
        title: 'Quest Global CSR - Education Infrastructure 2026',
        description: 'Corporate Social Responsibility program supporting infrastructure development in technical education.',
        grantProvider: 'Quest Global',
        providerType: 'corporate',
        amount: { min: 1000000, max: 5000000, currency: 'INR' },
        eligibilityCriteria: [
          { criterion: 'Technical education focus', met: true },
          { criterion: 'Partnership potential', met: true }
        ],
        applicationDeadline: new Date('2026-08-31'),
        grantUrl: 'https://questglobal.com/csr',
        category: 'infrastructure',
        targetBeneficiaries: ['technical schools'],
        aiEligibilityScore: 92,
        aiRecommendation: {
          shouldApply: true,
          reasoning: 'Excellent match! Strong partnership opportunity.',
          successProbability: 92,
          requiredDocuments: ['Project proposal', 'Infrastructure plan', 'Partnership agreement'],
          estimatedEffort: 'Low - existing partnership'
        },
        applicableSchools: schools,
        status: 'discovered',
        discoveredBy: 'ai-agent',
        discoveredAt: new Date(),
        lastUpdated: new Date()
      },
      {
        title: 'Karnataka State Education Fund',
        description: 'State government fund for improving educational facilities and student support programs.',
        grantProvider: 'Karnataka Education Department',
        providerType: 'government',
        amount: { min: 200000, max: 1000000, currency: 'INR' },
        eligibilityCriteria: [
          { criterion: 'Located in Karnataka', met: true },
          { criterion: 'Government institution', met: true }
        ],
        applicationDeadline: new Date('2026-04-30'),
        grantUrl: 'https://schooleducation.karnataka.gov.in/grants',
        category: 'education',
        targetBeneficiaries: ['government schools'],
        aiEligibilityScore: 98,
        aiRecommendation: {
          shouldApply: true,
          reasoning: 'Perfect match! State government priority.',
          successProbability: 98,
          requiredDocuments: ['School registration', 'Utilization plan'],
          estimatedEffort: 'Low - state priority'
        },
        applicableSchools: schools,
        status: 'discovered',
        discoveredBy: 'ai-agent',
        discoveredAt: new Date(),
        lastUpdated: new Date()
      },
      {
        title: 'Infosys Foundation - STEM Education Grant 2026',
        description: 'Supporting STEM education initiatives with focus on hands-on learning and innovation.',
        grantProvider: 'Infosys Foundation',
        providerType: 'private',
        amount: { min: 500000, max: 2500000, currency: 'INR' },
        eligibilityCriteria: [
          { criterion: 'STEM focus', met: true },
          { criterion: 'Innovation in teaching', met: true }
        ],
        applicationDeadline: new Date('2026-07-15'),
        grantUrl: 'https://infosys.com/infosys-foundation/grants',
        category: 'education',
        targetBeneficiaries: ['schools', 'training centers'],
        aiEligibilityScore: 85,
        aiRecommendation: {
          shouldApply: true,
          reasoning: 'Good match. Strong STEM focus.',
          successProbability: 85,
          requiredDocuments: ['STEM program details', 'Innovation plan', 'Impact assessment'],
          estimatedEffort: 'Medium - detailed proposal needed'
        },
        applicableSchools: schools,
        status: 'discovered',
        discoveredBy: 'ai-agent',
        discoveredAt: new Date(),
        lastUpdated: new Date()
      }
    ]

    await Grant.insertMany(grants)
    console.log(`✅ Created ${grants.length} grants`)

    // Summary
    console.log('\n' + '='.repeat(60))
    console.log('🎉 DATABASE SEEDING COMPLETED!')
    console.log('='.repeat(60))
    console.log(`\n📊 Summary:`)
    console.log(`  - Admins: ${admins.length}`)
    console.log(`  - Alumni: ${insertedAlumni.length}`)
    console.log(`  - Funds: ${funds.length}`)
    console.log(`  - Events: ${events.length}`)
    console.log(`  - Grants: ${grants.length}`)
    console.log(`\n🔐 Login Credentials:`)
    console.log(`  Super Admin: superadmin / super123`)
    console.log(`  School Admins: admin_ballari / ballari123 (etc.)`)
    console.log(`\n🌐 Access:`)
    console.log(`  Website: http://localhost:3000`)
    console.log(`  Dashboard: http://localhost:3000/dashboard/login`)
    console.log('='.repeat(60))

    await mongoose.disconnect()
    console.log('\n✅ Disconnected from MongoDB')
  } catch (error) {
    console.error('❌ Error seeding database:', error)
    process.exit(1)
  }
}

seedDatabase()
