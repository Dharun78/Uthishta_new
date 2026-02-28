import mongoose from 'mongoose'

const MONGODB_URI = 'mongodb+srv://dbuser:Tsunade%40106@cluster0.eshla4d.mongodb.net/gjts_karnataka?retryWrites=true&w=majority&appName=Cluster0'

async function testConnection() {
  try {
    console.log('🔌 Testing MongoDB connection...')
    console.log('📍 Connecting to: cluster0.eshla4d.mongodb.net')
    
    await mongoose.connect(MONGODB_URI, {
      serverSelectionTimeoutMS: 5000
    })
    
    console.log('✅ MongoDB Connected Successfully!')
    console.log('📊 Database:', mongoose.connection.db.databaseName)
    console.log('🌐 Host:', mongoose.connection.host)
    
    // List collections
    const collections = await mongoose.connection.db.listCollections().toArray()
    console.log('\n📁 Collections found:', collections.length)
    collections.forEach(col => {
      console.log(`   - ${col.name}`)
    })
    
    // Count documents in key collections
    console.log('\n📊 Document counts:')
    try {
      const adminCount = await mongoose.connection.db.collection('schooladmins').countDocuments()
      console.log(`   - schooladmins: ${adminCount}`)
    } catch (e) {
      console.log('   - schooladmins: Collection not found')
    }
    
    try {
      const alumniCount = await mongoose.connection.db.collection('alumni').countDocuments()
      console.log(`   - alumni: ${alumniCount}`)
    } catch (e) {
      console.log('   - alumni: Collection not found')
    }
    
    try {
      const grantsCount = await mongoose.connection.db.collection('grants').countDocuments()
      console.log(`   - grants: ${grantsCount}`)
    } catch (e) {
      console.log('   - grants: Collection not found')
    }
    
    console.log('\n✅ Connection test completed successfully!')
    
  } catch (error) {
    console.error('\n❌ MongoDB Connection Failed!')
    console.error('Error:', error.message)
    
    if (error.message.includes('ENOTFOUND')) {
      console.error('\n💡 Possible causes:')
      console.error('   1. MongoDB Atlas cluster is paused')
      console.error('   2. No internet connection')
      console.error('   3. Incorrect connection string')
    } else if (error.message.includes('Authentication failed')) {
      console.error('\n💡 Possible causes:')
      console.error('   1. Incorrect username or password')
      console.error('   2. User not authorized for this database')
    } else if (error.message.includes('timed out')) {
      console.error('\n💡 Possible causes:')
      console.error('   1. MongoDB Atlas cluster is paused - RESUME IT!')
      console.error('   2. Network firewall blocking connection')
      console.error('   3. IP address not whitelisted')
    }
    
    console.error('\n🔧 To fix:')
    console.error('   1. Go to: https://cloud.mongodb.com')
    console.error('   2. Login to your account')
    console.error('   3. Find Cluster0')
    console.error('   4. Click "..." → "Resume"')
    console.error('   5. Wait 1-2 minutes')
    console.error('   6. Run this script again')
    
  } finally {
    await mongoose.connection.close()
    console.log('\n🔌 Connection closed')
  }
}

testConnection()
