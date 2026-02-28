/**
 * Script to fix corrupted facilities and achievements data in SchoolContent
 * Converts string values to proper object format
 */

const mongoose = require('mongoose')
require('dotenv').config({ path: '.env.local' })

const MONGODB_URI = process.env.MONGODB_URI

const schoolContentSchema = new mongoose.Schema({
  school: String,
  facilities: mongoose.Schema.Types.Mixed,
  achievements: mongoose.Schema.Types.Mixed,
  courses: Array,
  contactInfo: Object,
  description: String,
  vision: String,
  mission: String,
  images: Object,
  socialMedia: Object,
  updatedBy: String,
  updatedAt: Date
}, { timestamps: true })

const SchoolContent = mongoose.models.SchoolContent || mongoose.model('SchoolContent', schoolContentSchema)

async function fixContentData() {
  try {
    console.log('🔌 Connecting to MongoDB...')
    await mongoose.connect(MONGODB_URI)
    console.log('✅ Connected to MongoDB')

    const allContent = await SchoolContent.find({})
    console.log(`\n📊 Found ${allContent.length} school content records\n`)

    let fixedCount = 0

    for (const content of allContent) {
      let needsUpdate = false
      const updates = {}

      // Fix facilities
      if (content.facilities) {
        if (!Array.isArray(content.facilities)) {
          // If it's a single object, convert to array
          updates.facilities = [content.facilities]
          needsUpdate = true
          console.log(`⚠️  ${content.school}: facilities is not an array, converting...`)
        } else {
          // Check if any items are strings
          const fixedFacilities = content.facilities.map(f => {
            if (typeof f === 'string') {
              return { name: f, description: '' }
            }
            return f
          })
          
          if (JSON.stringify(fixedFacilities) !== JSON.stringify(content.facilities)) {
            updates.facilities = fixedFacilities
            needsUpdate = true
            console.log(`⚠️  ${content.school}: Fixed string facilities to objects`)
          }
        }
      }

      // Fix achievements
      if (content.achievements) {
        if (!Array.isArray(content.achievements)) {
          // If it's a single object, convert to array
          updates.achievements = [content.achievements]
          needsUpdate = true
          console.log(`⚠️  ${content.school}: achievements is not an array, converting...`)
        } else {
          // Check if any items are strings
          const fixedAchievements = content.achievements.map(a => {
            if (typeof a === 'string') {
              return { title: a, description: '', year: new Date().getFullYear() }
            }
            return a
          })
          
          if (JSON.stringify(fixedAchievements) !== JSON.stringify(content.achievements)) {
            updates.achievements = fixedAchievements
            needsUpdate = true
            console.log(`⚠️  ${content.school}: Fixed string achievements to objects`)
          }
        }
      }

      // Apply updates if needed
      if (needsUpdate) {
        await SchoolContent.updateOne(
          { _id: content._id },
          { $set: updates }
        )
        fixedCount++
        console.log(`✅ Fixed ${content.school}`)
      } else {
        console.log(`✓  ${content.school}: No issues found`)
      }
    }

    console.log(`\n🎉 Migration complete!`)
    console.log(`   Fixed: ${fixedCount} records`)
    console.log(`   Total: ${allContent.length} records`)

  } catch (error) {
    console.error('❌ Error:', error)
  } finally {
    await mongoose.connection.close()
    console.log('\n🔌 Disconnected from MongoDB')
  }
}

fixContentData()
