import { NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'
import dbConnect from '@/lib/mongodb'
import Event from '@/lib/models/Event'
import Alumni from '@/lib/models/Alumni'
import AlumniFund from '@/lib/models/AlumniFund'
import Grant from '@/lib/models/Grant'

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production'

function verifyToken(request) {
  const authHeader = request.headers.get('authorization')
  if (!authHeader) return null

  const token = authHeader.replace('Bearer ', '')
  try {
    return jwt.verify(token, JWT_SECRET)
  } catch (error) {
    return null
  }
}

export async function GET(request) {
  try {
    await dbConnect()
    
    const decoded = verifyToken(request)
    
    if (!decoded) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Get school from query parameter (for super admin) or from token (for school admin)
    const { searchParams } = new URL(request.url)
    const schoolParam = searchParams.get('school')
    
    let query = {}
    
    // Build query based on role and school filter
    if (decoded.role !== 'super_admin') {
      query.school = decoded.school
    } else if (schoolParam && schoolParam !== 'All Schools' && schoolParam !== 'All') {
      query.school = schoolParam
    }

    // Fetch events
    const events = await Event.find(query).sort({ date: -1 }).limit(10)
    
    // Calculate event stats
    const totalEvents = await Event.countDocuments(query)
    const upcomingEvents = await Event.countDocuments({
      ...query,
      date: { $gte: new Date() },
      status: 'published'
    })
    
    // Alumni stats
    const alumniQuery = decoded.role !== 'super_admin' 
      ? { school: decoded.school }
      : (schoolParam && schoolParam !== 'All Schools' && schoolParam !== 'All')
        ? { school: schoolParam }
        : {}
    
    const totalAlumni = await Alumni.countDocuments(alumniQuery)
    
    // Fund stats
    const fundQuery = decoded.role !== 'super_admin' 
      ? { school: decoded.school, status: 'completed' }
      : (schoolParam && schoolParam !== 'All Schools' && schoolParam !== 'All')
        ? { school: schoolParam, status: 'completed' }
        : { status: 'completed' }
    
    const totalFunds = await AlumniFund.countDocuments(fundQuery)
    const totalFundAmount = await AlumniFund.aggregate([
      { $match: fundQuery },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ])
    
    // Grant stats
    const grantQuery = decoded.role !== 'super_admin' 
      ? { targetSchools: decoded.school }
      : (schoolParam && schoolParam !== 'All Schools' && schoolParam !== 'All')
        ? { targetSchools: schoolParam }
        : {}
    
    const totalGrants = await Grant.countDocuments(grantQuery)
    const activeGrants = await Grant.countDocuments({
      ...grantQuery,
      status: 'active',
      deadline: { $gte: new Date() }
    })
    
    // Email stats (from events)
    const emailsSent = await Event.aggregate([
      { $match: query },
      { $group: { _id: null, total: { $sum: '$recipientCount' } } }
    ])

    const stats = {
      totalEvents,
      upcomingEvents,
      totalAlumni,
      totalFunds,
      totalFundAmount: totalFundAmount[0]?.total || 0,
      totalGrants,
      activeGrants,
      emailsSent: emailsSent[0]?.total || 0
    }

    return NextResponse.json({
      success: true,
      stats,
      events
    })
  } catch (error) {
    console.error('Error fetching stats:', error)
    return NextResponse.json(
      { error: 'Failed to fetch stats' },
      { status: 500 }
    )
  }
}
