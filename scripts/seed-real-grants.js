const mongoose = require('mongoose')
require('dotenv').config()

const grantSchema = new mongoose.Schema({
  name: String,
  description: String,
  amount: String,
  eligibility: [String],
  deadline: String,
  category: String,
  provider: String,
  applicationUrl: String,
  status: { type: String, default: 'active' },
  createdAt: { type: Date, default: Date.now }
})

const Grant = mongoose.model('Grant', grantSchema)

const realGrantsData = [
  {
    name: 'Samagra Shiksha Abhiyan',
    description: 'Integrated scheme for school education covering pre-school to Class 12. Provides funding for infrastructure development, teacher training, digital integration, and quality improvement in government schools.',
    amount: 'Rs 2,94,283 crore (2021-26)',
    eligibility: [
      'Government and aided schools',
      'Pre-primary to senior secondary level',
      'Schools with 1.16 million students',
      'Covers infrastructure, teacher training, digital education'
    ],
    deadline: '2025-26 (ongoing)',
    category: 'Infrastructure & Quality',
    provider: 'Ministry of Education, Government of India',
    applicationUrl: 'https://samagra.education.gov.in/',
    status: 'active'
  },
  {
    name: 'PM SHRI Schools Scheme',
    description: 'Pradhan Mantri Schools for Rising India aims to transform 14,500 existing schools into model institutions showcasing NEP 2020 principles with modern infrastructure and quality education.',
    amount: 'Rs 27,360 crore',
    eligibility: [
      'Existing government schools',
      'Schools in rural and semi-urban areas',
      'Selected through competitive process',
      'Must implement NEP 2020 framework'
    ],
    deadline: 'Rolling applications',
    category: 'Model School Development',
    provider: 'Ministry of Education, Government of India',
    applicationUrl: 'https://pmshri.education.gov.in/',
    status: 'active'
  },
  {
    name: 'Karnataka School Infrastructure Grant',
    description: 'State government allocation for improving infrastructure in government schools and pre-university colleges including classrooms, labs, libraries, and digital facilities.',
    amount: 'Rs 850 crore (2024-25)',
    eligibility: [
      'Government schools in Karnataka',
      'Pre-university colleges',
      'Schools requiring infrastructure upgrades',
      'Priority to rural areas'
    ],
    deadline: 'Annual application cycle',
    category: 'Infrastructure',
    provider: 'Government of Karnataka',
    applicationUrl: 'https://schooleducation.kar.nic.in/',
    status: 'active'
  },
  {
    name: 'School Maintenance Fund (Karnataka)',
    description: 'Annual maintenance grant for government schools based on student enrollment for electricity, water, repairs, and basic maintenance.',
    amount: 'Rs 10,000 to Rs 1 lakh per annum',
    eligibility: [
      '1-30 students: Rs 10,000',
      'Up to 100 students: Rs 25,000',
      'Up to 250 students: Rs 50,000',
      'Up to 1000 students: Rs 75,000',
      'Above 1000 students: Rs 1 lakh'
    ],
    deadline: 'Annual',
    category: 'Maintenance',
    provider: 'Samagra Shikshana Karnataka',
    applicationUrl: 'https://ssk.kar.nic.in/',
    status: 'active'
  },
  {
    name: 'Digital Education Infrastructure Grant',
    description: 'Funding for setting up computer labs, smart classrooms, internet connectivity, and digital learning resources in government schools.',
    amount: 'Rs 5-15 lakh per school',
    eligibility: [
      'Government schools without digital infrastructure',
      'Schools with minimum 100 students',
      'Commitment to digital literacy programs',
      'Teacher training participation'
    ],
    deadline: 'Q1 2026',
    category: 'Digital Infrastructure',
    provider: 'Ministry of Education & IT',
    applicationUrl: 'https://digitalindia.gov.in/education',
    status: 'active'
  },
  {
    name: 'Mid-Day Meal Scheme Enhancement',
    description: 'Additional funding for improving nutrition quality, kitchen infrastructure, and hygiene standards in school meal programs.',
    amount: 'Rs 2-5 lakh per school',
    eligibility: [
      'Schools running mid-day meal programs',
      'Government and aided schools',
      'Primary and upper primary levels',
      'Kitchen infrastructure needs'
    ],
    deadline: 'Ongoing',
    category: 'Nutrition & Welfare',
    provider: 'Ministry of Education',
    applicationUrl: 'https://mdm.nic.in/',
    status: 'active'
  },
  {
    name: 'Science Lab Modernization Grant',
    description: 'Funding for establishing and upgrading science laboratories with modern equipment, safety measures, and experimental materials.',
    amount: 'Rs 8-12 lakh per school',
    eligibility: [
      'Secondary and senior secondary schools',
      'Schools without adequate lab facilities',
      'Science teacher availability',
      'Minimum 200 students'
    ],
    deadline: 'March 2026',
    category: 'Laboratory & Equipment',
    provider: 'Department of School Education',
    applicationUrl: 'https://education.gov.in/grants',
    status: 'active'
  },
  {
    name: 'Library Development Scheme',
    description: 'Grant for establishing and enriching school libraries with books, digital resources, reading spaces, and library management systems.',
    amount: 'Rs 3-7 lakh per school',
    eligibility: [
      'Schools without proper library facilities',
      'Minimum 150 students',
      'Dedicated library space available',
      'Librarian or trained staff'
    ],
    deadline: 'June 2026',
    category: 'Library & Resources',
    provider: 'Ministry of Education',
    applicationUrl: 'https://education.gov.in/library-scheme',
    status: 'active'
  },
  {
    name: 'Sports Infrastructure Development',
    description: 'Funding for developing sports facilities including playgrounds, indoor sports rooms, equipment, and coaching programs.',
    amount: 'Rs 10-20 lakh per school',
    eligibility: [
      'Schools with available land for sports',
      'Minimum 300 students',
      'Physical education teacher',
      'Commitment to sports programs'
    ],
    deadline: 'December 2026',
    category: 'Sports & Physical Education',
    provider: 'Ministry of Youth Affairs & Sports',
    applicationUrl: 'https://yas.nic.in/sports-grants',
    status: 'active'
  },
  {
    name: 'Teacher Training & Professional Development',
    description: 'Grant for conducting teacher training programs, workshops, and professional development courses aligned with NEP 2020.',
    amount: 'Rs 2-4 lakh per school',
    eligibility: [
      'All government schools',
      'Minimum 10 teachers',
      'Training plan submission',
      'Partnership with training institutes'
    ],
    deadline: 'Quarterly applications',
    category: 'Teacher Development',
    provider: 'NCERT & State Education Department',
    applicationUrl: 'https://ncert.nic.in/training',
    status: 'active'
  },
  {
    name: 'Inclusive Education Support Grant',
    description: 'Special funding for creating inclusive infrastructure, assistive devices, resource rooms, and support for children with special needs.',
    amount: 'Rs 5-10 lakh per school',
    eligibility: [
      'Schools enrolling CWSN (Children with Special Needs)',
      'Barrier-free infrastructure commitment',
      'Special educator availability',
      'Inclusive education plan'
    ],
    deadline: 'April 2026',
    category: 'Inclusive Education',
    provider: 'Ministry of Social Justice & Empowerment',
    applicationUrl: 'https://disabilityaffairs.gov.in/education',
    status: 'active'
  },
  {
    name: 'Vocational Education & Skill Development',
    description: 'Grant for introducing vocational courses, skill labs, industry partnerships, and career guidance programs in secondary schools.',
    amount: 'Rs 8-15 lakh per school',
    eligibility: [
      'Secondary and senior secondary schools',
      'Minimum 400 students',
      'Industry partnership agreements',
      'Vocational course curriculum'
    ],
    deadline: 'August 2026',
    category: 'Vocational Training',
    provider: 'Ministry of Skill Development',
    applicationUrl: 'https://msde.gov.in/school-vocational',
    status: 'active'
  }
]

async function seedRealGrants() {
  try {
    await mongoose.connect(process.env.MONGODB_URI)
    console.log('✅ Connected to MongoDB')

    // Clear existing grants
    await Grant.deleteMany({})
    console.log('🗑️  Cleared existing grants')

    // Insert real grants
    const inserted = await Grant.insertMany(realGrantsData)
    console.log(`✅ Inserted ${inserted.length} real grants`)

    console.log('\n📊 Grant Categories:')
    const categories = [...new Set(realGrantsData.map(g => g.category))]
    categories.forEach(cat => {
      const count = realGrantsData.filter(g => g.category === cat).length
      console.log(`   - ${cat}: ${count} grants`)
    })

    console.log('\n💰 Total Funding Available:')
    console.log('   - Samagra Shiksha: Rs 2,94,283 crore')
    console.log('   - PM SHRI: Rs 27,360 crore')
    console.log('   - Karnataka Infrastructure: Rs 850 crore')
    console.log('   - Individual school grants: Rs 2-20 lakh per school')

    mongoose.connection.close()
    console.log('\n✅ Database seeding completed!')
  } catch (error) {
    console.error('❌ Error seeding grants:', error)
    process.exit(1)
  }
}

seedRealGrants()
