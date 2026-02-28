const mongoose = require('mongoose')

// MongoDB URI - update this if needed
const MONGODB_URI = 'mongodb+srv://dbuser:Tsunade%40106@cluster0.eshla4d.mongodb.net/gjts_karnataka?retryWrites=true&w=majority&appName=Cluster0'

// Define schemas
const alumniSchema = new mongoose.Schema({
  name: String,
  email: String,
  phone: String,
  school: String,
  graduationYear: Number,
  currentOccupation: String,
  company: String,
  city: String,
  message: String,
  status: String,
  registeredAt: Date
}, { timestamps: true })

const alumniFundSchema = new mongoose.Schema({
  alumniId: mongoose.Schema.Types.ObjectId,
  alumniName: String,
  alumniEmail: String,
  school: String,
  amount: Number,
  purpose: String,
  status: String,
  createdAt: Date
}, { timestamps: true })

const Alumni = mongoose.models.Alumni || mongoose.model('Alumni', alumniSchema)
const AlumniFund = mongoose.models.AlumniFund || mongoose.model('AlumniFund', alumniFundSchema)

const schools = ['Ballari', 'Bhadravati', 'Hubballi', 'Bagalkot', 'Kalburgi', 'Mangalore']

const firstNames = [
  'Rajesh', 'Priya', 'Amit', 'Sneha', 'Vikram', 'Anjali', 'Karthik', 'Divya',
  'Suresh', 'Lakshmi', 'Arun', 'Meera', 'Ravi', 'Pooja', 'Manoj', 'Kavya',
  'Sanjay', 'Nisha', 'Deepak', 'Swati', 'Ramesh', 'Anita', 'Prakash', 'Rekha',
  'Naveen', 'Shweta', 'Ganesh', 'Madhuri', 'Ashok', 'Sunita', 'Vijay', 'Asha'
]

const lastNames = [
  'Kumar', 'Sharma', 'Reddy', 'Patel', 'Singh', 'Rao', 'Nair', 'Iyer',
  'Desai', 'Joshi', 'Kulkarni', 'Hegde', 'Shetty', 'Bhat', 'Menon', 'Pillai'
]

const occupations = [
  'Software Engineer', 'Data Scientist', 'Product Manager', 'DevOps Engineer',
  'Full Stack Developer', 'UI/UX Designer', 'Business Analyst', 'Project Manager',
  'Quality Assurance Engineer', 'System Administrator', 'Network Engineer',
  'Database Administrator', 'Cloud Architect', 'Security Analyst', 'Technical Lead',
  'Mechanical Engineer', 'Electrical Engineer', 'Civil Engineer', 'Entrepreneur',
  'Consultant', 'Research Scientist'
]

const companies = [
  'Infosys', 'TCS', 'Wipro', 'Accenture', 'Cognizant', 'HCL Technologies',
  'Tech Mahindra', 'Capgemini', 'IBM', 'Microsoft', 'Google', 'Amazon',
  'Flipkart', 'Swiggy', 'Zomato', 'Paytm', 'PhonePe', 'Razorpay',
  'Freshworks', 'Zoho', 'Mindtree', 'Mphasis', 'L&T Infotech', 'Persistent Systems',
  'Bosch', 'Siemens', 'ABB', 'Schneider Electric'
]

const cities = [
  'Bangalore', 'Mumbai', 'Pune', 'Hyderabad', 'Chennai', 'Delhi', 'Gurgaon',
  'Noida', 'Kolkata', 'Ahmedabad', 'Mysore', 'Mangalore', 'Hubli', 'Belgaum'
]

const purposes = ['general', 'infrastructure', 'scholarship', 'equipment', 'event']

function getRandomItem(array) {
  return array[Math.floor(Math.random() * array.length)]
}

function generatePhone() {
  return `+91 ${Math.floor(Math.random() * 90000) + 10000} ${Math.floor(Math.random() * 90000) + 10000}`
}

function getRandomAmount() {
  const amounts = [5000, 10000, 15000, 20000, 25000, 50000, 75000, 100000, 150000, 200000]
  return amounts[Math.floor(Math.random() * amounts.length)]
}

