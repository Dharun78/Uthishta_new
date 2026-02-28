import { NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'
import dbConnect from '@/lib/mongodb'
import Alumni from '@/lib/models/Alumni'

const JWT_SECRET = process.env.JWT_SECRET || 'gjts-secret-key-2024'

export async function GET(request) {
  try {
    const token = request.headers.get('authorization')?.replace('Bearer ', '')
    
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const decoded = jwt.verify(token, JWT_SECRET)
    await dbConnect()

    // Get school from query parameter (for super admin) or from token (for school admin)
    const { searchParams } = new URL(request.url)
    const schoolParam = searchParams.get('school')
    
    let schoolFilter = {}
    
    // If super admin and school filter is provided
    if (decoded.role === 'super_admin' && schoolParam && schoolParam !== 'All') {
      schoolFilter = { school: schoolParam }
    } 
    // If super admin viewing all schools
    else if (decoded.role === 'super_admin' && (!schoolParam || schoolParam === 'All')) {
      // No filter - get all schools
      schoolFilter = {}
    }
    // School admin - only their school
    else {
      schoolFilter = { school: decoded.school }
    }

    // Get alumni with school filter
    const alumni = await Alumni.find(schoolFilter)
      .sort({ registeredAt: -1 })
      .limit(100)

    // Calculate stats
    const totalAlumni = await Alumni.countDocuments(schoolFilter)
    
    // Group by graduation year
    const byYear = {}
    const allAlumni = await Alumni.find(schoolFilter)
    allAlumni.forEach(a => {
      byYear[a.graduationYear] = (byYear[a.graduationYear] || 0) + 1
    })

    // Group by school (for super admin)
    const bySchool = {}
    if (decoded.role === 'super_admin' && (!schoolParam || schoolParam === 'All')) {
      allAlumni.forEach(a => {
        bySchool[a.school] = (bySchool[a.school] || 0) + 1
      })
    }

    // Top companies
    const companyCount = {}
    allAlumni.forEach(a => {
      if (a.company) {
        companyCount[a.company] = (companyCount[a.company] || 0) + 1
      }
    })
    const topCompanies = Object.entries(companyCount)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([company, count]) => ({ company, count }))

    return NextResponse.json({
      success: true,
      alumni,
      stats: {
        total: totalAlumni,
        byYear,
        bySchool,
        topCompanies
      }
    })
  } catch (error) {
    console.error('Error fetching alumni:', error)
    return NextResponse.json({ 
      error: 'Failed to fetch alumni data',
      message: error.message
    }, { status: 500 })
  }
}
