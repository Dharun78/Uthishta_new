import { NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'
import dbConnect from '@/lib/mongodb'
import PageContent from '@/lib/models/PageContent'

const JWT_SECRET = process.env.JWT_SECRET || 'gjts-secret-key-2024'

// Default content for each page
const defaultContent = {
  home: {
    hero: {
      title: 'Government Junior Technical Schools Karnataka',
      subtitle: 'Empowering Youth Through Technical Education',
      description: 'Building skilled professionals for tomorrow through quality technical education across Karnataka',
      ctaText: 'Explore Schools',
      ctaLink: '/schools'
    },
    stats: {
      students: '800+',
      schools: '6',
      placement: '70%',
      growth: '17%'
    },
    features: [
      {
        title: 'Quality Technical Education',
        description: 'Industry-aligned curriculum with hands-on training',
        icon: 'graduation-cap'
      },
      {
        title: 'Modern Infrastructure',
        description: 'Well-equipped labs and workshops',
        icon: 'building'
      },
      {
        title: 'Industry Partnerships',
        description: 'Collaborations with leading companies like Quest Global',
        icon: 'handshake'
      }
    ]
  },
  about: {
    mission: 'To provide quality technical education and skill development to students across Karnataka',
    vision: 'To be the leading technical education institution empowering youth with industry-ready skills',
    history: 'Established in 2013, GJTS has been at the forefront of technical education in Karnataka',
    values: [
      'Excellence in Education',
      'Industry Collaboration',
      'Student-Centric Approach',
      'Innovation and Growth'
    ]
  },
  admissions: {
    process: [
      'Fill online application form',
      'Submit required documents',
      'Attend entrance test',
      'Merit-based selection',
      'Complete admission formalities'
    ],
    eligibility: {
      education: 'Completed 7th standard',
      age: '13-15 years',
      documents: ['Birth certificate', 'School leaving certificate', 'Caste certificate (if applicable)']
    },
    dates: {
      applicationStart: 'March 1, 2026',
      applicationEnd: 'May 31, 2026',
      entranceTest: 'June 15, 2026',
      resultsAnnouncement: 'June 30, 2026'
    }
  },
  contact: {
    mainOffice: {
      address: 'Department of Technical Education, Government of Karnataka, Bangalore',
      phone: '+91-80-XXXX-XXXX',
      email: 'info@gjtskarnataka.edu.in',
      hours: 'Monday - Friday: 9:00 AM - 5:00 PM'
    },
    socialMedia: {
      facebook: 'https://facebook.com/gjtskarnataka',
      twitter: 'https://twitter.com/gjtskarnataka',
      instagram: 'https://instagram.com/gjtskarnataka',
      linkedin: 'https://linkedin.com/company/gjtskarnataka'
    }
  },
  alumni: {
    registrationInfo: 'Join our growing alumni network and stay connected',
    benefits: [
      'Networking opportunities',
      'Career guidance',
      'Exclusive events',
      'Mentorship programs'
    ]
  }
}

// GET - Fetch page content (public access allowed)
export async function GET(request) {
  try {
    await dbConnect()

    const { searchParams } = new URL(request.url)
    const page = searchParams.get('page')

    if (!page) {
      // Return all pages (requires auth)
      const token = request.headers.get('authorization')?.replace('Bearer ', '')
      if (!token) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
      }
      jwt.verify(token, JWT_SECRET)
      
      const allPages = await PageContent.find({})
      return NextResponse.json({ 
        success: true,
        pages: allPages
      })
    }

    // Get specific page content (public access)
    let content = await PageContent.findOne({ page })
    
    // If no content exists, return default content
    if (!content) {
      return NextResponse.json({ 
        success: true,
        content: {
          page,
          sections: defaultContent[page] || {}
        }
      })
    }

    return NextResponse.json({ 
      success: true,
      content 
    })
  } catch (error) {
    console.error('Error fetching page content:', error)
    return NextResponse.json({ 
      error: 'Failed to fetch content',
      message: error.message 
    }, { status: 500 })
  }
}

// PUT - Update page content
export async function PUT(request) {
  try {
    const token = request.headers.get('authorization')?.replace('Bearer ', '')
    
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const decoded = jwt.verify(token, JWT_SECRET)
    
    // Only super admin can edit pages
    if (decoded.role !== 'super_admin') {
      return NextResponse.json({ 
        error: 'Unauthorized - Only Super Admin can edit website pages' 
      }, { status: 403 })
    }

    await dbConnect()

    const data = await request.json()
    const { page, sections } = data

    // Update or create content
    const content = await PageContent.findOneAndUpdate(
      { page },
      {
        sections,
        updatedBy: decoded.username || decoded.email,
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
      message: 'Page content updated successfully'
    })
  } catch (error) {
    console.error('Error updating page content:', error)
    return NextResponse.json({ 
      error: 'Failed to update content',
      message: error.message 
    }, { status: 500 })
  }
}
