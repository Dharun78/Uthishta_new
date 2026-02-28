import { NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'
import dbConnect from '@/lib/mongodb'
import Announcement from '@/lib/models/Announcement'

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production'

function verifyToken(token) {
  try {
    return jwt.verify(token, JWT_SECRET)
  } catch (error) {
    return null
  }
}

// PATCH - Mark as read or add reply
export async function PATCH(request, { params }) {
  try {
    const authHeader = request.headers.get('authorization')
    if (!authHeader) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const token = authHeader.replace('Bearer ', '')
    const decoded = verifyToken(token)
    
    if (!decoded) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    await dbConnect()

    const { id } = params
    const data = await request.json()
    
    const announcement = await Announcement.findById(id)

    if (!announcement) {
      return NextResponse.json({ error: 'Announcement not found' }, { status: 404 })
    }

    // Mark as read
    if (data.action === 'mark_read') {
      const alreadyRead = announcement.readBy.some(r => r.username === decoded.username)
      if (!alreadyRead) {
        announcement.readBy.push({
          username: decoded.username,
          readAt: new Date()
        })
        await announcement.save()
      }
    }

    // Add reply
    if (data.action === 'reply') {
      announcement.replies.push({
        sender: {
          username: decoded.username,
          fullName: decoded.fullName,
          school: decoded.school,
          role: decoded.role
        },
        message: data.message,
        createdAt: new Date()
      })
      await announcement.save()
    }

    return NextResponse.json({
      success: true,
      announcement
    })
  } catch (error) {
    console.error('Error updating announcement:', error)
    return NextResponse.json(
      { error: 'Failed to update announcement', details: error.message },
      { status: 500 }
    )
  }
}

// DELETE - Archive/Unarchive/Delete announcement
export async function DELETE(request, { params }) {
  try {
    const authHeader = request.headers.get('authorization')
    if (!authHeader) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const token = authHeader.replace('Bearer ', '')
    const decoded = verifyToken(token)
    
    if (!decoded) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    await dbConnect()

    const { id } = params
    const { searchParams } = new URL(request.url)
    const action = searchParams.get('action') // 'archive', 'unarchive', or 'delete'
    
    const announcement = await Announcement.findById(id)

    if (!announcement) {
      return NextResponse.json({ error: 'Announcement not found' }, { status: 404 })
    }

    // Only sender or super admin can archive/unarchive/delete
    if (announcement.sender.username !== decoded.username && decoded.role !== 'super_admin') {
      return NextResponse.json({ error: 'Unauthorized to modify this announcement' }, { status: 403 })
    }

    if (action === 'delete') {
      // Permanent delete from database
      await Announcement.findByIdAndDelete(id)
      return NextResponse.json({
        success: true,
        message: 'Announcement permanently deleted'
      })
    } else if (action === 'unarchive') {
      announcement.status = 'active'
      await announcement.save()
      return NextResponse.json({
        success: true,
        message: 'Announcement unarchived successfully'
      })
    } else {
      // Archive (default)
      announcement.status = 'archived'
      await announcement.save()
      return NextResponse.json({
        success: true,
        message: 'Announcement archived successfully'
      })
    }
  } catch (error) {
    console.error('Error modifying announcement:', error)
    return NextResponse.json(
      { error: 'Failed to modify announcement', details: error.message },
      { status: 500 }
    )
  }
}
