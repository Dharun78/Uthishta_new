// Enhanced database seeding script with larger random dataset
// Run with: node scripts/seed-large-dataset.js

const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/gjts_karnataka'

// Define schemas (same as before)
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

// Enhanced sample data
const schools = ['Ballari', 'Bhadravati', 'Hubballi', 'Bagalkot', 'Kalburgi', 'Mangalore']

// Random name generator
const firstNames = ['Rajesh', 'Priya', 'Amit', 'Sneha', 'Vikram', 'Anjali', 'Karthik', 'Divya', 'Suresh', 'Lakshmi', 
  'Arun', 'Meera', 'Ravi', 'Pooja', 'Manoj', 'Kavya', 'Sanjay', 'Nisha', 'Prakash', 'Swathi',
  'Ganesh', 'Deepa', 'Naveen', 'Rekha', 'Harish', 'Suma', 'Ramesh', 'Vidya', 'Kumar', 'Asha']

const lastNames = ['Kumar', 'Reddy', 'Sharma', 'Patel', 'Rao', 'Singh', 'Nair', 'Iyer', 'Desai', 'Joshi',
  'Hegde', 'Shetty', 'Kulkarni', 'Naik', 'Gowda', 'Murthy', 'Bhat', 'Kamath', 'Menon', 'Pillai']

const courses = [
  'Electronics Engineering',
  'Mechanical Engineering', 
  'Computer Science',
  'Electrical Engineering',
  'Civil Engineering',
  'Automobile Engineering',
  'Instrumentation Technology',
  'Industrial Production'
]

const occupations = [
  'Software Engineer', 'Mechanical Engineer', 'Electrical Engineer', 'Civil Engineer',
  'Data Scientist', 'Project Manager', 'Business Analyst', 'Quality Engineer',
  'Production Manager', 'Design Engineer', 'Maintenance Engineer', 'Technician',
  'Entrepreneur', 'Consultant', 'Teacher', 'Government Employee',
  'Sales Manager', 'Operations Manager', 'Research Scientist', 'Technical Lead'
]

const companies = [
  'TCS', 'Infosys', 'Wipro', 'Tech Mahindra', 'HCL Technologies',
  'Cognizant', 'Accenture', 'IBM', 'Microsoft', 'Google',
  'Amazon', 'Flipkart', 'Bosch', 'Toyota', 'Honda',
  'Larsen & Toubro', 'Tata Motors', 'Mahindra', 'Quest Global', 'Mindtree',
  'Mphasis', 'Capgemini', 'DXC Technology', 'Oracle', 'SAP',
  'Self-Employed', 'Government Sector', 'Startup'
]

const cities = [
  'Bangalore', 'Mumbai', 'Pune', 'Hyderabad', 'Chennai',
  'Delhi', 'Kolkata', 'Ahmedabad', 'Surat', 'Jaipur',
  'Lucknow', 'Kanpur', 'Nagpur', 'Indore', 'Thane',
  'Bhopal', 'Visakhapatnam', 'Pimpri-Chinchwad', 'Patna', 'Vadodara'
]

function randomElement(array) {
  return array[Math.floor(Math.random() * array.length)]
}

function generateName() {
  return `${randomElement(firstNames)} ${randomElement(lastNames)}`
}

function generateEmail(name, school) {
  const cleanName = name.toLowerCase().replace(/\s+/g, '.')
  const domain = school.toLowerCase()
  return `${cleanName}@${domain}.alumni.in`
}

