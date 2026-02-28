import { NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'
import dbConnect from '@/lib/mongodb'
import Alumni from '@/lib/models/Alumni'

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production'

function verifyToken(token) {
  try {
    return jwt.verify(token, JWT_SECRET)
  } catch (error) {
    return null
  }
}

// Update alumni
export async function PUT(request, { params }) {
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
    
    // Find and update the alumni
    const alumni = await Alumni.findByIdAndUpdate(
      id,
      {
        name: data.name,
        email: data.email,
        phone: data.phone,
        graduationYear: data.graduationYear,
        currentOccupation: data.currentOccupation,
        company: data.company,
        city: data.city,
        linkedIn: data.linkedIn,
        notes: data.notes,
        updatedAt: new Date()
      },
      { new: true, runValidators: true }
    )

    if (!alumni) {
      return NextResponse.json({ error: 'Alumni not found' }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      alumni
    })
  } catch (error) {
    console.error('Error updating alumni:', error)
    return NextResponse.json(
      { error: 'Failed to update alumni', details: error.message },
      { status: 500 }
    )
  }
}

// Delete alumni
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
    
    // Find and delete the alumni
    const alumni = await Alumni.findByIdAndDelete(id)

    if (!alumni) {
      return NextResponse.json({ error: 'Alumni not found' }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      message: 'Alumni deleted successfully'
    })
  } catch (error) {
    console.error('Error deleting alumni:', error)
    return NextResponse.json(
      { error: 'Failed to delete alumni', details: error.message },
      { status: 500 }
    )
  }
}
