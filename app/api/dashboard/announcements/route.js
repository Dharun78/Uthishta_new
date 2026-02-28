import { NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'
import dbConnect from '@/lib/mongodb'
import Announcement from '@/lib/models/Announcement'

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

// GET - Fetch announcements
export async function GET(request) {
  try {
    await dbConnect()
    
    const decoded = verifyToken(request)
    if (!decoded) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status') || 'active'

    // Build query based on user role
    let query = { status }

    if (decoded.role === 'super_admin') {
      // Super admin sees all announcements
      query.$or = [
        { recipients: 'all_admins' },
        { recipients: 'super_admin' },
        { 'sender.username': decoded.username }
      ]
    } else {
      // School admin sees announcements for their school or all admins
      query.$or = [
        { recipients: 'all_admins' },
        { recipients: 'specific_school', targetSchool: decoded.school },
        { 'sender.username': decoded.username }
      ]
    }

    const announcements = await Announcement.find(query)
      .sort({ createdAt: -1 })
      .limit(100)

    // Mark unread count
    const unreadCount = announcements.filter(a => 
      !a.readBy.some(r => r.username === decoded.username)
    ).length

    return NextResponse.json({
      success: true,
      announcements,
      unreadCount
    })
  } catch (error) {
    console.error('Error fetching announcements:', error)
    return NextResponse.json(
      { error: 'Failed to fetch announcements' },
      { status: 500 }
    )
  }
}

// POST - Create announcement
export async function POST(request) {
  try {
    await dbConnect()
    
    const decoded = verifyToken(request)
    if (!decoded) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const data = await request.json()

    // Validate recipients
    if (data.recipients === 'all_admins' && decoded.role !== 'super_admin') {
      return NextResponse.json(
        { error: 'Only Super Admin can send to all admins' },
        { status: 403 }
      )
    }

    const announcement = await Announcement.create({
      title: data.title,
      message: data.message,
      sender: {
        username: decoded.username,
        fullName: decoded.fullName || decoded.username,
        school: decoded.school,
        role: decoded.role
      },
      recipients: data.recipients,
      targetSchool: data.targetSchool || undefined,
      priority: data.priority || 'normal'
    })

    return NextResponse.json({
      success: true,
      announcement
    })
  } catch (error) {
    console.error('Error creating announcement:', error)
    return NextResponse.json(
      { error: 'Failed to create announcement', details: error.message },
      { status: 500 }
    )
  }
}
