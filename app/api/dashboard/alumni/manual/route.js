import { NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'
import connectDB from '@/lib/mongodb'
import Alumni from '@/lib/models/Alumni'

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production'

function verifyToken(token) {
  try {
    return jwt.verify(token, JWT_SECRET)
  } catch (error) {
    return null
  }
}

export async function POST(request) {
  try {
    // Verify authentication
    const authHeader = request.headers.get('authorization')
    if (!authHeader) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const token = authHeader.replace('Bearer ', '')
    const decoded = verifyToken(token)
    
    if (!decoded) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    await connectDB()

    const data = await request.json()
    
    // Check if alumni already exists
    const existing = await Alumni.findOne({ email: data.email })
    if (existing) {
      return NextResponse.json(
        { error: 'Alumni with this email already exists' },
        { status: 400 }
      )
    }

    // Create alumni record
    const alumni = await Alumni.create({
      name: data.name,
      email: data.email,
      phone: data.phone,
      school: data.school,
      graduationYear: data.graduationYear,
      currentOccupation: data.currentOccupation,
      company: data.company,
      city: data.city,
      linkedIn: data.linkedIn,
      notes: data.notes,
      registeredAt: new Date()
    })

    return NextResponse.json({
      success: true,
      alumni
    })
  } catch (error) {
    console.error('Error adding alumni:', error)
    return NextResponse.json(
      { error: 'Failed to add alumni', details: error.message },
      { status: 500 }
    )
  }
}
