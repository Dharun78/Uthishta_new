import { NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'
import dbConnect from '@/lib/mongodb'
import GeneralSettings from '@/lib/models/GeneralSettings'

const JWT_SECRET = process.env.JWT_SECRET || 'gjts-secret-key-2024'

// GET - Fetch general settings
export async function GET(request) {
  try {
    const token = request.headers.get('authorization')?.replace('Bearer ', '')
    
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const decoded = jwt.verify(token, JWT_SECRET)
    
    // Only super admin can access general settings
    if (decoded.role !== 'super_admin') {
      return NextResponse.json({ 
        error: 'Unauthorized - Only super admin can access general settings' 
      }, { status: 403 })
    }

    await dbConnect()

    // Get or create general settings
    let settings = await GeneralSettings.findOne({ settingKey: 'general' })
    
    if (!settings) {
      settings = await GeneralSettings.create({
        settingKey: 'general',
        siteName: 'GJTS Karnataka',
        siteDescription: 'Government Junior Technical Schools in Karnataka',
        aboutUs: 'GJTS Karnataka is a network of government technical schools providing quality education to students across Karnataka.',
        contactEmail: 'info@gjtskarnataka.edu.in',
        contactPhone: '+91-XXX-XXX-XXXX',
        officeAddress: 'Karnataka, India',
        officeHours: 'Monday - Friday: 9:00 AM - 5:00 PM',
        socialMedia: {},
        announcements: [],
        updatedBy: decoded.email || decoded.username
      })
    }

    return NextResponse.json({ 
      success: true,
      settings 
    })
  } catch (error) {
    console.error('Error fetching settings:', error)
    return NextResponse.json({ 
      error: 'Failed to fetch settings',
      message: error.message 
    }, { status: 500 })
  }
}

// PUT - Update general settings
export async function PUT(request) {
  try {
    const token = request.headers.get('authorization')?.replace('Bearer ', '')
    
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const decoded = jwt.verify(token, JWT_SECRET)
    
    // Only super admin can update general settings
    if (decoded.role !== 'super_admin') {
      return NextResponse.json({ 
        error: 'Unauthorized - Only super admin can update general settings' 
      }, { status: 403 })
    }

    await dbConnect()

    const data = await request.json()
    
    // Update or create settings
    const settings = await GeneralSettings.findOneAndUpdate(
      { settingKey: 'general' },
      {
        ...data,
        settingKey: 'general', // Ensure key stays the same
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
      settings,
      message: 'Settings updated successfully'
    })
  } catch (error) {
    console.error('Error updating settings:', error)
    return NextResponse.json({ 
      error: 'Failed to update settings',
      message: error.message 
    }, { status: 500 })
  }
}
