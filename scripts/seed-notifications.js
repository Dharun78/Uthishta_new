const mongoose = require('mongoose')
require('dotenv').config({ path: '.env' })

const MONGODB_URI = process.env.MONGODB_URI

const notificationSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['alumni', 'donation', 'grant', 'event', 'system', 'alert'],
    required: true
  },
  title: String,
  message: String,
  school: String,
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'urgent'],
    default: 'medium'
  },
  read: {
    type: Boolean,
    default: false
  },
  readBy: [{
    username: String,
    readAt: Date
  }],
  actionUrl: String,
  metadata: mongoose.Schema.Types.Mixed,
  createdAt: {
    type: Date,
    default: Date.now
  }
})

const Notification = mongoose.models.Notification || mongoose.model('Notification', notificationSchema)

const sampleNotifications = [
  // Alumni notifications
  {
    type: 'alumni',
    title: 'New Alumni Registration',
    message: 'Rajesh Kumar from batch 2020 has registered in the alumni network',
    school: 'Ballari',
    priority: 'low',
    actionUrl: '/dashboard/alumni',
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000) // 2 hours ago
  },
  {
    type: 'alumni',
    title: '5 New Alumni Registrations',
    message: 'Five alumni from various batches have joined the network this week',
    school: 'All',
    priority: 'medium',
    actionUrl: '/dashboard/alumni',
    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000) // 1 day ago
  },
  
  // Donation notifications
  {
    type: 'donation',
    title: 'New Donation Received',
    message: 'Priya Sharma donated ₹5,000 for infrastructure development',
    school: 'Hubballi',
    priority: 'medium',
    actionUrl: '/dashboard/funds',
    createdAt: new Date(Date.now() - 3 * 60 * 60 * 1000) // 3 hours ago
  },
  {
    type: 'donation',
    title: 'Monthly Fundraising Goal Achieved!',
    message: 'Congratulations! You have reached 100% of your monthly fundraising goal of ₹50,000',
    school: 'Bagalkot',
    priority: 'high',
    actionUrl: '/dashboard/funds',
    createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000) // 5 hours ago
  },
  {
    type: 'donation',
    title: 'Large Donation Alert',
    message: 'Anonymous donor contributed ₹25,000 for student scholarships',
    school: 'All',
    priority: 'high',
    actionUrl: '/dashboard/funds',
    createdAt: new Date(Date.now() - 12 * 60 * 60 * 1000) // 12 hours ago
  },
  
  // Grant notifications
  {
    type: 'grant',
    title: 'New Grant Opportunity',
    message: 'PM SHRI Schools Scheme grant is now available. AI Match Score: 88%',
    school: 'All',
    priority: 'high',
    actionUrl: '/dashboard/grants',
    createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000) // 6 hours ago
  },
  {
    type: 'grant',
    title: 'Grant Application Deadline Approaching',
    message: 'Samagra Shiksha Abhiyan application deadline is in 7 days',
    school: 'Kalburgi',
    priority: 'urgent',
    actionUrl: '/dashboard/grants',
    createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000) // 1 hour ago
  },
  {
    type: 'grant',
    title: 'Grant Eligibility Match',
    message: 'Your school matches 3 new government grants. Total potential funding: ₹2.5 Cr',
    school: 'Mangalore',
    priority: 'high',
    actionUrl: '/dashboard/grants',
    createdAt: new Date(Date.now() - 18 * 60 * 60 * 1000) // 18 hours ago
  },
  
  // Event notifications
  {
    type: 'event',
    title: 'Upcoming Event: Annual Day',
    message: 'Annual Day celebration is scheduled for March 15, 2026. 45 alumni have confirmed attendance',
    school: 'Bhadravati',
    priority: 'medium',
    actionUrl: '/dashboard/events',
    createdAt: new Date(Date.now() - 8 * 60 * 60 * 1000) // 8 hours ago
  },
  {
    type: 'event',
    title: 'Event Registration Milestone',
    message: 'Alumni Meet 2026 has crossed 100 registrations!',
    school: 'All',
    priority: 'medium',
    actionUrl: '/dashboard/events',
    createdAt: new Date(Date.now() - 36 * 60 * 60 * 1000) // 1.5 days ago
  },
  
  // System notifications
  {
    type: 'system',
    title: 'System Update',
    message: 'Dashboard has been updated with new features. Check out the improved grants discovery system',
    school: 'All',
    priority: 'low',
    actionUrl: '/dashboard',
    createdAt: new Date(Date.now() - 48 * 60 * 60 * 1000) // 2 days ago
  },
  {
    type: 'system',
    title: 'Monthly Report Available',
    message: 'Your monthly performance report for February 2026 is now available for download',
    school: 'All',
    priority: 'medium',
    actionUrl: '/dashboard',
    createdAt: new Date(Date.now() - 72 * 60 * 60 * 1000) // 3 days ago
  },
  
  // Alert notifications
  {
    type: 'alert',
    title: 'Low Engagement Alert',
    message: 'Alumni engagement has decreased by 15% this month. Consider sending a newsletter',
    school: 'Ballari',
    priority: 'medium',
    actionUrl: '/dashboard/alumni',
    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000) // 1 day ago
  },
  {
    type: 'alert',
    title: 'Fundraising Goal Behind Schedule',
    message: 'You are 30% behind your quarterly fundraising goal. Current: ₹35,000 / Target: ₹50,000',
    school: 'Hubballi',
    priority: 'high',
    actionUrl: '/dashboard/funds',
    createdAt: new Date(Date.now() - 10 * 60 * 60 * 1000) // 10 hours ago
  }
]

async function seedNotifications() {
  try {
    console.log('🔌 Connecting to MongoDB...')
    await mongoose.connect(MONGODB_URI)
    console.log('✅ Connected to MongoDB')

    console.log('🗑️  Clearing existing notifications...')
    await Notification.deleteMany({})
    console.log('✅ Cleared existing notifications')

    console.log('📢 Creating sample notifications...')
    const notifications = await Notification.insertMany(sampleNotifications)
    console.log(`✅ Created ${notifications.length} notifications`)

    console.log('\n📊 Notification Summary:')
    const types = await Notification.aggregate([
      { $group: { _id: '$type', count: { $sum: 1 } } }
    ])
    types.forEach(t => {
      console.log(`   ${t._id}: ${t.count}`)
    })

    console.log('\n🎉 Notification seeding complete!')
    console.log('📍 View notifications at: http://localhost:3001/dashboard/notifications')

  } catch (error) {
    console.error('❌ Error seeding notifications:', error)
  } finally {
    await mongoose.connection.close()
    console.log('🔌 MongoDB connection closed')
  }
}

seedNotifications()