async function seedAllData() {
  try {
    console.log('🔌 Connecting to MongoDB...')
    await mongoose.connect(MONGODB_URI)
    console.log('✅ Connected to MongoDB')

    // Clear existing data
    console.log('\n🗑️  Clearing existing data...')
    await Alumni.deleteMany({})
    await AlumniFund.deleteMany({})
    console.log('✅ Cleared existing alumni and funds')

    const alumniData = []
    const fundData = []

    console.log('\n📝 Generating data...')

    // Generate 50 alumni per school (300 total)
    for (const school of schools) {
      console.log(`  Generating data for ${school}...`)
      
      for (let i = 0; i < 50; i++) {
        const firstName = getRandomItem(firstNames)
        const lastName = getRandomItem(lastNames)
        const name = `${firstName} ${lastName}`
        const schoolCode = school.substring(0, 3).toLowerCase()
        const email = `${firstName.toLowerCase()}.${lastName.toLowerCase()}.${schoolCode}${i}@gmail.com`
        const graduationYear = 2010 + Math.floor(Math.random() * 15) // 2010-2024
        
        const alumnus = {
          name,
          email,
          phone: generatePhone(),
          school,
          graduationYear,
          currentOccupation: getRandomItem(occupations),
          company: getRandomItem(companies),
          city: getRandomItem(cities),
          message: '',
          status: 'approved',
          registeredAt: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000)
        }
        
        alumniData.push(alumnus)
      }
    }

    console.log(`\n💾 Inserting ${alumniData.length} alumni...`)
    const insertedAlumni = await Alumni.insertMany(alumniData)
    console.log('✅ Alumni inserted successfully')

    // Generate donations (40% of alumni donate)
    console.log('\n💰 Generating donation data...')
    let donationCounter = 0
    for (const alumnus of insertedAlumni) {
      // 40% chance of donation
      if (Math.random() < 0.4) {
        const year = new Date().getFullYear()
        const receiptNum = `GJTS-${alumnus.school.substring(0, 3).toUpperCase()}-${year}-${donationCounter.toString().padStart(4, '0')}`
        donationCounter++
        
        fundData.push({
          alumniId: alumnus._id,
          alumniName: alumnus.name,
          alumniEmail: alumnus.email,
          school: alumnus.school,
          amount: getRandomAmount(),
          purpose: getRandomItem(purposes),
          paymentMethod: 'upi',
          status: 'completed',
          receiptNumber: receiptNum,
          createdAt: new Date(Date.now() - Math.random() * 180 * 24 * 60 * 60 * 1000) // Last 6 months
        })
      }
    }

    console.log(`💾 Inserting ${fundData.length} donations...`)
    await AlumniFund.insertMany(fundData)
    console.log('✅ Donations inserted successfully')

    // Show statistics
    console.log('\n📊 DATABASE STATISTICS')
    console.log('=' .repeat(50))
    
    console.log('\n👥 ALUMNI:')
    console.log(`  Total: ${insertedAlumni.length}`)
    for (const school of schools) {
      const count = await Alumni.countDocuments({ school })
      console.log(`  ${school}: ${count}`)
    }

    console.log('\n💰 DONATIONS:')
    console.log(`  Total: ${fundData.length}`)
    const totalAmount = fundData.reduce((sum, d) => sum + d.amount, 0)
    console.log(`  Total Amount: ₹${totalAmount.toLocaleString('en-IN')}`)
    
    for (const school of schools) {
      const count = await AlumniFund.countDocuments({ school })
      const schoolFunds = await AlumniFund.find({ school })
      const schoolTotal = schoolFunds.reduce((sum, d) => sum + d.amount, 0)
      console.log(`  ${school}: ${count} donations, ₹${schoolTotal.toLocaleString('en-IN')}`)
    }

    console.log('\n💡 BY PURPOSE:')
    for (const purpose of purposes) {
      const count = await AlumniFund.countDocuments({ purpose })
      const purposeFunds = await AlumniFund.find({ purpose })
      const purposeTotal = purposeFunds.reduce((sum, d) => sum + d.amount, 0)
      console.log(`  ${purpose}: ${count} donations, ₹${purposeTotal.toLocaleString('en-IN')}`)
    }

    console.log('\n' + '='.repeat(50))
    console.log('✅ ALL DATA SEEDED SUCCESSFULLY!')
    console.log('=' .repeat(50))

    await mongoose.connection.close()
    console.log('\n🔌 Database connection closed')
  } catch (error) {
    console.error('❌ Error seeding data:', error)
    process.exit(1)
  }
}

seedAllData()
