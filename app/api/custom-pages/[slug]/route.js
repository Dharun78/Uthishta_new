import { NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import CustomPage from '@/lib/models/CustomPage'

// GET - Public route to view published pages
export async function GET(request, { params }) {
  try {
    await connectDB()
    
    const { slug } = params
    const page = await CustomPage.findOne({ 
      slug, 
      status: 'published' 
    }).lean()
    
    if (!page) {
      return NextResponse.json({ error: 'Page not found' }, { status: 404 })
    }
    
    return NextResponse.json({ page })
  } catch (error) {
    console.error('Error fetching page:', error)
    return NextResponse.json({ error: 'Failed to fetch page' }, { status: 500 })
  }
}
