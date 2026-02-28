import { NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'
import dbConnect from '@/lib/mongodb'
import Grant from '@/lib/models/Grant'

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
      schoolFilter = { applicableSchools: schoolParam }
    } 
    // If super admin viewing all schools
    else if (decoded.role === 'super_admin' && (!schoolParam || schoolParam === 'All')) {
      // No filter - get grants for all schools
      schoolFilter = {}
    }
    // School admin - only their school
    else {
      schoolFilter = { applicableSchools: decoded.school }
    }

    const grants = await Grant.find(schoolFilter).sort({ discoveredAt: -1 })

    return NextResponse.json({ 
      success: true,
      grants 
    })
  } catch (error) {
    console.error('Error fetching grants:', error)
    return NextResponse.json({ 
      error: 'Failed to fetch grants' 
    }, { status: 500 })
  }
}
