/**
 * AI Grant Discovery Agent
 * Two main tasks:
 * 1. Search internet for grants applicable to the school
 * 2. Check eligibility of school for specific grants
 */

const Grant = require('../models/Grant')
const axios = require('axios')

class GrantDiscoveryAgent {
  constructor() {
    this.initialized = false
  }

  /**
   * Task 1: Search for grants on the internet
   */
  async searchGrants(school, keywords = 'education technical school') {
    try {
      console.log(`AI Agent searching for grants for ${school}...`)

      // Simulated grant discovery (in production, use web scraping or APIs)
      const discoveredGrants = await this.simulateGrantSearch(school, keywords)

      // Save to database
      const savedGrants = []
      for (const grantData of discoveredGrants) {
        const grant = new Grant({
          ...grantData,
          applicableSchools: [school],
          discoveredBy: 'ai-agent',
          discoveredAt: new Date()
        })

        // Check eligibility
        const eligibility = await this.checkEligibility(school, grant)
        grant.aiEligibilityScore = eligibility.score
        grant.aiRecommendation = eligibility.recommendation

        await grant.save()
        savedGrants.push(grant)
      }

      return {
        success: true,
        grantsFound: savedGrants.length,
        grants: savedGrants,
        message: `Found ${savedGrants.length} potential grants for ${school}`
      }
    } catch (error) {
      console.error('Error searching grants:', error)
      return {
        success: false,
        error: error.message
      }
    }
  }

