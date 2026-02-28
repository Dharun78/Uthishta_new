import { NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'
import dbConnect from '@/lib/mongodb'
import AlumniFund from '@/lib/models/AlumniFund'

const JWT_SECRET = process.env.JWT_SECRET || 'gjts-secret-key-2024'

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
    
    let schoolFilter = {}
    
    // If super admin and school filter is provided
    if (decoded.role === 'super_admin' && schoolParam && schoolParam !== 'All') {
      schoolFilter = { school: schoolParam }
    } 
    // If super admin viewing all schools
    else if (decoded.role === 'super_admin' && (!schoolParam || schoolParam === 'All')) {
      // No filter - get all schools
      schoolFilter = {}
    }
    // School admin - only their school
    else {
      schoolFilter = { school: decoded.school }
    }

    // Get donations with school filter
    const donations = await AlumniFund.find({ 
      ...schoolFilter,
      status: 'completed'
    }).sort({ createdAt: -1 }).limit(10)

    // Calculate basic stats
    const allDonations = await AlumniFund.find({ 
      ...schoolFilter,
      status: 'completed'
    })

    const totalFunds = allDonations.reduce((sum, d) => sum + d.amount, 0)
    const donorCount = new Set(allDonations.map(d => d.alumniId.toString())).size

    // Group by purpose
    const byPurpose = {}
    allDonations.forEach(d => {
      byPurpose[d.purpose] = (byPurpose[d.purpose] || 0) + d.amount
    })

    // Monthly trend (last 6 months)
    const monthlyTrend = []
    for (let i = 5; i >= 0; i--) {
      const date = new Date()
      date.setMonth(date.getMonth() - i)
      const monthStart = new Date(date.getFullYear(), date.getMonth(), 1)
      const monthEnd = new Date(date.getFullYear(), date.getMonth() + 1, 0)

      const monthDonations = allDonations.filter(d => 
        d.createdAt >= monthStart && d.createdAt <= monthEnd
      )

      monthlyTrend.push({
        month: monthStart.toLocaleDateString('en-IN', { month: 'short', year: 'numeric' }),
        amount: monthDonations.reduce((sum, d) => sum + d.amount, 0),
        count: monthDonations.length
      })
    }

    // Top donors
    const donorTotals = {}
    allDonations.forEach(d => {
      const key = d.alumniId.toString()
      donorTotals[key] = (donorTotals[key] || 0) + d.amount
    })

    const topDonors = Object.entries(donorTotals)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([alumniId, amount]) => {
        const donation = allDonations.find(d => d.alumniId.toString() === alumniId)
        return {
          alumniId,
          name: donation.alumniName,
          amount
        }
      })

    const stats = {
      totalFunds,
      donorCount,
      averageDonation: totalFunds / allDonations.length || 0,
      byPurpose,
      monthlyTrend,
      topDonors,
      insights: [
        {
          type: 'info',
          message: `Total funds raised: ₹${totalFunds.toLocaleString('en-IN')}`,
          action: 'Continue fundraising efforts'
        }
      ]
    }

    return NextResponse.json({
      success: true,
      stats,
      recentDonations: donations
    })
  } catch (error) {
    console.error('Error fetching funds:', error)
    return NextResponse.json({ 
      error: 'Failed to fetch fund data',
      message: error.message
    }, { status: 500 })
  }
}

export async function POST(request) {
  try {
    const token = request.headers.get('authorization')?.replace('Bearer ', '')
    
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const decoded = jwt.verify(token, JWT_SECRET)
    await dbConnect()

    const donationData = await request.json()
    donationData.school = decoded.school

    // Create donation
    const donation = new AlumniFund(donationData)
    await donation.save()

    return NextResponse.json({
      success: true,
      donation,
      message: 'Donation tracked successfully'
    })
  } catch (error) {
    console.error('Error tracking donation:', error)
    return NextResponse.json({ 
      error: 'Failed to track donation',
      message: error.message
    }, { status: 500 })
  }
}
