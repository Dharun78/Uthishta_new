// Quick database check script
// Run with: node scripts/check-database.js

const mongoose = require('mongoose')

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/gjts_karnataka'

async function checkDatabase() {
  try {
    console.log('🔍 Checking database connection...')
    await mongoose.connect(MONGODB_URI)
    console.log('✅ Connected to MongoDB successfully!')

    // Check collections
    const db = mongoose.connection.db
    const collections = await db.listCollections().toArray()
    
    console.log('\n📊 Database Collections:')
    console.log('='.repeat(60))

    if (collections.length === 0) {
      console.log('⚠️  No collections found - Database is empty!')
      console.log('\n💡 Run this command to seed the database:')
      console.log('   node scripts/seed-database.js')
    } else {
      for (const collection of collections) {
        const count = await db.collection(collection.name).countDocuments()
        console.log(`  ${collection.name}: ${count} documents`)
      }

      console.log('='.repeat(60))
      console.log('\n✅ Database is populated and ready to use!')
    }

    await mongoose.disconnect()
    console.log('\n✅ Disconnected from MongoDB')
  } catch (error) {
    console.error('\n❌ Error:', error.message)
    
    if (error.message.includes('ECONNREFUSED')) {
      console.log('\n💡 MongoDB is not running. Please start MongoDB:')
      console.log('   Windows: net start MongoDB')
      console.log('   Mac: brew services start mongodb-community')
      console.log('   Linux: sudo systemctl start mongod')
    } else if (error.message.includes('authentication')) {
      console.log('\n💡 MongoDB authentication failed.')
      console.log('   Check your MONGODB_URI in .env file')
    }
    
    process.exit(1)
  }
}

checkDatabase()
