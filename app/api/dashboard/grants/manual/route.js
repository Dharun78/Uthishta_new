import { NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'
import connectDB from '@/lib/mongodb'
import Grant from '@/lib/models/Grant'

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production'

function verifyToken(token) {
  try {
    return jwt.verify(token, JWT_SECRET)
  } catch (error) {
    return null
  }
}

export async function POST(request) {
  try {
    // Verify authentication
    const authHeader = request.headers.get('authorization')
    if (!authHeader) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const token = authHeader.replace('Bearer ', '')
    const decoded = verifyToken(token)
    
    if (!decoded || decoded.role !== 'super_admin') {
      return NextResponse.json({ error: 'Unauthorized - Super Admin only' }, { status: 403 })
    }

    await connectDB()

    const data = await request.json()
    
    // Parse eligibility if it's a comma-separated string
    let eligibilityCriteria = []
    if (data.eligibility && typeof data.eligibility === 'string') {
      const criteria = data.eligibility.split(',').map(item => item.trim()).filter(item => item)
      eligibilityCriteria = criteria.map(criterion => ({
        criterion,
        met: false,
        notes: ''
      }))
    }

    // Map form categories to model categories
    const categoryMapping = {
      'Infrastructure & Quality': 'infrastructure',
      'Digital Infrastructure': 'technology',
      'Laboratory & Equipment': 'infrastructure',
      'Library & Resources': 'education',
      'Sports & Physical Education': 'infrastructure',
      'Teacher Development': 'education',
      'Inclusive Education': 'education',
      'Vocational Training': 'skill-development',
      'Maintenance': 'infrastructure',
      'Nutrition & Welfare': 'other'
    }

    // Map form status to model status
    const statusMapping = {
      'active': 'discovered',
      'inactive': 'not-eligible'
    }

    // Parse amount string to numbers
    let amountObj = { currency: 'INR' }
    if (data.amount) {
      // Try to extract numbers from amount string like "Rs 5-15 lakh"
      const amountStr = data.amount.toLowerCase()
      const numbers = amountStr.match(/\d+/g)
      if (numbers && numbers.length >= 1) {
        const multiplier = amountStr.includes('lakh') ? 100000 : 
                          amountStr.includes('crore') ? 10000000 : 1
        amountObj.min = parseInt(numbers[0]) * multiplier
        if (numbers.length > 1) {
          amountObj.max = parseInt(numbers[1]) * multiplier
        }
      }
    }

    // Parse deadline
    let applicationDeadline = new Date()
    if (data.deadline) {
      // Try to parse deadline string
      const deadlineStr = data.deadline.toLowerCase()
      if (deadlineStr.includes('march')) {
        applicationDeadline = new Date('2026-03-31')
      } else if (deadlineStr.includes('april')) {
        applicationDeadline = new Date('2026-04-30')
      } else if (deadlineStr.includes('may')) {
        applicationDeadline = new Date('2026-05-31')
      } else if (deadlineStr.includes('rolling') || deadlineStr.includes('ongoing')) {
        applicationDeadline = new Date('2026-12-31')
      } else {
        // Try to parse as date
        const parsed = new Date(data.deadline)
        if (!isNaN(parsed.getTime())) {
          applicationDeadline = parsed
        }
      }
    }

    // Create grant document with correct field mapping
    const grant = await Grant.create({
      title: data.name, // Form sends 'name', model expects 'title'
      description: data.description,
      grantProvider: data.provider, // Form sends 'provider', model expects 'grantProvider'
      providerType: 'government', // Default to government
      amount: amountObj,
      eligibilityCriteria: eligibilityCriteria,
      applicationDeadline: applicationDeadline,
      applicationUrl: data.applicationUrl,
      category: categoryMapping[data.category] || 'other',
      status: statusMapping[data.status] || 'discovered',
      discoveredBy: 'manual',
      applicableSchools: ['Ballari', 'Bhadravati', 'Hubballi', 'Bagalkot', 'Kalburgi', 'Mangalore'], // All schools by default
      discoveredAt: new Date(),
      lastUpdated: new Date()
    })

    return NextResponse.json({
      success: true,
      grant
    })
  } catch (error) {
    console.error('Error adding grant:', error)
    return NextResponse.json(
      { error: 'Failed to add grant', details: error.message },
      { status: 500 }
    )
  }
}