function generatePhone() {
  return `+91-${9000000000 + Math.floor(Math.random() * 999999999)}`
}

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

    // 1. Seed Admins (same as before)
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

    // 2. Seed Alumni (ENHANCED - 100 per school = 600 total)
    console.log('\n👥 Seeding Alumni (600 records)...')
    const alumni = []

    for (const school of schools) {
      for (let i = 0; i < 100; i++) {
        const name = generateName()
        alumni.push({
          name: name,
          email: generateEmail(name, school),
          phone: generatePhone(),
          school: school,
          graduationYear: 2010 + Math.floor(Math.random() * 15), // 2010-2024
          course: randomElement(courses),
          currentOccupation: randomElement(occupations),
          company: randomElement(companies),
          location: randomElement(cities),
          linkedIn: `https://linkedin.com/in/${name.toLowerCase().replace(/\s+/g, '-')}`,
          isActive: Math.random() > 0.1, // 90% active
          createdAt: new Date(Date.now() - Math.random() * 1095 * 24 * 60 * 60 * 1000) // Last 3 years
        })
      }
    }

    const insertedAlumni = await Alumni.insertMany(alumni)
    console.log(`✅ Created ${insertedAlumni.length} alumni records`)

    // 3. Seed Alumni Funds (ENHANCED - 40% donation rate)
    console.log('\n💰 Seeding Alumni Funds...')
    const funds = []
    const purposes = ['general', 'infrastructure', 'scholarship', 'equipment', 'event', 'research', 'sports']
    const paymentMethods = ['upi', 'card', 'bank-transfer', 'cheque', 'cash']
    const donorPatterns = ['new-donor', 'occasional', 'frequent', 'regular']

    for (const alumnus of insertedAlumni) {
      // 40% chance of donation
      if (Math.random() < 0.4) {
        const donationCount = Math.floor(Math.random() * 4) + 1 // 1-4 donations
        for (let i = 0; i < donationCount; i++) {
          const amounts = [500, 1000, 2000, 5000, 10000, 15000, 25000, 50000, 75000, 100000]
          const amount = randomElement(amounts)
          const createdDate = new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000)
          
          funds.push({
            alumniId: alumnus._id,
            alumniName: alumnus.name,
            alumniEmail: alumnus.email,
            school: alumnus.school,
            amount: amount,
            currency: 'INR',
            donationType: Math.random() > 0.9 ? 'recurring' : 'one-time',
            purpose: randomElement(purposes),
            paymentMethod: randomElement(paymentMethods),
            transactionId: `TXN${Date.now()}${Math.floor(Math.random() * 100000)}`,
            status: Math.random() > 0.05 ? 'completed' : 'pending',
            receiptNumber: `GJTS-${alumnus.school.substring(0, 3).toUpperCase()}-${new Date().getFullYear()}-${Math.floor(Math.random() * 100000).toString().padStart(5, '0')}`,
            taxDeductible: true,
            notes: 'Thank you for your generous contribution!',
            aiAnalysis: {
              donorPattern: randomElement(donorPatterns),
              engagementScore: Math.floor(Math.random() * 100),
              recommendations: [
                'Send personalized thank you email',
                'Share impact report',
                'Invite to alumni events',
                'Request testimonial'
              ].slice(0, Math.floor(Math.random() * 3) + 1)
            },
            createdAt: createdDate,
            updatedAt: createdDate
          })
        }
      }
    }

    await AlumniFund.insertMany(funds)
    console.log(`✅ Created ${funds.length} fund records`)

    // 4. Seed Events (ENHANCED - 20 per school = 120 total)
    console.log('\n📅 Seeding Events...')
    const events = []
    const eventTypes = [
      { title: 'Alumni Meet', category: 'alumni-meet', description: 'Annual alumni gathering and networking event' },
      { title: 'Technical Workshop', category: 'workshop', description: 'Hands-on technical skills workshop' },
      { title: 'Career Guidance Session', category: 'career', description: 'Career counseling and guidance for students' },
      { title: 'Sports Day', category: 'sports', description: 'Annual sports and games competition' },
      { title: 'Cultural Fest', category: 'cultural', description: 'Cultural programs and performances' },
      { title: 'Industry Visit', category: 'educational', description: 'Visit to local industries and companies' },
      { title: 'Hackathon', category: 'competition', description: 'Coding competition and innovation challenge' },
      { title: 'Guest Lecture', category: 'seminar', description: 'Expert talk on industry trends' },
      { title: 'Job Fair', category: 'placement', description: 'Campus recruitment drive' },
      { title: 'Science Exhibition', category: 'exhibition', description: 'Student project showcase' }
    ]

    for (const school of schools) {
      for (let i = 0; i < 20; i++) {
        const eventType = randomElement(eventTypes)
        const daysAhead = Math.floor(Math.random() * 180) // Next 6 months
        const futureDate = new Date(Date.now() + daysAhead * 24 * 60 * 60 * 1000)
        
        events.push({
          title: `${eventType.title} ${2026 + Math.floor(i / 10)} - ${school}`,
          description: eventType.description,
          school: school,
          date: futureDate,
          time: ['09:00 AM', '10:00 AM', '11:00 AM', '02:00 PM', '03:00 PM', '04:00 PM'][Math.floor(Math.random() * 6)],
          venue: `${school} Campus - ${['Main Hall', 'Auditorium', 'Sports Ground', 'Lab Block', 'Conference Room'][Math.floor(Math.random() * 5)]}`,
          category: eventType.category,
          targetAudience: ['students', 'alumni', 'faculty'].filter(() => Math.random() > 0.3),
          maxAttendees: [50, 100, 150, 200, 250, 300][Math.floor(Math.random() * 6)],
          registeredCount: Math.floor(Math.random() * 100),
          status: daysAhead < 7 ? 'upcoming' : 'open',
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

    // 5. Seed Grants (ENHANCED - 15 grants)
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
      // Add more grants...
      {
        title: 'PM-YUVA Scheme - Youth Entrepreneurship Support',
        description: 'Support for youth entrepreneurship and skill development initiatives in technical institutions.',
        grantProvider: 'Ministry of Youth Affairs',
        providerType: 'government',
        amount: { min: 250000, max: 1000000, currency: 'INR' },
        eligibilityCriteria: [
          { criterion: 'Youth-focused programs', met: true },
          { criterion: 'Entrepreneurship training', met: true }
        ],
        applicationDeadline: new Date('2026-09-30'),
        grantUrl: 'https://yas.nic.in/schemes',
        category: 'entrepreneurship',
        targetBeneficiaries: ['technical schools', 'training centers'],
        aiEligibilityScore: 82,
        aiRecommendation: {
          shouldApply: true,
          reasoning: 'Good opportunity for entrepreneurship programs.',
          successProbability: 82,
          requiredDocuments: ['Program details', 'Budget plan', 'Impact assessment'],
          estimatedEffort: 'Medium'
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

    // Calculate total size
    const totalDocs = admins.length + insertedAlumni.length + funds.length + events.length + grants.length
    const estimatedSize = (
      (admins.length * 1) +
      (insertedAlumni.length * 1) +
      (funds.length * 1.5) +
      (events.length * 1.5) +
      (grants.length * 4)
    )

    // Summary
    console.log('\n' + '='.repeat(70))
    console.log('🎉 LARGE DATASET SEEDING COMPLETED!')
    console.log('='.repeat(70))
    console.log(`\n📊 Summary:`)
    console.log(`  - Admins: ${admins.length}`)
    console.log(`  - Alumni: ${insertedAlumni.length}`)
    console.log(`  - Funds: ${funds.length}`)
    console.log(`  - Events: ${events.length}`)
    console.log(`  - Grants: ${grants.length}`)
    console.log(`  - TOTAL DOCUMENTS: ${totalDocs}`)
    console.log(`  - Estimated Size: ~${Math.round(estimatedSize)} KB`)
    console.log(`  - Free Tier Usage: ~${((estimatedSize / 524288) * 100).toFixed(2)}%`)
    console.log(`\n🔐 Login Credentials:`)
    console.log(`  Super Admin: superadmin / super123`)
    console.log(`  School Admins: admin_ballari / ballari123 (etc.)`)
    console.log(`\n🌐 Access:`)
    console.log(`  Website: http://localhost:3000`)
    console.log(`  Dashboard: http://localhost:3000/dashboard/login`)
    console.log(`  Atlas: https://cloud.mongodb.com/`)
    console.log('='.repeat(70))

    await mongoose.disconnect()
    console.log('\n✅ Disconnected from MongoDB')
  } catch (error) {
    console.error('❌ Error seeding database:', error)
    process.exit(1)
  }
}

seedDatabase()
