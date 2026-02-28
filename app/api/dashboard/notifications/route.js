import { NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'
import dbConnect from '@/lib/mongodb'
import Notification from '@/lib/models/Notification'

const JWT_SECRET = process.env.JWT_SECRET || 'gjts-secret-key-2024'

// GET - Fetch notifications
export async function GET(request) {
  try {
    const token = request.headers.get('authorization')?.replace('Bearer ', '')
    
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const decoded = jwt.verify(token, JWT_SECRET)
    await dbConnect()

    const { searchParams } = new URL(request.url)
    const unreadOnly = searchParams.get('unreadOnly') === 'true'

    // Build query based on user role
    let query = {}
    
    if (decoded.role === 'super_admin') {
      // Super admin sees all notifications
      query = {}
    } else {
      // School admin sees their school's notifications and "All" notifications
      query = {
        $or: [
          { school: decoded.school },
          { school: 'All' }
        ]
      }
    }

    // Filter by read status if requested
    if (unreadOnly) {
      query.read = false
    }

    const notifications = await Notification.find(query)
      .sort({ createdAt: -1 })
      .limit(50)

    // Count unread notifications
    const unreadCount = await Notification.countDocuments({
      ...query,
      read: false
    })

    return NextResponse.json({ 
      success: true,
      notifications,
      unreadCount
    })
  } catch (error) {
    console.error('Error fetching notifications:', error)
    return NextResponse.json({ 
      error: 'Failed to fetch notifications',
      message: error.message 
    }, { status: 500 })
  }
}

// PUT - Mark notification as read
export async function PUT(request) {
  try {
    const token = request.headers.get('authorization')?.replace('Bearer ', '')
    
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const decoded = jwt.verify(token, JWT_SECRET)
    await dbConnect()

    const data = await request.json()
    const { notificationId, markAllRead } = data

    if (markAllRead) {
      // Mark all notifications as read for this user
      let query = {}
      if (decoded.role !== 'super_admin') {
        query = {
          $or: [
            { school: decoded.school },
            { school: 'All' }
          ]
        }
      }

      await Notification.updateMany(
        { ...query, read: false },
        { 
          $set: { read: true },
          $push: {
            readBy: {
              username: decoded.username || decoded.email,
              readAt: new Date()
            }
          }
        }
      )

      return NextResponse.json({ 
        success: true,
        message: 'All notifications marked as read'
      })
    } else {
      // Mark single notification as read
      const notification = await Notification.findByIdAndUpdate(
        notificationId,
        { 
          $set: { read: true },
          $push: {
            readBy: {
              username: decoded.username || decoded.email,
              readAt: new Date()
            }
          }
        },
        { new: true }
      )

      if (!notification) {
        return NextResponse.json({ 
          error: 'Notification not found' 
        }, { status: 404 })
      }

      return NextResponse.json({ 
        success: true,
        notification
      })
    }
  } catch (error) {
    console.error('Error updating notification:', error)
    return NextResponse.json({ 
      error: 'Failed to update notification',
      message: error.message 
    }, { status: 500 })
  }
}

// POST - Create notification (super admin only)
export async function POST(request) {
  try {
    const token = request.headers.get('authorization')?.replace('Bearer ', '')
    
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const decoded = jwt.verify(token, JWT_SECRET)
    
    if (decoded.role !== 'super_admin') {
      return NextResponse.json({ 
        error: 'Only Super Admin can create notifications' 
      }, { status: 403 })
    }

    await dbConnect()

    const data = await request.json()
    const notification = await Notification.create(data)

    return NextResponse.json({ 
      success: true,
      notification,
      message: 'Notification created successfully'
    })
  } catch (error) {
    console.error('Error creating notification:', error)
    return NextResponse.json({ 
      error: 'Failed to create notification',
      message: error.message 
    }, { status: 500 })
  }
}