  /**
   * Simulate grant search (replace with actual web scraping/API calls)
   */
  async simulateGrantSearch(school, keywords) {
    // In production, this would:
    // 1. Search government websites (grants.gov.in, etc.)
    // 2. Check private foundation databases
    // 3. Monitor corporate CSR programs
    // 4. Track international funding opportunities

    const mockGrants = [
      {
        title: 'Digital India Initiative - School Technology Grant',
        description: 'Government grant for upgrading school technology infrastructure including computers, internet connectivity, and digital learning tools.',
        grantProvider: 'Ministry of Electronics and IT',
        providerType: 'government',
        amount: {
          min: 500000,
          max: 2000000,
          currency: 'INR'
        },
        applicationDeadline: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000), // 90 days from now
        grantUrl: 'https://digitalindia.gov.in/grants',
        applicationUrl: 'https://digitalindia.gov.in/apply',
        category: 'technology',
        targetBeneficiaries: ['government schools', 'technical schools'],
        eligibilityCriteria: [
          { criterion: 'Government-recognized institution', met: true },
          { criterion: 'Technical/vocational focus', met: true },
          { criterion: 'Student strength > 100', met: true },
          { criterion: 'Existing basic infrastructure', met: true }
        ]
      },
      {
        title: 'Skill India Mission - Vocational Training Equipment Grant',
        description: 'Funding for purchasing modern equipment and tools for vocational training programs in technical schools.',
        grantProvider: 'Ministry of Skill Development',
        providerType: 'government',
        amount: {
          min: 300000,
          max: 1500000,
          currency: 'INR'
        },
        applicationDeadline: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
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
        title: 'Quest Global CSR - Education Infrastructure',
        description: 'Corporate Social Responsibility program supporting infrastructure development in technical education institutions.',
        grantProvider: 'Quest Global',
        providerType: 'corporate',
        amount: {
          min: 1000000,
          max: 5000000,
          currency: 'INR'
        },
        applicationDeadline: new Date(Date.now() + 120 * 24 * 60 * 60 * 1000),
        grantUrl: 'https://questglobal.com/csr',
        category: 'infrastructure',
        targetBeneficiaries: ['technical schools', 'engineering colleges'],
        eligibilityCriteria: [
          { criterion: 'Technical education focus', met: true },
          { criterion: 'Underserved community', met: true },
          { criterion: 'Existing partnership', met: true, notes: 'Already partnered with Quest Global' }
        ]
      },
      {
        title: 'Karnataka State Education Fund',
        description: 'State government fund for improving educational facilities and student support programs.',
        grantProvider: 'Karnataka Education Department',
        providerType: 'government',
        amount: {
          min: 200000,
          max: 1000000,
          currency: 'INR'
        },
        applicationDeadline: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000),
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
        title: 'Infosys Foundation - STEM Education Grant',
        description: 'Supporting STEM education initiatives in schools with focus on hands-on learning and innovation.',
        grantProvider: 'Infosys Foundation',
        providerType: 'private',
        amount: {
          min: 500000,
          max: 2500000,
          currency: 'INR'
        },
        applicationDeadline: new Date(Date.now() + 75 * 24 * 60 * 60 * 1000),
        grantUrl: 'https://infosys.com/infosys-foundation/grants',
        category: 'education',
        targetBeneficiaries: ['schools', 'colleges', 'training centers'],
        eligibilityCriteria: [
          { criterion: 'STEM focus', met: true },
          { criterion: 'Innovation in teaching', met: true },
          { criterion: 'Measurable outcomes', met: true }
        ]
      }
    ]

    // Filter based on keywords
    return mockGrants.filter(grant => 
      grant.description.toLowerCase().includes(keywords.toLowerCase()) ||
      grant.category.toLowerCase().includes(keywords.toLowerCase())
    )
  }

  /**
   * Task 2: Check eligibility for a specific grant
   */
  async checkEligibility(school, grant) {
    try {
      console.log(`AI Agent checking eligibility for ${school}...`)

      // School profile (in production, fetch from database)
      const schoolProfile = this.getSchoolProfile(school)

      // Calculate eligibility score
      let score = 0
      let totalCriteria = grant.eligibilityCriteria?.length || 0
      let metCriteria = 0

      if (grant.eligibilityCriteria) {
        grant.eligibilityCriteria.forEach(criterion => {
          if (criterion.met) {
            metCriteria++
            score += 100 / totalCriteria
          }
        })
      }

      // Additional scoring based on school profile
      if (grant.targetBeneficiaries) {
        const matches = grant.targetBeneficiaries.some(beneficiary =>
          beneficiary.toLowerCase().includes('technical') ||
          beneficiary.toLowerCase().includes('vocational')
        )
        if (matches) score += 10
      }

      // Provider type bonus
      if (grant.providerType === 'government') score += 5
      if (grant.providerType === 'corporate' && schoolProfile.hasPartnership) score += 10

      score = Math.min(100, Math.round(score))

      // Generate recommendation
      const recommendation = this.generateEligibilityRecommendation(
        score,
        metCriteria,
        totalCriteria,
        grant
      )

      return {
        score,
        metCriteria,
        totalCriteria,
        recommendation
      }
    } catch (error) {
      console.error('Error checking eligibility:', error)
      return {
        score: 0,
        recommendation: {
          shouldApply: false,
          reasoning: 'Unable to determine eligibility',
          successProbability: 0
        }
      }
    }
  }

  getSchoolProfile(school) {
    // In production, fetch from database
    const profiles = {
      'Ballari': {
        students: 150,
        established: 2013,
        hasPartnership: true,
        placementRate: 70,
        infrastructure: 'good'
      },
      'Bhadravati': {
        students: 140,
        established: 2023,
        hasPartnership: true,
        placementRate: 65,
        infrastructure: 'developing'
      },
      'Hubballi': {
        students: 160,
        established: 2013,
        hasPartnership: true,
        placementRate: 75,
        infrastructure: 'excellent'
      },
      'Bagalkot': {
        students: 135,
        established: 2023,
        hasPartnership: true,
        placementRate: 60,
        infrastructure: 'developing'
      },
      'Kalburgi': {
        students: 145,
        established: 2023,
        hasPartnership: true,
        placementRate: 68,
        infrastructure: 'good'
      },
      'Mangalore': {
        students: 155,
        established: 2023,
        hasPartnership: true,
        placementRate: 72,
        infrastructure: 'good'
      }
    }

    return profiles[school] || profiles['Ballari']
  }

  generateEligibilityRecommendation(score, metCriteria, totalCriteria, grant) {
    let shouldApply = score >= 60
    let successProbability = score
    let reasoning = ''
    let requiredDocuments = []
    let estimatedEffort = ''

    if (score >= 80) {
      reasoning = `Excellent match! You meet ${metCriteria}/${totalCriteria} criteria. Strong recommendation to apply.`
      estimatedEffort = 'Low - straightforward application'
      requiredDocuments = [
        'School registration certificate',
        'Last 2 years financial statements',
        'Student enrollment data',
        'Infrastructure details',
        'Project proposal'
      ]
    } else if (score >= 60) {
      reasoning = `Good match. You meet ${metCriteria}/${totalCriteria} criteria. Worth applying with proper preparation.`
      estimatedEffort = 'Medium - requires detailed documentation'
      requiredDocuments = [
        'School registration certificate',
        'Financial statements',
        'Detailed project plan',
        'Budget breakdown',
        'Impact assessment'
      ]
    } else if (score >= 40) {
      reasoning = `Moderate match. You meet ${metCriteria}/${totalCriteria} criteria. Consider strengthening your application.`
      estimatedEffort = 'High - significant preparation needed'
      shouldApply = false
    } else {
      reasoning = `Low match. You meet only ${metCriteria}/${totalCriteria} criteria. Focus on other opportunities.`
      estimatedEffort = 'Very High - may not be worth the effort'
      shouldApply = false
    }

    return {
      shouldApply,
      reasoning,
      successProbability,
      requiredDocuments,
      estimatedEffort
    }
  }

  /**
   * Process natural language query from chat
   */
  async processQuery(message, school) {
    const lowerMessage = message.toLowerCase()

    // Task 1: Search for grants
    if (lowerMessage.includes('search') || lowerMessage.includes('find') || lowerMessage.includes('look for')) {
      // Extract keywords
      let keywords = 'education technical school'
      if (lowerMessage.includes('infrastructure')) keywords = 'infrastructure'
      else if (lowerMessage.includes('equipment')) keywords = 'equipment'
      else if (lowerMessage.includes('technology')) keywords = 'technology'
      else if (lowerMessage.includes('scholarship')) keywords = 'scholarship'

      const result = await this.searchGrants(school, keywords)
      
      return {
        response: result.message + '\n\nI found several grants that might be suitable. Click on any grant to see details and eligibility analysis.',
        grants: result.grants
      }
    }

    // Task 2: Check eligibility
    if (lowerMessage.includes('eligible') || lowerMessage.includes('qualify') || lowerMessage.includes('check')) {
      // Get recent grants
      const grants = await Grant.find({ applicableSchools: school })
        .sort({ discoveredAt: -1 })
        .limit(1)

      if (grants.length === 0) {
        return {
          response: 'Please ask me to search for grants first, then I can check eligibility.'
        }
      }

      const grant = grants[0]
      const eligibility = await this.checkEligibility(school, grant)

      return {
        response: `I've analyzed your eligibility for "${grant.title}":\n\n${eligibility.recommendation.reasoning}\n\nSuccess Probability: ${eligibility.recommendation.successProbability}%`,
        eligibility: {
          score: eligibility.score,
          recommendation: eligibility.recommendation.reasoning,
          shouldApply: eligibility.recommendation.shouldApply
        }
      }
    }

    // General response
    return {
      response: 'I can help you with:\n\n1. 🔍 Search for grants - Say "search for education grants" or "find infrastructure grants"\n\n2. ✅ Check eligibility - Say "check eligibility" or "am I eligible for this grant"\n\nWhat would you like me to do?'
    }
  }
}

module.exports = new GrantDiscoveryAgent()
