import { NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'
import dbConnect from '@/lib/mongodb'
import Grant from '@/lib/models/Grant'

const JWT_SECRET = process.env.JWT_SECRET || 'gjts-secret-key-2024'

// Mock grant database - in production, this would scrape real grant websites
const GRANT_SOURCES = [
  {
    title: 'Digital India Initiative - School Technology Grant 2026',
    description: 'Government grant for upgrading school technology infrastructure including computers, internet connectivity, and digital learning tools. Priority given to technical schools.',
    grantProvider: 'Ministry of Electronics and IT',
    providerType: 'government',
    amount: { min: 500000, max: 2000000, currency: 'INR' },
    applicationDeadline: new Date('2026-06-30'),
    grantUrl: 'https://digitalindia.gov.in/grants',
    applicationUrl: 'https://digitalindia.gov.in/apply',
    category: 'technology',
    targetBeneficiaries: ['government schools', 'technical schools', 'ITIs'],
    eligibilityCriteria: [
      { criterion: 'Government-recognized institution', met: true },
      { criterion: 'Technical/vocational focus', met: true },
      { criterion: 'Student strength > 100', met: true },
      { criterion: 'Existing basic infrastructure', met: true }
    ]
  },
  {
    title: 'Skill India Mission - Vocational Training Equipment Grant',
    description: 'Funding for purchasing modern equipment and tools for vocational training programs in technical schools. Covers machinery, tools, and safety equipment.',
    grantProvider: 'Ministry of Skill Development',
    providerType: 'government',
    amount: { min: 300000, max: 1500000, currency: 'INR' },
    applicationDeadline: new Date('2026-05-15'),
    grantUrl: 'https://skillindia.gov.in/grants',
    category: 'equipment',
    targetBeneficiaries: ['ITIs', 'technical schools', 'polytechnics'],
    eligibilityCriteria: [
      { criterion: 'Vocational training programs', met: true },
      { criterion: 'NSDC affiliation', met: false, notes: 'Can apply for affiliation' },
      { criterion: 'Placement track record', met: true }
    ]
  },
  {
    title: 'Quest Global CSR - Education Infrastructure 2026',
    description: 'Corporate Social Responsibility program supporting infrastructure development in technical education institutions. Focus on labs, workshops, and learning spaces.',
    grantProvider: 'Quest Global',
    providerType: 'corporate',
    amount: { min: 1000000, max: 5000000, currency: 'INR' },
    applicationDeadline: new Date('2026-08-31'),
    grantUrl: 'https://questglobal.com/csr',
    category: 'infrastructure',
    targetBeneficiaries: ['technical schools', 'engineering colleges'],
    eligibilityCriteria: [
      { criterion: 'Technical education focus', met: true },
      { criterion: 'Underserved community', met: true },
      { criterion: 'Partnership potential', met: true }
    ]
  },
  {
    title: 'Karnataka State Education Fund - School Development',
    description: 'State government fund for improving educational facilities and student support programs. Covers infrastructure, equipment, and student welfare.',
    grantProvider: 'Karnataka Education Department',
    providerType: 'government',
    amount: { min: 200000, max: 1000000, currency: 'INR' },
    applicationDeadline: new Date('2026-04-30'),
    grantUrl: 'https://schooleducation.karnataka.gov.in/grants',
    category: 'education',
    targetBeneficiaries: ['government schools', 'aided schools'],
    eligibilityCriteria: [
      { criterion: 'Located in Karnataka', met: true },
      { criterion: 'Government/aided institution', met: true },
      { criterion: 'Enrollment > 50 students', met: true }
    ]
  },
  {
    title: 'Infosys Foundation - STEM Education Grant 2026',
    description: 'Supporting STEM education initiatives in schools with focus on hands-on learning, innovation labs, and teacher training programs.',
    grantProvider: 'Infosys Foundation',
    providerType: 'private',
    amount: { min: 500000, max: 2500000, currency: 'INR' },
    applicationDeadline: new Date('2026-07-15'),
    grantUrl: 'https://infosys.com/infosys-foundation/grants',
    category: 'education',
    targetBeneficiaries: ['schools', 'colleges', 'training centers'],
    eligibilityCriteria: [
      { criterion: 'STEM focus', met: true },
      { criterion: 'Innovation in teaching', met: true },
      { criterion: 'Measurable outcomes', met: true }
    ]
  },
  {
    title: 'National Skill Development Corporation - Training Infrastructure',
    description: 'Grant for setting up modern training facilities, including workshops, labs, and digital learning centers for skill development.',
    grantProvider: 'NSDC',
    providerType: 'government',
    amount: { min: 400000, max: 1800000, currency: 'INR' },
    applicationDeadline: new Date('2026-06-15'),
    grantUrl: 'https://nsdcindia.org/grants',
    category: 'infrastructure',
    targetBeneficiaries: ['technical schools', 'skill training centers'],
    eligibilityCriteria: [
      { criterion: 'Skill development focus', met: true },
      { criterion: 'Industry partnerships', met: true },
      { criterion: 'Placement support', met: true }
    ]
  }
]

export async function POST(request) {
  try {
    const token = request.headers.get('authorization')?.replace('Bearer ', '')
    
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const decoded = jwt.verify(token, JWT_SECRET)
    await dbConnect()

    const { keywords, school } = await request.json()

    // Filter grants based on keywords
    let filteredGrants = GRANT_SOURCES
    
    if (keywords && keywords.toLowerCase() !== 'all') {
      const searchTerm = keywords.toLowerCase()
      filteredGrants = GRANT_SOURCES.filter(grant =>
        grant.title.toLowerCase().includes(searchTerm) ||
        grant.description.toLowerCase().includes(searchTerm) ||
        grant.category.toLowerCase().includes(searchTerm) ||
        grant.grantProvider.toLowerCase().includes(searchTerm)
      )
    }

    // Calculate eligibility score for each grant
    const grantsWithScores = filteredGrants.map(grant => {
      const totalCriteria = grant.eligibilityCriteria.length
      const metCriteria = grant.eligibilityCriteria.filter(c => c.met).length
      const baseScore = (metCriteria / totalCriteria) * 100

      // Bonus points
      let score = baseScore
      if (grant.providerType === 'government') score += 5
      if (grant.targetBeneficiaries.some(b => b.includes('technical'))) score += 10
      
      score = Math.min(100, Math.round(score))

      return {
        ...grant,
        applicableSchools: [school],
        discoveredBy: 'ai-agent',
        discoveredAt: new Date(),
        aiEligibilityScore: score,
        aiRecommendation: {
          shouldApply: score >= 60,
          reasoning: score >= 80 
            ? `Excellent match! You meet ${metCriteria}/${totalCriteria} criteria. Strong recommendation to apply.`
            : score >= 60
            ? `Good match. You meet ${metCriteria}/${totalCriteria} criteria. Worth applying with proper preparation.`
            : `Moderate match. You meet ${metCriteria}/${totalCriteria} criteria. Consider strengthening your application.`,
          successProbability: score,
          requiredDocuments: [
            'School registration certificate',
            'Last 2 years financial statements',
            'Student enrollment data',
            'Infrastructure details',
            'Project proposal'
          ],
          estimatedEffort: score >= 80 ? 'Low - straightforward application' : 'Medium - requires detailed documentation'
        }
      }
    })

    // Sort by eligibility score
    grantsWithScores.sort((a, b) => b.aiEligibilityScore - a.aiEligibilityScore)

    // Save to database
    for (const grantData of grantsWithScores) {
      const existingGrant = await Grant.findOne({ 
        title: grantData.title,
        grantProvider: grantData.grantProvider
      })
      
      if (!existingGrant) {
        const grant = new Grant(grantData)
        await grant.save()
      }
    }

    return NextResponse.json({
      success: true,
      grants: grantsWithScores,
      message: `Found ${grantsWithScores.length} grants matching your criteria`
    })
  } catch (error) {
    console.error('Error searching grants:', error)
    return NextResponse.json({ 
      error: 'Failed to search grants',
      message: error.message
    }, { status: 500 })
  }
}
