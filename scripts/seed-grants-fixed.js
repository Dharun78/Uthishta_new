const mongoose = require('mongoose')
require('dotenv').config()

const grantSchema = new mongoose.Schema({
  title: String,
  description: String,
  grantProvider: String,
  providerType: String,
  amount: {
    min: Number,
    max: Number,
    currency: String
  },
  totalAmount: String,
  perSchoolAmount: String,
  eligibilityCriteria: [{
    criterion: String,
    met: Boolean,
    notes: String
  }],
  applicationDeadline: Date,
  applicationUrl: String,
  category: String,
  status: String,
  discoveredBy: String,
  applicableSchools: [String],
  discoveredAt: Date,
  lastUpdated: Date
})

const Grant = mongoose.models.Grant || mongoose.model('Grant', grantSchema)

const realGrantsData = [
  {
    title: 'Samagra Shiksha Abhiyan',
    description: 'Integrated scheme for school education covering pre-school to Class 12. Provides funding for infrastructure development, teacher training, digital integration, and quality improvement in government schools.',
    grantProvider: 'Ministry of Education, Government of India',
    providerType: 'government',
    amount: {
      min: 500000,
      max: 5000000,
      currency: 'INR'
    },
    totalAmount: 'Rs 2,94,283 crore (2021-26)',
    perSchoolAmount: 'Rs 5-50 lakh per school',
    eligibilityCriteria: [
      { criterion: 'Government and aided schools', met: false, notes: '' },
      { criterion: 'Pre-primary to senior secondary level', met: false, notes: '' },
      { criterion: 'Covers infrastructure, teacher training, digital education', met: false, notes: '' }
    ],
    applicationDeadline: new Date('2026-03-31'),
    applicationUrl: 'https://samagra.education.gov.in/',
    category: 'infrastructure',
    status: 'discovered',
    discoveredBy: 'manual',
    applicableSchools: ['Ballari', 'Bhadravati', 'Hubballi', 'Bagalkot', 'Kalburgi', 'Mangalore'],
    discoveredAt: new Date(),
    lastUpdated: new Date()
  },
  {
    title: 'PM SHRI Schools Scheme',
    description: 'Pradhan Mantri Schools for Rising India aims to transform 14,500 existing schools into model institutions showcasing NEP 2020 principles with modern infrastructure and quality education.',
    grantProvider: 'Ministry of Education, Government of India',
    providerType: 'government',
    amount: {
      min: 2000000,
      max: 10000000,
      currency: 'INR'
    },
    totalAmount: 'Rs 27,360 crore',
    perSchoolAmount: 'Rs 20 lakh - 1 crore per school',
    eligibilityCriteria: [
      { criterion: 'Existing government schools', met: false, notes: '' },
      { criterion: 'Schools in rural and semi-urban areas', met: false, notes: '' },
      { criterion: 'Must implement NEP 2020 framework', met: false, notes: '' }
    ],
    applicationDeadline: new Date('2026-12-31'),
    applicationUrl: 'https://pmshri.education.gov.in/',
    category: 'infrastructure',
    status: 'discovered',
    discoveredBy: 'manual',
    applicableSchools: ['Ballari', 'Bhadravati', 'Hubballi', 'Bagalkot', 'Kalburgi', 'Mangalore'],
    discoveredAt: new Date(),
    lastUpdated: new Date()
  },
  {
    title: 'Karnataka School Infrastructure Grant',
    description: 'State government allocation for improving infrastructure in government schools and pre-university colleges including classrooms, labs, libraries, and digital facilities.',
    grantProvider: 'Government of Karnataka',
    providerType: 'government',
    amount: {
      min: 5000000,
      max: 20000000,
      currency: 'INR'
    },
    totalAmount: 'Rs 850 crore (2024-25)',
    perSchoolAmount: 'Rs 50 lakh - 2 crore per school',
    eligibilityCriteria: [
      { criterion: 'Government schools in Karnataka', met: false, notes: '' },
      { criterion: 'Pre-university colleges', met: false, notes: '' },
      { criterion: 'Schools requiring infrastructure upgrades', met: false, notes: '' }
    ],
    applicationDeadline: new Date('2026-03-31'),
    applicationUrl: 'https://schooleducation.kar.nic.in/',
    category: 'infrastructure',
    status: 'discovered',
    discoveredBy: 'manual',
    applicableSchools: ['Ballari', 'Bhadravati', 'Hubballi', 'Bagalkot', 'Kalburgi', 'Mangalore'],
    discoveredAt: new Date(),
    lastUpdated: new Date()
  },
  {
    title: 'School Maintenance Fund (Karnataka)',
    description: 'Annual maintenance grant for government schools based on student enrollment for electricity, water, repairs, and basic maintenance.',
    grantProvider: 'Samagra Shikshana Karnataka',
    providerType: 'government',
    amount: {
      min: 10000,
      max: 100000,
      currency: 'INR'
    },
    totalAmount: 'Rs 100 crore annually',
    perSchoolAmount: 'Rs 10,000 to Rs 1 lakh per school per annum',
    eligibilityCriteria: [
      { criterion: '1-30 students: Rs 10,000', met: false, notes: '' },
      { criterion: 'Up to 100 students: Rs 25,000', met: false, notes: '' },
      { criterion: 'Up to 250 students: Rs 50,000', met: false, notes: '' },
      { criterion: 'Up to 1000 students: Rs 75,000', met: false, notes: '' }
    ],
    applicationDeadline: new Date('2026-12-31'),
    applicationUrl: 'https://ssk.kar.nic.in/',
    category: 'infrastructure',
    status: 'discovered',
    discoveredBy: 'manual',
    applicableSchools: ['Ballari', 'Bhadravati', 'Hubballi', 'Bagalkot', 'Kalburgi', 'Mangalore'],
    discoveredAt: new Date(),
    lastUpdated: new Date()
  },
  {
    title: 'Digital Education Infrastructure Grant',
    description: 'Funding for setting up computer labs, smart classrooms, internet connectivity, and digital learning resources in government schools.',
    grantProvider: 'Ministry of Education & IT',
    providerType: 'government',
    amount: {
      min: 500000,
      max: 1500000,
      currency: 'INR'
    },
    totalAmount: 'Rs 5,000 crore',
    perSchoolAmount: 'Rs 5-15 lakh per school',
    eligibilityCriteria: [
      { criterion: 'Government schools without digital infrastructure', met: false, notes: '' },
      { criterion: 'Schools with minimum 100 students', met: false, notes: '' },
      { criterion: 'Commitment to digital literacy programs', met: false, notes: '' }
    ],
    applicationDeadline: new Date('2026-03-31'),
    applicationUrl: 'https://digitalindia.gov.in/education',
    category: 'technology',
    status: 'discovered',
    discoveredBy: 'manual',
    applicableSchools: ['Ballari', 'Bhadravati', 'Hubballi', 'Bagalkot', 'Kalburgi', 'Mangalore'],
    discoveredAt: new Date(),
    lastUpdated: new Date()
  },
  {
    title: 'Mid-Day Meal Scheme Enhancement',
    description: 'Additional funding for improving nutrition quality, kitchen infrastructure, and hygiene standards in school meal programs.',
    grantProvider: 'Ministry of Education',
    providerType: 'government',
    amount: {
      min: 200000,
      max: 500000,
      currency: 'INR'
    },
    totalAmount: 'Rs 12,000 crore annually',
    perSchoolAmount: 'Rs 2-5 lakh per school',
    eligibilityCriteria: [
      { criterion: 'Schools running mid-day meal programs', met: false, notes: '' },
      { criterion: 'Government and aided schools', met: false, notes: '' },
      { criterion: 'Primary and upper primary levels', met: false, notes: '' }
    ],
    applicationDeadline: new Date('2026-12-31'),
    applicationUrl: 'https://mdm.nic.in/',
    category: 'other',
    status: 'discovered',
    discoveredBy: 'manual',
    applicableSchools: ['Ballari', 'Bhadravati', 'Hubballi', 'Bagalkot', 'Kalburgi', 'Mangalore'],
    discoveredAt: new Date(),
    lastUpdated: new Date()
  },
  {
    title: 'Science Lab Modernization Grant',
    description: 'Funding for establishing and upgrading science laboratories with modern equipment, safety measures, and experimental materials.',
    grantProvider: 'Department of School Education',
    providerType: 'government',
    amount: {
      min: 800000,
      max: 1200000,
      currency: 'INR'
    },
    totalAmount: 'Rs 2,500 crore',
    perSchoolAmount: 'Rs 8-12 lakh per school',
    eligibilityCriteria: [
      { criterion: 'Secondary and senior secondary schools', met: false, notes: '' },
      { criterion: 'Schools without adequate lab facilities', met: false, notes: '' },
      { criterion: 'Minimum 200 students', met: false, notes: '' }
    ],
    applicationDeadline: new Date('2026-03-31'),
    applicationUrl: 'https://education.gov.in/grants',
    category: 'infrastructure',
    status: 'discovered',
    discoveredBy: 'manual',
    applicableSchools: ['Ballari', 'Bhadravati', 'Hubballi', 'Bagalkot', 'Kalburgi', 'Mangalore'],
    discoveredAt: new Date(),
    lastUpdated: new Date()
  },
  {
    title: 'Library Development Scheme',
    description: 'Grant for establishing and enriching school libraries with books, digital resources, reading spaces, and library management systems.',
    grantProvider: 'Ministry of Education',
    providerType: 'government',
    amount: {
      min: 300000,
      max: 700000,
      currency: 'INR'
    },
    totalAmount: 'Rs 1,500 crore',
    perSchoolAmount: 'Rs 3-7 lakh per school',
    eligibilityCriteria: [
      { criterion: 'Schools without proper library facilities', met: false, notes: '' },
      { criterion: 'Minimum 150 students', met: false, notes: '' },
      { criterion: 'Dedicated library space available', met: false, notes: '' }
    ],
    applicationDeadline: new Date('2026-06-30'),
    applicationUrl: 'https://education.gov.in/library-scheme',
    category: 'education',
    status: 'discovered',
    discoveredBy: 'manual',
    applicableSchools: ['Ballari', 'Bhadravati', 'Hubballi', 'Bagalkot', 'Kalburgi', 'Mangalore'],
    discoveredAt: new Date(),
    lastUpdated: new Date()
  },
  {
    title: 'Sports Infrastructure Development',
    description: 'Funding for developing sports facilities including playgrounds, indoor sports rooms, equipment, and coaching programs.',
    grantProvider: 'Ministry of Youth Affairs & Sports',
    providerType: 'government',
    amount: {
      min: 1000000,
      max: 2000000,
      currency: 'INR'
    },
    totalAmount: 'Rs 3,000 crore',
    perSchoolAmount: 'Rs 10-20 lakh per school',
    eligibilityCriteria: [
      { criterion: 'Schools with available land for sports', met: false, notes: '' },
      { criterion: 'Minimum 300 students', met: false, notes: '' },
      { criterion: 'Physical education teacher', met: false, notes: '' }
    ],
    applicationDeadline: new Date('2026-12-31'),
    applicationUrl: 'https://yas.nic.in/sports-grants',
    category: 'infrastructure',
    status: 'discovered',
    discoveredBy: 'manual',
    applicableSchools: ['Ballari', 'Bhadravati', 'Hubballi', 'Bagalkot', 'Kalburgi', 'Mangalore'],
    discoveredAt: new Date(),
    lastUpdated: new Date()
  },
  {
    title: 'Teacher Training & Professional Development',
    description: 'Grant for conducting teacher training programs, workshops, and professional development courses aligned with NEP 2020.',
    grantProvider: 'NCERT & State Education Department',
    providerType: 'government',
    amount: {
      min: 200000,
      max: 400000,
      currency: 'INR'
    },
    totalAmount: 'Rs 1,000 crore',
    perSchoolAmount: 'Rs 2-4 lakh per school',
    eligibilityCriteria: [
      { criterion: 'All government schools', met: false, notes: '' },
      { criterion: 'Minimum 10 teachers', met: false, notes: '' },
      { criterion: 'Training plan submission', met: false, notes: '' }
    ],
    applicationDeadline: new Date('2026-12-31'),
    applicationUrl: 'https://ncert.nic.in/training',
    category: 'education',
    status: 'discovered',
    discoveredBy: 'manual',
    applicableSchools: ['Ballari', 'Bhadravati', 'Hubballi', 'Bagalkot', 'Kalburgi', 'Mangalore'],
    discoveredAt: new Date(),
    lastUpdated: new Date()
  },
  {
    title: 'Inclusive Education Support Grant',
    description: 'Special funding for creating inclusive infrastructure, assistive devices, resource rooms, and support for children with special needs.',
    grantProvider: 'Ministry of Social Justice & Empowerment',
    providerType: 'government',
    amount: {
      min: 500000,
      max: 1000000,
      currency: 'INR'
    },
    totalAmount: 'Rs 2,000 crore',
    perSchoolAmount: 'Rs 5-10 lakh per school',
    eligibilityCriteria: [
      { criterion: 'Schools enrolling CWSN (Children with Special Needs)', met: false, notes: '' },
      { criterion: 'Barrier-free infrastructure commitment', met: false, notes: '' },
      { criterion: 'Special educator availability', met: false, notes: '' }
    ],
    applicationDeadline: new Date('2026-04-30'),
    applicationUrl: 'https://disabilityaffairs.gov.in/education',
    category: 'education',
    status: 'discovered',
    discoveredBy: 'manual',
    applicableSchools: ['Ballari', 'Bhadravati', 'Hubballi', 'Bagalkot', 'Kalburgi', 'Mangalore'],
    discoveredAt: new Date(),
    lastUpdated: new Date()
  },
  {
    title: 'Vocational Education & Skill Development',
    description: 'Grant for introducing vocational courses, skill labs, industry partnerships, and career guidance programs in secondary schools.',
    grantProvider: 'Ministry of Skill Development',
    providerType: 'government',
    amount: {
      min: 800000,
      max: 1500000,
      currency: 'INR'
    },
    totalAmount: 'Rs 4,000 crore',
    perSchoolAmount: 'Rs 8-15 lakh per school',
    eligibilityCriteria: [
      { criterion: 'Secondary and senior secondary schools', met: false, notes: '' },
      { criterion: 'Minimum 400 students', met: false, notes: '' },
      { criterion: 'Industry partnership agreements', met: false, notes: '' }
    ],
    applicationDeadline: new Date('2026-08-31'),
    applicationUrl: 'https://msde.gov.in/school-vocational',
    category: 'skill-development',
    status: 'discovered',
    discoveredBy: 'manual',
    applicableSchools: ['Ballari', 'Bhadravati', 'Hubballi', 'Bagalkot', 'Kalburgi', 'Mangalore'],
    discoveredAt: new Date(),
    lastUpdated: new Date()
  }
]

async function seedGrantsFixed() {
  try {
    await mongoose.connect(process.env.MONGODB_URI)
    console.log('✅ Connected to MongoDB')

    // Clear existing grants
    await Grant.deleteMany({})
    console.log('🗑️  Cleared existing grants')

    // Insert real grants with proper schema
    const inserted = await Grant.insertMany(realGrantsData)
    console.log(`✅ Inserted ${inserted.length} grants with proper schema`)

    console.log('\n📊 Grant Summary:')
    console.log(`   Total Grants: ${inserted.length}`)
    console.log(`   All grants now have:`)
    console.log(`   - totalAmount: Total scheme budget`)
    console.log(`   - perSchoolAmount: Amount per school`)
    console.log(`   - Proper schema matching Grant model`)

    mongoose.connection.close()
    console.log('\n✅ Database seeding completed!')
  } catch (error) {
    console.error('❌ Error seeding grants:', error)
    process.exit(1)
  }
}

seedGrantsFixed()
