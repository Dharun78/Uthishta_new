import { NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import CustomPage from '@/lib/models/CustomPage'
import jwt from 'jsonwebtoken'

// GET - Get specific page
export async function GET(request, { params }) {
  try {
    await connectDB()
    
    const { slug } = params
    const page = await CustomPage.findOne({ slug }).lean()
    
    if (!page) {
      return NextResponse.json({ error: 'Page not found' }, { status: 404 })
    }
    
    return NextResponse.json({ page })
  } catch (error) {
    console.error('Error fetching page:', error)
    return NextResponse.json({ error: 'Failed to fetch page' }, { status: 500 })
  }
}

// PUT - Update page
export async function PUT(request, { params }) {
  try {
    await connectDB()
    
    const token = request.headers.get('authorization')?.replace('Bearer ', '')
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    
    // Only super admin can update pages
    if (decoded.role !== 'super_admin') {
      return NextResponse.json({ error: 'Only Super Admin can update pages' }, { status: 403 })
    }

    const { slug } = params
    const updates = await request.json()

    const page = await CustomPage.findOneAndUpdate(
      { slug },
      { $set: updates },
      { new: true, runValidators: true }
    )

    if (!page) {
      return NextResponse.json({ error: 'Page not found' }, { status: 404 })
    }

    return NextResponse.json({ 
      message: 'Page updated successfully',
      page 
    })
  } catch (error) {
    console.error('Error updating page:', error)
    return NextResponse.json({ error: 'Failed to update page' }, { status: 500 })
  }
}

// DELETE - Delete page
export async function DELETE(request, { params }) {
  try {
    await connectDB()
    
    const token = request.headers.get('authorization')?.replace('Bearer ', '')
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    
    // Only super admin can delete pages
    if (decoded.role !== 'super_admin') {
      return NextResponse.json({ error: 'Only Super Admin can delete pages' }, { status: 403 })
    }

    const { slug } = params
    const page = await CustomPage.findOneAndDelete({ slug })

    if (!page) {
      return NextResponse.json({ error: 'Page not found' }, { status: 404 })
    }

    return NextResponse.json({ message: 'Page deleted successfully' })
  } catch (error) {
    console.error('Error deleting page:', error)
    return NextResponse.json({ error: 'Failed to delete page' }, { status: 500 })
  }
}
