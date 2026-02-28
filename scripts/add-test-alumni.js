const mongoose = require('mongoose')

const MONGODB_URI = 'mongodb+srv://dbuser:Tsunade%40106@cluster0.eshla4d.mongodb.net/gjts_karnataka?retryWrites=true&w=majority&appName=Cluster0'

const alumniSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  phone: String,
  school: String,
  graduationYear: Number,
  currentOccupation: String,
  company: String,
  city: String,
  willingToMentor: Boolean,
  willingToDonate: Boolean,
  registeredAt: Date
}, { timestamps: true })

const Alumni = mongoose.models.Alumni || mongoose.model('Alumni', alumniSchema)

const testAlumni = [
  {
    name: 'Dharun A',
    email: 'dharun.a@btech.christuniversity.in',
    phone: '+91-9876543210',
    school: 'Hubballi',
    graduationYear: 2020,
    currentOccupation: 'Software Engineer',
    company: 'Infosys Technologies',
    city: 'Bangalore',
    willingToMentor: true,
    willingToDonate: true,
    registeredAt: new Date('2024-01-15')
  },
  {
    name: 'Rahul Ramana',
    email: 'rahul.ramana@btech.christuniversity.in',
    phone: '+91-9876543211',
    school: 'Hubballi',
    graduationYear: 2020,
    currentOccupation: 'Data Analyst',
    company: 'TCS Digital',
    city: 'Bangalore',
    willingToMentor: true,
    willingToDonate: true,
    registeredAt: new Date('2024-02-20')
  }
]

async function addTestAlumni() {
  try {
    console.log('🔌 Connecting to MongoDB...')
    await mongoose.connect(MONGODB_URI)
    console.log('✅ Connected to MongoDB')

    console.log('\n🗑️  Removing existing test alumni (if any)...')
    await Alumni.deleteMany({ 
      email: { 
        $in: [
          'dharun.a@btech.christuniversity.in',
          'rahul.ramana@btech.christuniversity.in'
        ] 
      } 
    })
    console.log('✅ Cleared existing test alumni')

    console.log('\n👥 Adding test alumni...')
    await Alumni.insertMany(testAlumni)
    
    console.log('\n📊 TEST ALUMNI ADDED SUCCESSFULLY!')
    console.log('=' .repeat(60))
    console.log('\n✅ Alumni Details:')
    console.log('\n1. Dharun A')
    console.log('   Email: dharun.a@btech.christuniversity.in')
    console.log('   School: GJTS Hubballi')
    console.log('   Graduation: 2020')
    console.log('   Occupation: Software Engineer at Infosys Technologies')
    console.log('   Location: Bangalore')
    console.log('   Willing to Mentor: Yes')
    console.log('   Willing to Donate: Yes')
    
    console.log('\n2. Rahul Ramana')
    console.log('   Email: rahul.ramana@btech.christuniversity.in')
    console.log('   School: GJTS Hubballi')
    console.log('   Graduation: 2020')
    console.log('   Occupation: Data Analyst at TCS Digital')
    console.log('   Location: Bangalore')
    console.log('   Willing to Mentor: Yes')
    console.log('   Willing to Donate: Yes')
    
    console.log('\n' + '='.repeat(60))
    console.log('✅ TEST ALUMNI READY FOR EMAIL NUDGE TESTING!')
    console.log('=' .repeat(60))
    
    console.log('\n📧 To test email nudge system:')
    console.log('1. Login to dashboard as Hubballi admin')
    console.log('   Username: hubballi')
    console.log('   Password: hubballi123')
    console.log('2. Go to Alumni page')
    console.log('3. Find these alumni in the list')
    console.log('4. Test the email nudge functionality')
    console.log('\n')

    await mongoose.connection.close()
    console.log('🔌 Database connection closed')
  } catch (error) {
    console.error('❌ Error adding test alumni:', error)
    process.exit(1)
  }
}

addTestAlumni()
