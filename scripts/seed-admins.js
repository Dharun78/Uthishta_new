// Script to seed admin users with different roles
// Run with: node scripts/seed-admins.js

const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/gjts_karnataka'

const schoolAdminSchema = new mongoose.Schema({
  username: String,
  email: String,
  password: String,
  school: String,
  schoolId: String,
  role: String,
  permissions: Object,
  fullName: String,
  phone: String,
  isActive: Boolean,
  createdAt: Date
})

const SchoolAdmin = mongoose.model('SchoolAdmin', schoolAdminSchema)

const admins = [
  // Super Admin
  {
    username: 'superadmin',
    email: 'superadmin@gjts-karnataka.edu.in',
    password: 'super123',
    school: 'All',
    schoolId: 'GJTS-SUPER-000',
    role: 'super_admin',
    fullName: 'Super Administrator',
    phone: '+91-9876543210',
    isActive: true
  },
  // School Admins
  {
    username: 'admin_ballari',
    email: 'admin@gjts-ballari.edu.in',
    password: 'ballari123',
    school: 'Ballari',
    schoolId: 'GJTS-BLR-001',
    role: 'school_admin',
    fullName: 'Ballari Admin',
    phone: '+91-9876543211',
    isActive: true
  },
  {
    username: 'admin_bhadravati',
    email: 'admin@gjts-bhadravati.edu.in',
    password: 'bhadravati123',
    school: 'Bhadravati',
    schoolId: 'GJTS-BHD-002',
    role: 'school_admin',
    fullName: 'Bhadravati Admin',
    phone: '+91-9876543212',
    isActive: true
  },
  {
    username: 'admin_hubballi',
    email: 'admin@gjts-hubballi.edu.in',
    password: 'hubballi123',
    school: 'Hubballi',
    schoolId: 'GJTS-HUB-003',
    role: 'school_admin',
    fullName: 'Hubballi Admin',
    phone: '+91-9876543213',
    isActive: true
  },
  {
    username: 'admin_bagalkot',
    email: 'admin@gjts-bagalkot.edu.in',
    password: 'bagalkot123',
    school: 'Bagalkot',
    schoolId: 'GJTS-BAG-004',
    role: 'school_admin',
    fullName: 'Bagalkot Admin',
    phone: '+91-9876543214',
    isActive: true
  },
  {
    username: 'admin_kalburgi',
    email: 'admin@gjts-kalburgi.edu.in',
    password: 'kalburgi123',
    school: 'Kalburgi',
    schoolId: 'GJTS-KLB-005',
    role: 'school_admin',
    fullName: 'Kalburgi Admin',
    phone: '+91-9876543215',
    isActive: true
  },
  {
    username: 'admin_mangalore',
    email: 'admin@gjts-mangalore.edu.in',
    password: 'mangalore123',
    school: 'Mangalore',
    schoolId: 'GJTS-MNG-006',
    role: 'school_admin',
    fullName: 'Mangalore Admin',
    phone: '+91-9876543216',
    isActive: true
  }
]

async function seedAdmins() {
  try {
    await mongoose.connect(MONGODB_URI)
    console.log('✅ Connected to MongoDB')

    // Clear existing admins
    await SchoolAdmin.deleteMany({})
    console.log('🗑️  Cleared existing admins')

    // Hash passwords and insert
    for (const admin of admins) {
      const salt = await bcrypt.genSalt(10)
      admin.password = await bcrypt.hash(admin.password, salt)
      admin.createdAt = new Date()

      // Set permissions based on role
      if (admin.role === 'super_admin') {
        admin.permissions = {
          canEditAllSchools: true,
          canEditOwnSchool: true,
          canViewReports: true,
          canManageFunds: true,
          canManageGrants: true,
          canManageEvents: true,
          canManageAlumni: true
        }
      } else if (admin.role === 'school_admin') {
        admin.permissions = {
          canEditAllSchools: false,
          canEditOwnSchool: true,
          canViewReports: true,
          canManageFunds: true,
          canManageGrants: true,
          canManageEvents: true,
          canManageAlumni: true
        }
      }

      await SchoolAdmin.create(admin)
      console.log(`✅ Created ${admin.role}: ${admin.username}`)
    }

    console.log('\n🎉 Admin seeding completed!')
    console.log('\n📋 Login Credentials:')
    console.log('━'.repeat(60))
    console.log('SUPER ADMIN:')
    console.log('  Username: superadmin')
    console.log('  Password: super123')
    console.log('  Access: All schools')
    console.log('━'.repeat(60))
    console.log('SCHOOL ADMINS:')
    admins.filter(a => a.role === 'school_admin').forEach(a => {
      console.log(`  ${a.school}: ${a.username.split('_')[1]}123`)
    })
    console.log('━'.repeat(60))

    await mongoose.disconnect()
    console.log('\n✅ Disconnected from MongoDB')
  } catch (error) {
    console.error('❌ Error seeding admins:', error)
    process.exit(1)
  }
}

seedAdmins()
