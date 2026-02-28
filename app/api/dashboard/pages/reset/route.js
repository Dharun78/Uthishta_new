import { NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'
import dbConnect from '@/lib/mongodb'
import PageContent from '@/lib/models/PageContent'

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production'

function verifyToken(request) {
  const authHeader = request.headers.get('authorization')
  if (!authHeader) return null

  const token = authHeader.replace('Bearer ', '')
  try {
    return jwt.verify(token, JWT_SECRET)
  } catch (error) {
    return null
  }
}

export async function POST(request) {
  try {
    await dbConnect()
    
    const decoded = verifyToken(request)
    
    if (!decoded || decoded.role !== 'super_admin') {
      return NextResponse.json(
        { error: 'Unauthorized - Super Admin only' },
        { status: 401 }
      )
    }

    const { page } = await request.json()

    if (page === 'home') {
      // Reset home page with clean structure
      await PageContent.findOneAndUpdate(
        { page: 'home' },
        {
          page: 'home',
          sections: {
            hero: {
              title: 'Government Junior Technical Schools Karnataka',
              subtitle: 'Empowering Youth Through Technical Education',
              description: 'Building skilled professionals for tomorrow'
            },
            stats: {
              students: '800+',
              schools: '6',
              placement: '70%',
              growth: '17%'
            },
            facilities: [],
            achievements: []
          }
        },
        { upsert: true, new: true }
      )

      return NextResponse.json({
        success: true,
        message: 'Home page reset successfully'
      })
    }

    return NextResponse.json(
      { error: 'Invalid page' },
      { status: 400 }
    )
  } catch (error) {
    console.error('Error resetting page:', error)
    return NextResponse.json(
      { error: 'Failed to reset page' },
      { status: 500 }
    )
  }
}
