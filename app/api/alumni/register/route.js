import { NextResponse } from 'next/server'
import dbConnect from '@/lib/mongodb'
import Alumni from '@/lib/models/Alumni'

export async function POST(request) {
  try {
    await dbConnect()
    
    const data = await request.json()
    
    // Check if alumni already exists
    const existingAlumni = await Alumni.findOne({ email: data.email })
    if (existingAlumni) {
      return NextResponse.json(
        { error: 'An alumni with this email is already registered' },
        { status: 400 }
      )
    }
    
    // Create new alumni
    const alumni = new Alumni(data)
    await alumni.save()
    
    return NextResponse.json({
      success: true,
      message: 'Thank you for registering! Welcome to the GJTS Alumni Network.',
      alumni: {
        name: alumni.name,
        email: alumni.email,
        school: alumni.school
      }
    })
  } catch (error) {
    console.error('Alumni registration error:', error)
    return NextResponse.json(
      { error: 'Failed to register. Please try again.' },
      { status: 500 }
    )
  }
}
