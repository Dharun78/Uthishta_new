import { NextResponse } from 'next/server'
import dbConnect from '@/lib/mongodb'
import SchoolContent from '@/lib/models/SchoolContent'

// Public API - no authentication required
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const school = searchParams.get('school')
    
    if (!school) {
      return NextResponse.json({ 
        success: false,
        error: 'School parameter required' 
      }, { status: 400 })
    }

    await dbConnect()

    const content = await SchoolContent.findOne({ school })
    
    if (!content) {
      return NextResponse.json({ 
        success: false,
        message: 'No content found for this school' 
      }, { status: 404 })
    }

    return NextResponse.json({ 
      success: true,
      content 
    })
  } catch (error) {
    console.error('Error fetching school content:', error)
    return NextResponse.json({ 
      success: false,
      error: 'Failed to fetch content',
      message: error.message 
    }, { status: 500 })
  }
}
