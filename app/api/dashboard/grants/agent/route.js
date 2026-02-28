import { NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'
import dbConnect from '@/lib/mongodb'
import Grant from '@/lib/models/Grant'

const JWT_SECRET = process.env.JWT_SECRET || 'gjts-secret-key-2024'

export async function POST(request) {
  try {
    const token = request.headers.get('authorization')?.replace('Bearer ', '')
    
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const decoded = jwt.verify(token, JWT_SECRET)
    await dbConnect()

    const { message, school } = await request.json()
    const lowerMessage = message.toLowerCase()

    // Task 1: Search for grants
    if (lowerMessage.includes('search') || lowerMessage.includes('find') || lowerMessage.includes('look for') || lowerMessage.includes('show')) {
      // Extract keywords
      let query = {}
      
      if (lowerMessage.includes('infrastructure')) {
        query.category = 'infrastructure'
      } else if (lowerMessage.includes('equipment')) {
        query.category = 'equipment'
      } else if (lowerMessage.includes('technology') || lowerMessage.includes('tech')) {
        query.category = 'technology'
      } else if (lowerMessage.includes('education')) {
        query.category = 'education'
      }

      // Search grants in database
      query.applicableSchools = school
      const grants = await Grant.find(query)
        .sort({ aiEligibilityScore: -1 })
        .limit(10)

      if (grants.length === 0) {
        return NextResponse.json({
          success: true,
          response: 'No grants found matching your criteria. Try:\n\n- "Search for all grants"\n- "Find education grants"\n- "Show technology grants"',
          grants: []
        })
      }

      const topGrants = grants.slice(0, 5)
      return NextResponse.json({
        success: true,
        response: `🎯 I found ${grants.length} grants for your school!\n\nHere are the top matches based on eligibility:\n\n${topGrants.map((g, i) => `${i + 1}. ${g.title} (${g.aiEligibilityScore}% match)`).join('\n')}\n\nClick on any grant to see full details and eligibility analysis.`,
        grants: topGrants
      })
    }

    // Task 2: Check eligibility
    if (lowerMessage.includes('eligible') || lowerMessage.includes('qualify') || lowerMessage.includes('check') || lowerMessage.includes('can i apply')) {
      const grants = await Grant.find({ 
        applicableSchools: school 
      }).sort({ aiEligibilityScore: -1 }).limit(1)

      if (grants.length === 0) {
        return NextResponse.json({
          success: true,
          response: 'Please ask me to search for grants first, then I can check your eligibility. Try saying: "Search for education grants"'
        })
      }

      const grant = grants[0]
      const recommendation = grant.aiRecommendation

      return NextResponse.json({
        success: true,
        response: `📊 Eligibility Analysis for "${grant.title}":\n\n${recommendation.reasoning}\n\n✅ Success Probability: ${recommendation.successProbability}%\n💡 Effort Required: ${recommendation.estimatedEffort}\n\n${recommendation.shouldApply ? '✓ Recommendation: APPLY' : '✗ Recommendation: Consider other grants'}`,
        eligibility: {
          score: grant.aiEligibilityScore,
          recommendation: recommendation.reasoning,
          shouldApply: recommendation.shouldApply,
          documents: recommendation.requiredDocuments
        },
        grants: [grant]
      })
    }

    // General help
    return NextResponse.json({
      success: true,
      response: `👋 I'm your AI Grant Discovery Agent! I can help you with:\n\n🔍 **Search for Grants**\nTry: "Search for technology grants" or "Find infrastructure grants"\n\n✅ **Check Eligibility**\nTry: "Check eligibility" or "Am I eligible for this grant?"\n\n📚 **Browse by Category**\nTry: "Show education grants" or "Find equipment grants"\n\nWhat would you like to do?`
    })
  } catch (error) {
    console.error('Error processing agent query:', error)
    return NextResponse.json({ 
      success: false,
      error: 'Failed to process query',
      response: `Sorry, I encountered an error: ${error.message}\n\nPlease make sure the database is seeded. Run: node scripts/seed-database.js`,
      message: error.message
    }, { status: 500 })
  }
}
