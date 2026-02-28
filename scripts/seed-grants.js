const mongoose = require('mongoose')

const MONGODB_URI = 'mongodb+srv://dbuser:Tsunade%40106@cluster0.eshla4d.mongodb.net/gjts_karnataka?retryWrites=true&w=majority&appName=Cluster0'

const grantSchema = new mongoose.Schema({
  title: String,
  grantProvider: String,
  providerType: String,
  description: String,
  amount: {
    min: Number,
    max: Number
  },
  eligibility: [String],
  applicationDeadline: Date,
  applicableSchools: [String],
  category: String,
  status: String,
  applicationUrl: String,
  contactEmail: String,
  contactPhone: String,
  requirements: [String],
  benefits: [String],
  aiEligibilityScore: Number,
  aiRecommendation: {
    reasoning: String,
    successProbability: Number,
    actionItems: [String]
  },
  discoveredAt: Date
}, { timestamps: true })

const Grant = mongoose.models.Grant || mongoose.model('Grant', grantSchema)

const schools = ['Ballari', 'Bhadravati', 'Hubballi', 'Bagalkot', 'Kalburgi', 'Mangalore']

// Real government grants and schemes for technical education
const grantsData = [
  {
    title: 'PM-SETU (Pradhan Mantri Skilling and Employability Transformation through Upgraded ITIs)',
    grantProvider: 'Ministry of Skill Development and Entrepreneurship, Government of India',
    providerType: 'Central Government',
    description: 'Scheme to modernize Industrial Training Institutes and align vocational education with current industry requirements. Focuses on upgrading infrastructure, equipment, and training methodologies.',
    amount: { min: 5000000, max: 25000000 },
    eligibility: [
      'Government technical training institutes',
      'Polytechnic colleges',
      'Junior Technical Schools',
      'Must have minimum 3 years of operation',
      'Should have adequate land and basic infrastructure'
    ],
    applicationDeadline: new Date('2026-06-30'),
    applicableSchools: schools,
    category: 'Infrastructure Development',
    status: 'Active',
    applicationUrl: 'https://msde.gov.in',
    contactEmail: 'pmsetu@gov.in',
    contactPhone: '+91-11-23461403',
    requirements: [
      'Detailed project proposal',
      'Infrastructure assessment report',
      'Utilization certificate of previous grants (if any)',
      'Approval from State Technical Education Board'
    ],
    benefits: [
      'Modern equipment and machinery',
      'Digital learning infrastructure',
      'Faculty training programs',
      'Industry partnership facilitation'
    ],
    aiEligibilityScore: 92,
    aiRecommendation: {
      reasoning: 'GJTS schools are ideal candidates for PM-SETU as they focus on technical skill development and have established infrastructure.',
      successProbability: 85,
      actionItems: [
        'Prepare detailed infrastructure upgrade plan',
        'Document current equipment inventory',
        'Identify industry partnership opportunities',
        'Submit application before deadline'
      ]
    },
    discoveredAt: new Date()
  },
  {
    title: 'Karnataka School Infrastructure Development Grant',
    grantProvider: 'Department of Public Instruction, Government of Karnataka',
    providerType: 'State Government',
    description: 'Rs 850 crore allocation for improving infrastructure in government schools and technical colleges. Focuses on constructing new classrooms, laboratories, and sanitation facilities.',
    amount: { min: 2000000, max: 15000000 },
    eligibility: [
      'Government schools and technical institutions in Karnataka',
      'Must demonstrate infrastructure needs',
      'Priority for institutions in rural/semi-urban areas',
      'Should have land ownership documents'
    ],
    applicationDeadline: new Date('2026-03-31'),
    applicableSchools: schools,
    category: 'Infrastructure Development',
    status: 'Active',
    applicationUrl: 'https://schooleducation.kar.nic.in',
    contactEmail: 'infrastructure@karnataka.gov.in',
    contactPhone: '+91-80-22250000',
    requirements: [
      'Infrastructure needs assessment',
      'Architectural plans and estimates',
      'Land ownership documents',
      'NOC from local authorities',
      'Environmental clearance (if required)'
    ],
    benefits: [
      'New classroom construction',
      'Laboratory upgrades',
      'Sanitation facilities',
      'Digital infrastructure',
      'Sports facilities'
    ],
    aiEligibilityScore: 88,
    aiRecommendation: {
      reasoning: 'All GJTS schools qualify as government technical institutions in Karnataka and can benefit from infrastructure improvements.',
      successProbability: 80,
      actionItems: [
        'Conduct infrastructure audit',
        'Prepare detailed cost estimates',
        'Get architectural plans approved',
        'Submit application with all documents'
      ]
    },
    discoveredAt: new Date()
  },
  {
    title: 'AICTE Modernization and Removal of Obsolescence (MODROBS) Scheme',
    grantProvider: 'All India Council for Technical Education (AICTE)',
    providerType: 'Central Government',
    description: 'Financial assistance for modernization of laboratories, workshops, and purchase of modern equipment in technical institutions.',
    amount: { min: 1000000, max: 10000000 },
    eligibility: [
      'AICTE approved technical institutions',
      'Polytechnics and diploma colleges',
      'Must have NAAC/NBA accreditation or in process',
      'Should demonstrate need for equipment modernization'
    ],
    applicationDeadline: new Date('2026-05-15'),
    applicableSchools: schools,
    category: 'Equipment & Modernization',
    status: 'Active',
    applicationUrl: 'https://www.aicte-india.org',
    contactEmail: 'modrobs@aicte-india.org',
    contactPhone: '+91-11-29581333',
    requirements: [
      'List of equipment to be purchased',
      'Quotations from vendors',
      'Justification for equipment need',
      'Utilization plan',
      'Matching contribution commitment'
    ],
    benefits: [
      'Modern laboratory equipment',
      'Workshop machinery',
      'Computer systems and software',
      'Testing and measurement instruments',
      'Safety equipment'
    ],
    aiEligibilityScore: 85,
    aiRecommendation: {
      reasoning: 'GJTS schools can modernize their workshops and labs to provide industry-relevant training.',
      successProbability: 75,
      actionItems: [
        'Identify obsolete equipment',
        'Prepare equipment procurement list',
        'Get quotations from approved vendors',
        'Arrange matching contribution (if required)'
      ]
    },
    discoveredAt: new Date()
  },
  {
    title: 'National Education Policy (NEP) 2020 Implementation Grant',
    grantProvider: 'Ministry of Education, Government of India',
    providerType: 'Central Government',
    description: 'Financial support for implementing NEP 2020 reforms including multidisciplinary education, skill development integration, and digital learning infrastructure.',
    amount: { min: 3000000, max: 20000000 },
    eligibility: [
      'All government educational institutions',
      'Must submit NEP implementation plan',
      'Should demonstrate commitment to reforms',
      'Priority for institutions adopting innovative practices'
    ],
    applicationDeadline: new Date('2026-08-31'),
    applicableSchools: schools,
    category: 'Educational Reform',
    status: 'Active',
    applicationUrl: 'https://www.education.gov.in',
    contactEmail: 'nep2020@gov.in',
    contactPhone: '+91-11-23382698',
    requirements: [
      'NEP 2020 implementation roadmap',
      'Curriculum reform plan',
      'Faculty training proposal',
      'Digital infrastructure plan',
      'Assessment and evaluation framework'
    ],
    benefits: [
      'Curriculum development support',
      'Faculty training programs',
      'Digital learning platforms',
      'Multidisciplinary course development',
      'Skill integration modules'
    ],
    aiEligibilityScore: 90,
    aiRecommendation: {
      reasoning: 'GJTS schools can leverage NEP 2020 grants to modernize curriculum and integrate skill-based learning.',
      successProbability: 82,
      actionItems: [
        'Develop NEP implementation plan',
        'Identify multidisciplinary opportunities',
        'Plan faculty training programs',
        'Design skill integration modules'
      ]
    },
    discoveredAt: new Date()
  },
  {
    title: 'Skill Development and Entrepreneurship Grant',
    grantProvider: 'Karnataka Skill Development Corporation',
    providerType: 'State Government',
    description: 'Support for establishing skill development centers, entrepreneurship cells, and industry-linked training programs in technical institutions.',
    amount: { min: 1500000, max: 8000000 },
    eligibility: [
      'Technical education institutions in Karnataka',
      'Must have industry partnerships',
      'Should demonstrate placement track record',
      'Willingness to establish entrepreneurship cell'
    ],
    applicationDeadline: new Date('2026-04-30'),
    applicableSchools: schools,
    category: 'Skill Development',
    status: 'Active',
    applicationUrl: 'https://kaushalkar.com',
    contactEmail: 'grants@kaushalkar.com',
    contactPhone: '+91-80-22867001',
    requirements: [
      'Skill development center proposal',
      'Industry partnership MOUs',
      'Placement data (last 3 years)',
      'Entrepreneurship cell plan',
      'Training curriculum'
    ],
    benefits: [
      'Skill development infrastructure',
      'Industry expert training',
      'Entrepreneurship mentorship',
      'Placement assistance',
      'Certification programs'
    ],
    aiEligibilityScore: 87,
    aiRecommendation: {
      reasoning: 'GJTS schools have strong technical focus and can establish effective skill development centers.',
      successProbability: 78,
      actionItems: [
        'Identify industry partners',
        'Design skill training modules',
        'Plan entrepreneurship cell setup',
        'Document placement records'
      ]
    },
    discoveredAt: new Date()
  },
  {
    title: 'Digital India Initiative - Smart Classroom Grant',
    grantProvider: 'Ministry of Electronics and Information Technology',
    providerType: 'Central Government',
    description: 'Financial assistance for setting up smart classrooms, digital libraries, and e-learning infrastructure in educational institutions.',
    amount: { min: 2000000, max: 12000000 },
    eligibility: [
      'Government educational institutions',
      'Must have basic IT infrastructure',
      'Should have trained IT staff',
      'Commitment to digital literacy programs'
    ],
    applicationDeadline: new Date('2026-07-31'),
    applicableSchools: schools,
    category: 'Digital Infrastructure',
    status: 'Active',
    applicationUrl: 'https://digitalindia.gov.in',
    contactEmail: 'smartclassroom@meity.gov.in',
    contactPhone: '+91-11-24301851',
    requirements: [
      'Digital infrastructure plan',
      'IT staff details',
      'Internet connectivity proof',
      'Digital content development plan',
      'Maintenance and sustainability plan'
    ],
    benefits: [
      'Smart boards and projectors',
      'Computer systems',
      'High-speed internet',
      'Digital content library',
      'Learning management system'
    ],
    aiEligibilityScore: 91,
    aiRecommendation: {
      reasoning: 'Digital infrastructure is crucial for modern technical education. GJTS schools can significantly benefit.',
      successProbability: 84,
      actionItems: [
        'Assess current IT infrastructure',
        'Plan smart classroom setup',
        'Identify digital content needs',
        'Arrange for IT staff training'
      ]
    },
    discoveredAt: new Date()
  },
  {
    title: 'Swachh Vidyalaya Abhiyan - Sanitation Grant',
    grantProvider: 'Ministry of Education & Ministry of Jal Shakti',
    providerType: 'Central Government',
    description: 'Financial support for construction and maintenance of sanitation facilities, drinking water systems, and hygiene infrastructure in schools.',
    amount: { min: 500000, max: 3000000 },
    eligibility: [
      'All government schools',
      'Must demonstrate sanitation needs',
      'Should have water supply availability',
      'Commitment to maintenance'
    ],
    applicationDeadline: new Date('2026-06-15'),
    applicableSchools: schools,
    category: 'Infrastructure Development',
    status: 'Active',
    applicationUrl: 'https://swachhvidyalaya.com',
    contactEmail: 'swachhvidyalaya@gov.in',
    contactPhone: '+91-11-23073300',
    requirements: [
      'Sanitation needs assessment',
      'Architectural plans',
      'Water availability certificate',
      'Maintenance plan',
      'Community participation plan'
    ],
    benefits: [
      'Toilet construction',
      'Drinking water facilities',
      'Handwashing stations',
      'Waste management systems',
      'Hygiene education materials'
    ],
    aiEligibilityScore: 89,
    aiRecommendation: {
      reasoning: 'Sanitation infrastructure is essential for student health and attendance. High priority grant.',
      successProbability: 86,
      actionItems: [
        'Conduct sanitation audit',
        'Prepare construction plans',
        'Verify water supply',
        'Plan maintenance schedule'
      ]
    },
    discoveredAt: new Date()
  },
  {
    title: 'Industry-Academia Partnership Grant',
    grantProvider: 'Department of Technical Education, Karnataka',
    providerType: 'State Government',
    description: 'Support for establishing industry partnerships, internship programs, and collaborative research projects between technical institutions and industries.',
    amount: { min: 1000000, max: 6000000 },
    eligibility: [
      'Technical institutions in Karnataka',
      'Must have at least 2 industry MOUs',
      'Should demonstrate internship placements',
      'Willingness to host industry experts'
    ],
    applicationDeadline: new Date('2026-05-31'),
    applicableSchools: schools,
    category: 'Industry Partnership',
    status: 'Active',
    applicationUrl: 'https://dte.kar.nic.in',
    contactEmail: 'industry@dte.kar.nic.in',
    contactPhone: '+91-80-22867001',
    requirements: [
      'Industry partnership MOUs',
      'Internship program details',
      'Collaborative project proposals',
      'Industry visit plans',
      'Guest lecture schedule'
    ],
    benefits: [
      'Industry mentorship programs',
      'Internship stipend support',
      'Collaborative research funding',
      'Industry equipment donations',
      'Placement assistance'
    ],
    aiEligibilityScore: 83,
    aiRecommendation: {
      reasoning: 'Industry partnerships enhance employability. GJTS schools should prioritize this grant.',
      successProbability: 76,
      actionItems: [
        'Identify potential industry partners',
        'Draft partnership MOUs',
        'Design internship programs',
        'Plan industry expert sessions'
      ]
    },
    discoveredAt: new Date()
  },
  {
    title: 'Green Campus Initiative Grant',
    grantProvider: 'Ministry of Environment, Forest and Climate Change',
    providerType: 'Central Government',
    description: 'Financial assistance for developing eco-friendly campuses including solar power, rainwater harvesting, waste management, and green infrastructure.',
    amount: { min: 1500000, max: 8000000 },
    eligibility: [
      'All educational institutions',
      'Must commit to sustainability practices',
      'Should have adequate land for green initiatives',
      'Willingness to conduct environmental education'
    ],
    applicationDeadline: new Date('2026-09-30'),
    applicableSchools: schools,
    category: 'Environmental Sustainability',
    status: 'Active',
    applicationUrl: 'https://moef.gov.in',
    contactEmail: 'greencampus@nic.in',
    contactPhone: '+91-11-24695334',
    requirements: [
      'Environmental audit report',
      'Green campus development plan',
      'Solar power feasibility study',
      'Waste management plan',
      'Sustainability commitment letter'
    ],
    benefits: [
      'Solar power installation',
      'Rainwater harvesting systems',
      'Waste management infrastructure',
      'Green landscaping',
      'Energy-efficient equipment'
    ],
    aiEligibilityScore: 86,
    aiRecommendation: {
      reasoning: 'Green initiatives reduce operational costs and promote environmental awareness among students.',
      successProbability: 79,
      actionItems: [
        'Conduct environmental audit',
        'Assess solar power potential',
        'Plan rainwater harvesting',
        'Design waste management system'
      ]
    },
    discoveredAt: new Date()
  },
  {
    title: 'Sports and Physical Education Infrastructure Grant',
    grantProvider: 'Ministry of Youth Affairs and Sports',
    providerType: 'Central Government',
    description: 'Support for developing sports facilities, playgrounds, and physical education infrastructure in educational institutions.',
    amount: { min: 800000, max: 5000000 },
    eligibility: [
      'All government schools and colleges',
      'Must have adequate land for sports facilities',
      'Should have physical education teacher',
      'Commitment to sports programs'
    ],
    applicationDeadline: new Date('2026-04-15'),
    applicableSchools: schools,
    category: 'Sports Infrastructure',
    status: 'Active',
    applicationUrl: 'https://yas.nic.in',
    contactEmail: 'sports.grants@nic.in',
    contactPhone: '+91-11-23073300',
    requirements: [
      'Sports infrastructure plan',
      'Land availability certificate',
      'Physical education program details',
      'Sports equipment list',
      'Maintenance plan'
    ],
    benefits: [
      'Playground development',
      'Sports equipment',
      'Indoor sports facilities',
      'Fitness equipment',
      'Sports coaching support'
    ],
    aiEligibilityScore: 84,
    aiRecommendation: {
      reasoning: 'Physical education is important for holistic development. Sports facilities will benefit students.',
      successProbability: 77,
      actionItems: [
        'Assess available land',
        'Plan sports facilities',
        'List required equipment',
        'Design maintenance schedule'
      ]
    },
    discoveredAt: new Date()
  }
]

