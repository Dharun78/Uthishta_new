import { NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import CustomPage from '@/lib/models/CustomPage'
import jwt from 'jsonwebtoken'

// GET - List all custom pages
export async function GET(request) {
  try {
    await connectDB()
    
    const token = request.headers.get('authorization')?.replace('Bearer ', '')
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    
    const pages = await CustomPage.find()
      .sort({ menuOrder: 1, createdAt: -1 })
      .lean()
    
    return NextResponse.json({ pages })
  } catch (error) {
    console.error('Error fetching custom pages:', error)
    return NextResponse.json({ error: 'Failed to fetch pages' }, { status: 500 })
  }
}

// POST - Create new custom page
export async function POST(request) {
  try {
    await connectDB()
    
    const token = request.headers.get('authorization')?.replace('Bearer ', '')
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    
    // Only super admin can create pages
    if (decoded.role !== 'super_admin') {
      return NextResponse.json({ error: 'Only Super Admin can create pages' }, { status: 403 })
    }

    const { slug, title, content, metaDescription, status, showInMenu, menuOrder } = await request.json()

    // Validate required fields
    if (!slug || !title || !content) {
      return NextResponse.json({ error: 'Slug, title, and content are required' }, { status: 400 })
    }

    // Check if slug already exists
    const existingPage = await CustomPage.findOne({ slug })
    if (existingPage) {
      return NextResponse.json({ error: 'A page with this slug already exists' }, { status: 400 })
    }

    const newPage = new CustomPage({
      slug,
      title,
      content,
      metaDescription: metaDescription || '',
      status: status || 'draft',
      showInMenu: showInMenu || false,
      menuOrder: menuOrder || 0,
      createdBy: decoded.id
    })

    await newPage.save()

    return NextResponse.json({ 
      message: 'Page created successfully',
      page: newPage 
    }, { status: 201 })
  } catch (error) {
    console.error('Error creating custom page:', error)
    return NextResponse.json({ error: 'Failed to create page' }, { status: 500 })
  }
}
