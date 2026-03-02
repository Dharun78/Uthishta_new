import { NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import CustomPage from '@/lib/models/CustomPage'

// GET - Get pages that should appear in menu (public route)
export async function GET() {
  try {
    await connectDB()
    
    // Get only published pages that should show in menu
    const pages = await CustomPage.find({
      status: 'published',
      showInMenu: true
    })
      .select('slug title menuOrder')
      .sort({ menuOrder: 1 })
      .lean()
    
    return NextResponse.json({ pages })
  } catch (error) {
    console.error('Error fetching menu pages:', error)
    return NextResponse.json({ pages: [] })
  }
}
