import { NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'

// This is a simplified version - in production, connect to MongoDB
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production'

// Demo credentials for each school
const demoAdmins = {
  'superadmin': {
    username: 'superadmin',
    password: 'super123',
    school: 'All',
    schoolId: 'GJTS-SUPER-000',
    fullName: 'Super Admin',
    email: 'superadmin@gjts.edu.in',
    role: 'super_admin'
  },
  'admin_ballari': {
    username: 'admin_ballari',
    password: 'ballari123',
    school: 'Ballari',
    schoolId: 'GJTS-BLR-001',
    fullName: 'Admin Ballari',
    email: 'admin@gjts-ballari.edu.in',
    role: 'school_admin'
  },
  'admin_bhadravati': {
    username: 'admin_bhadravati',
    password: 'bhadravati123',
    school: 'Bhadravati',
    schoolId: 'GJTS-BDV-002',
    fullName: 'Admin Bhadravati',
    email: 'admin@gjts-bhadravati.edu.in',
    role: 'school_admin'
  },
  'admin_hubballi': {
    username: 'admin_hubballi',
    password: 'hubballi123',
    school: 'Hubballi',
    schoolId: 'GJTS-HBL-003',
    fullName: 'Admin Hubballi',
    email: 'admin@gjts-hubballi.edu.in',
    role: 'school_admin'
  },
  'admin_bagalkot': {
    username: 'admin_bagalkot',
    password: 'bagalkot123',
    school: 'Bagalkot',
    schoolId: 'GJTS-BGK-004',
    fullName: 'Admin Bagalkot',
    email: 'admin@gjts-bagalkot.edu.in',
    role: 'school_admin'
  },
  'admin_kalburgi': {
    username: 'admin_kalburgi',
    password: 'kalburgi123',
    school: 'Kalburgi',
    schoolId: 'GJTS-KLB-005',
    fullName: 'Admin Kalburgi',
    email: 'admin@gjts-kalburgi.edu.in',
    role: 'school_admin'
  },
  'admin_mangalore': {
    username: 'admin_mangalore',
    password: 'mangalore123',
    school: 'Mangalore',
    schoolId: 'GJTS-MNG-006',
    fullName: 'Admin Mangalore',
    email: 'admin@gjts-mangalore.edu.in',
    role: 'school_admin'
  }
}

export async function POST(request) {
  try {
    const { username, password, school } = await request.json()

    // Find matching admin
    const admin = Object.values(demoAdmins).find(
      a => a.username === username && a.school === school
    )

    if (!admin || admin.password !== password) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      )
    }

    // Generate JWT token
    const token = jwt.sign(
      {
        username: admin.username,
        school: admin.school,
        schoolId: admin.schoolId,
        role: admin.role
      },
      JWT_SECRET,
      { expiresIn: '24h' }
    )

    // Return admin data (without password)
    const { password: _, ...adminData } = admin

    return NextResponse.json({
      success: true,
      token,
      admin: adminData
    })
  } catch (error) {
    return NextResponse.json(
      { error: 'Login failed' },
      { status: 500 }
    )
  }
}
