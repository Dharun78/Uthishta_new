import { NextResponse } from 'next/server'
import dbConnect from '@/lib/mongodb'
import Event from '@/lib/models/Event'
import jwt from 'jsonwebtoken'

export async function POST(request) {
  try {
    await dbConnect()

    // Get token from header
    const token = request.headers.get('authorization')?.replace('Bearer ', '')
    
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    
    const eventData = await request.json()
    
    // Add creator info and school
    eventData.createdBy = decoded.username
    eventData.status = 'published'
    
    // Set school from user's token (school admins can only create for their school)
    if (decoded.role !== 'super_admin') {
      eventData.school = decoded.school
    } else if (!eventData.school) {
      // Super admin must specify school
      return NextResponse.json({ error: 'School is required' }, { status: 400 })
    }

    // Create event
    const event = await Event.create(eventData)

    return NextResponse.json({ 
      success: true,
      event,
      message: 'Event created successfully'
    })
  } catch (error) {
    console.error('Error creating event:', error)
    return NextResponse.json(
      { error: 'Failed to create event', details: error.message },
      { status: 500 }
    )
  }
}

export async function GET(request) {
  try {
    await dbConnect()

    // Get token from header
    const token = request.headers.get('authorization')?.replace('Bearer ', '')
    
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    
    const { searchParams } = new URL(request.url)
    const school = searchParams.get('school')

    let query = {}
    
    // Filter by school if not super admin
    if (decoded.role !== 'super_admin') {
      query.school = decoded.school
    } else if (school && school !== 'All Schools') {
      query.school = school
    }

    const events = await Event.find(query).sort({ date: -1 })

    return NextResponse.json({ events })
  } catch (error) {
    console.error('Error fetching events:', error)
    return NextResponse.json(
      { error: 'Failed to fetch events' },
      { status: 500 }
    )
  }
}
