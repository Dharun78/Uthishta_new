const mongoose = require('mongoose')
require('dotenv').config({ path: '.env' })

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

const Alumni = mongoose.models.Alumni || mongoose.model('Alumni', alumniSchema)

const schools = ['Ballari', 'Bhadravati', 'Hubballi', 'Bagalkot', 'Kalburgi', 'Mangalore']

const firstNames = [
  'Rajesh', 'Priya', 'Amit', 'Sneha', 'Vikram', 'Anjali', 'Karthik', 'Divya',
  'Suresh', 'Lakshmi', 'Arun', 'Meera', 'Ravi', 'Pooja', 'Manoj', 'Kavya',
  'Sanjay', 'Nisha', 'Deepak', 'Swati', 'Ramesh', 'Anita', 'Prakash', 'Rekha',
  'Naveen', 'Shweta', 'Ganesh', 'Madhuri', 'Ashok', 'Sunita'
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

function getRandomItem(array) {
  return array[Math.floor(Math.random() * array.length)]
}

function generatePhone() {
  return `+91 ${Math.floor(Math.random() * 90000) + 10000} ${Math.floor(Math.random() * 90000) + 10000}`
}

async function seedAlumni() {
  try {
    console.log('Connecting to MongoDB...')
    await mongoose.connect(process.env.MONGODB_URI)
    console.log('Connected to MongoDB')

    // Clear existing alumni
    await Alumni.deleteMany({})
    console.log('Cleared existing alumni')

    const alumniData = []

    // Generate 50 alumni per school (300 total)
    for (const school of schools) {
      for (let i = 0; i < 50; i++) {
        const firstName = getRandomItem(firstNames)
        const lastName = getRandomItem(lastNames)
        const name = `${firstName} ${lastName}`
        const email = `${firstName.toLowerCase()}.${lastName.toLowerCase()}${i}@gmail.com`
        const graduationYear = 2010 + Math.floor(Math.random() * 15) // 2010-2024
        
        alumniData.push({
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
          registeredAt: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000) // Random date in last year
        })
      }
    }

    console.log(`Inserting ${alumniData.length} alumni...`)
    await Alumni.insertMany(alumniData)

    console.log('✅ Alumni seeding completed successfully!')
    console.log(`Total alumni: ${alumniData.length}`)
    console.log('Alumni per school: 50')
    
    // Show stats
    for (const school of schools) {
      const count = await Alumni.countDocuments({ school })
      console.log(`  ${school}: ${count} alumni`)
    }

    await mongoose.connection.close()
    console.log('Database connection closed')
  } catch (error) {
    console.error('Error seeding alumni:', error)
    process.exit(1)
  }
}

seedAlumni()
