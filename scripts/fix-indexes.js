const mongoose = require('mongoose')

const MONGODB_URI = 'mongodb+srv://dbuser:Tsunade%40106@cluster0.eshla4d.mongodb.net/gjts_karnataka?retryWrites=true&w=majority&appName=Cluster0'

async function fixIndexes() {
  try {
    console.log('Connecting to MongoDB...')
    await mongoose.connect(MONGODB_URI)
    console.log('Connected!')

    const db = mongoose.connection.db
    const collection = db.collection('alumnifunds')

    console.log('Dropping receiptNumber index...')
    try {
      await collection.dropIndex('receiptNumber_1')
      console.log('✅ Index dropped successfully')
    } catch (err) {
      console.log('Index might not exist, continuing...')
    }

    console.log('✅ Done!')
    await mongoose.connection.close()
  } catch (error) {
    console.error('Error:', error)
    process.exit(1)
  }
}

fixIndexes()
