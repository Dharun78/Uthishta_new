// Script to fix home page data structure in database
// Run with: node scripts/fix-home-page-data.js

const mongoose = require('mongoose')

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://your-connection-string'

const pageContentSchema = new mongoose.Schema({
  page: String,
  sections: Object
}, { timestamps: true })

const PageContent = mongoose.model('PageContent', pageContentSchema)

async function fixHomePageData() {
  try {
    console.log('🔌 Connecting to MongoDB...')
    await mongoose.connect(MONGODB_URI)
    console.log('✅ Connected to MongoDB')

    // Find home page content
    let homePage = await PageContent.findOne({ page: 'home' })

    if (!homePage) {
      console.log('📄 No home page found, creating default...')
      homePage = await PageContent.create({
        page: 'home',
        sections: {
          hero: {
            title: 'Government Junior Technical Schools Karnataka',
            subtitle: 'Empowering Youth Through Technical Education',
            description: 'Building skilled professionals for tomorrow'
          },
          stats: {
            students: '800+',
            schools: '6',
            placement: '70%',
            growth: '17%'
          },
          facilities: [],
          achievements: []
        }
      })
      console.log('✅ Created default home page')
    } else {
      console.log('📄 Found existing home page, checking structure...')
      
      let needsUpdate = false
      const sections = homePage.sections || {}

      // Fix facilities
      if (!sections.facilities) {
        console.log('⚠️  Missing facilities, adding empty array')
        sections.facilities = []
        needsUpdate = true
      } else if (!Array.isArray(sections.facilities)) {
        console.log('⚠️  Facilities is not an array, converting...')
        sections.facilities = []
        needsUpdate = true
      }

      // Fix achievements
      if (!sections.achievements) {
        console.log('⚠️  Missing achievements, adding empty array')
        sections.achievements = []
        needsUpdate = true
      } else if (!Array.isArray(sections.achievements)) {
        console.log('⚠️  Achievements is not an array, converting...')
        sections.achievements = []
        needsUpdate = true
      }

      // Ensure hero exists
      if (!sections.hero) {
        console.log('⚠️  Missing hero section, adding default')
        sections.hero = {
          title: 'Government Junior Technical Schools Karnataka',
          subtitle: 'Empowering Youth Through Technical Education',
          description: 'Building skilled professionals for tomorrow'
        }
        needsUpdate = true
      }

      // Ensure stats exists
      if (!sections.stats) {
        console.log('⚠️  Missing stats section, adding default')
        sections.stats = {
          students: '800+',
          schools: '6',
          placement: '70%',
          growth: '17%'
        }
        needsUpdate = true
      }

      if (needsUpdate) {
        homePage.sections = sections
        await homePage.save()
        console.log('✅ Updated home page structure')
      } else {
        console.log('✅ Home page structure is correct')
      }
    }

    console.log('\n📊 Current home page data:')
    console.log(JSON.stringify(homePage.sections, null, 2))

    await mongoose.disconnect()
    console.log('\n✅ Disconnected from MongoDB')
    console.log('🎉 Fix complete!')
  } catch (error) {
    console.error('❌ Error:', error)
    process.exit(1)
  }
}

fixHomePageData()