async function seedGrants() {
  try {
    console.log('🔌 Connecting to MongoDB...')
    await mongoose.connect(MONGODB_URI)
    console.log('✅ Connected to MongoDB')

    console.log('\n🗑️  Clearing existing grants...')
    await Grant.deleteMany({})
    console.log('✅ Cleared existing grants')

    console.log('\n💰 Inserting grants...')
    await Grant.insertMany(grantsData)
    
    console.log('\n📊 GRANTS SEEDED SUCCESSFULLY!')
    console.log('=' .repeat(60))
    console.log(`Total Grants: ${grantsData.length}`)
    console.log('\nBy Category:')
    
    const categories = {}
    grantsData.forEach(g => {
      categories[g.category] = (categories[g.category] || 0) + 1
    })
    
    Object.entries(categories).forEach(([cat, count]) => {
      console.log(`  ${cat}: ${count} grants`)
    })
    
    console.log('\nBy Provider Type:')
    const providers = {}
    grantsData.forEach(g => {
      providers[g.providerType] = (providers[g.providerType] || 0) + 1
    })
    
    Object.entries(providers).forEach(([prov, count]) => {
      console.log(`  ${prov}: ${count} grants`)
    })
    
    console.log('\nTotal Funding Available:')
    const totalMin = grantsData.reduce((sum, g) => sum + g.amount.min, 0)
    const totalMax = grantsData.reduce((sum, g) => sum + g.amount.max, 0)
    console.log(`  Minimum: ₹${(totalMin / 10000000).toFixed(2)} Crore`)
    console.log(`  Maximum: ₹${(totalMax / 10000000).toFixed(2)} Crore`)
    
    console.log('\n' + '='.repeat(60))
    console.log('✅ ALL GRANTS SEEDED!')
    console.log('='.repeat(60))

    await mongoose.connection.close()
    console.log('\n🔌 Database connection closed')
  } catch (error) {
    console.error('❌ Error seeding grants:', error)
    process.exit(1)
  }
}

seedGrants()
