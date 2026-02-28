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

// Update donation
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

    await connectDB()

    const { id } = params
    const data = await request.json()
    
    // Find and update the donation
    const donation = await AlumniFund.findByIdAndUpdate(
      id,
      {
        alumniName: data.alumniName,
        alumniEmail: data.alumniEmail,
        amount: parseFloat(data.amount),
        purpose: data.purpose,
        paymentMethod: data.paymentMethod,
        receiptNumber: data.receiptNumber,
        notes: data.notes,
        updatedAt: new Date()
      },
      { new: true, runValidators: true }
    )

    if (!donation) {
      return NextResponse.json({ error: 'Donation not found' }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      donation
    })
  } catch (error) {
    console.error('Error updating donation:', error)
    return NextResponse.json(
      { error: 'Failed to update donation', details: error.message },
      { status: 500 }
    )
  }
}

// Delete donation
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

    await connectDB()

    const { id } = params
    
    // Find and delete the donation
    const donation = await AlumniFund.findByIdAndDelete(id)

    if (!donation) {
      return NextResponse.json({ error: 'Donation not found' }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      message: 'Donation deleted successfully'
    })
  } catch (error) {
    console.error('Error deleting donation:', error)
    return NextResponse.json(
      { error: 'Failed to delete donation', details: error.message },
      { status: 500 }
    )
  }
}
