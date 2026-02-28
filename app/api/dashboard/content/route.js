import { NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'
import dbConnect from '@/lib/mongodb'
import SchoolContent from '@/lib/models/SchoolContent'

const JWT_SECRET = process.env.JWT_SECRET || 'gjts-secret-key-2024'

// GET - Fetch school content
export async function GET(request) {
  try {
    const token = request.headers.get('authorization')?.replace('Bearer ', '')
    
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const decoded = jwt.verify(token, JWT_SECRET)
    await dbConnect()

    // Get school from query parameter (for super admin) or from token (for school admin)
    const { searchParams } = new URL(request.url)
    const schoolParam = searchParams.get('school')
    
    let school = decoded.school
    
    // If super admin and school parameter provided
    if (decoded.role === 'super_admin' && schoolParam && schoolParam !== 'All') {
      school = schoolParam
    }

    // If super admin wants all schools
    if (decoded.role === 'super_admin' && (!schoolParam || schoolParam === 'All')) {
      const allContent = await SchoolContent.find({})
      return NextResponse.json({ 
        success: true,
        content: allContent,
        isMultiple: true
      })
    }

    // Get specific school content
    let content = await SchoolContent.findOne({ school })
    
    // If no content exists, create default content
    if (!content) {
      content = await SchoolContent.create({
        school,
        description: `Welcome to GJTS ${school}`,
        vision: 'To provide quality technical education',
        mission: 'Empowering students with technical skills',
        facilities: [],
        achievements: [],
        courses: [],
        contactInfo: {
          email: `${school.toLowerCase()}@gjtskarnataka.edu.in`,
          phone: '+91-XXX-XXX-XXXX',
          address: `GJTS ${school}, Karnataka`,
          website: ''
        },
        images: {
          banner: '',
          gallery: []
        },
        socialMedia: {},
        updatedBy: decoded.email || decoded.username
      })
    }

    return NextResponse.json({ 
      success: true,
      content 
    })
  } catch (error) {
    console.error('Error fetching content:', error)
    return NextResponse.json({ 
      error: 'Failed to fetch content',
      message: error.message 
    }, { status: 500 })
  }
}

// PUT - Update school content
export async function PUT(request) {
  try {
    const token = request.headers.get('authorization')?.replace('Bearer ', '')
    
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const decoded = jwt.verify(token, JWT_SECRET)
    await dbConnect()

    const data = await request.json()
    const { school, ...updateData } = data
    
    // Verify permissions
    if (decoded.role !== 'super_admin' && decoded.school !== school) {
      return NextResponse.json({ 
        error: 'Unauthorized - You can only edit your own school content' 
      }, { status: 403 })
    }

    // Update or create content
    const content = await SchoolContent.findOneAndUpdate(
      { school },
      {
        ...updateData,
        updatedBy: decoded.email || decoded.username,
        updatedAt: Date.now()
      },
      { 
        new: true, 
        upsert: true,
        runValidators: true
      }
    )

    return NextResponse.json({ 
      success: true,
      content,
      message: 'Content updated successfully'
    })
  } catch (error) {
    console.error('Error updating content:', error)
    return NextResponse.json({ 
      error: 'Failed to update content',
      message: error.message 
    }, { status: 500 })
  }
}
