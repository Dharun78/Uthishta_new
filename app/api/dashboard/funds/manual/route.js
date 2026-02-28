import { NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'
import mongoose from 'mongoose'
import connectDB from '@/lib/mongodb'
import AlumniFund from '@/lib/models/AlumniFund'

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
    
    // Get the actual school (not "All")
    let school = data.school
    if (school === 'All' || !school) {
      // If Super Admin selected "All", we need a specific school
      // For now, use the first school or require selection
      return NextResponse.json(
        { error: 'Please select a specific school' },
        { status: 400 }
      )
    }
    
    // Create fund record with all required fields
    const fund = await AlumniFund.create({
      alumniId: new mongoose.Types.ObjectId(), // Generate a temporary ID
      alumniName: data.alumniName,
      alumniEmail: data.alumniEmail,
      school: school,
      amount: parseFloat(data.amount),
      purpose: data.purpose || 'general',
      paymentMethod: data.paymentMethod || 'cash',
      status: 'completed',
      receiptNumber: data.receiptNumber || undefined, // Will be auto-generated
      notes: data.notes,
      createdAt: new Date()
    })

    return NextResponse.json({
      success: true,
      fund
    })
  } catch (error) {
    console.error('Error recording fund:', error)
    return NextResponse.json(
      { error: 'Failed to record fund', details: error.message },
      { status: 500 }
    )
  }
}
