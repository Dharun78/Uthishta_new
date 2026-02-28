/**
 * AI-Powered Fund Manager
 * Automatically tracks alumni donations and analyzes funding patterns
 */

const AlumniFund = require('../models/AlumniFund')
const Alumni = require('../models/Alumni')

class AIFundManager {
  constructor() {
    this.initialized = false
  }

  /**
   * AI analyzes donation patterns and predicts future donations
   */
  async analyzeDonorPattern(alumniId) {
    try {
      const donations = await AlumniFund.find({ 
        alumniId, 
        status: 'completed' 
      }).sort({ createdAt: 1 })

      if (donations.length === 0) {
        return {
          donorPattern: 'new-donor',
          predictedNextDonation: null,
          engagementScore: 0,
          recommendations: ['Send welcome email', 'Share impact stories']
        }
      }

      // Calculate donation frequency
      const daysBetweenDonations = []
      for (let i = 1; i < donations.length; i++) {
        const days = Math.floor(
          (donations[i].createdAt - donations[i-1].createdAt) / (1000 * 60 * 60 * 24)
        )
        daysBetweenDonations.push(days)
      }

      const avgDaysBetween = daysBetweenDonations.length > 0
        ? daysBetweenDonations.reduce((a, b) => a + b, 0) / daysBetweenDonations.length
        : 365

      // Predict next donation
      const lastDonation = donations[donations.length - 1]
      const predictedNextDonation = new Date(lastDonation.createdAt)
      predictedNextDonation.setDate(predictedNextDonation.getDate() + avgDaysBetween)

      // Calculate engagement score (0-100)
      const totalAmount = donations.reduce((sum, d) => sum + d.amount, 0)
      const frequency = donations.length
      const recency = Math.max(0, 100 - Math.floor(
        (Date.now() - lastDonation.createdAt) / (1000 * 60 * 60 * 24)
      ))
      
      const engagementScore = Math.min(100, Math.floor(
        (frequency * 20) + (totalAmount / 1000) + recency
      ))

      // Determine donor pattern
      let donorPattern = 'occasional'
      if (frequency >= 12) donorPattern = 'regular'
      else if (frequency >= 6) donorPattern = 'frequent'
      else if (frequency >= 3) donorPattern = 'moderate'

      // AI recommendations
      const recommendations = this.generateRecommendations(
        donorPattern,
        engagementScore,
        totalAmount,
        lastDonation
      )

      return {
        donorPattern,
        predictedNextDonation,
        engagementScore,
        recommendations,
        totalDonated: totalAmount,
        donationCount: frequency,
        avgDonation: totalAmount / frequency
      }
    } catch (error) {
      console.error('Error analyzing donor pattern:', error)
      return null
    }
  }

  generateRecommendations(pattern, score, totalAmount, lastDonation) {
    const recommendations = []

    // Based on engagement score
    if (score > 80) {
      recommendations.push('High-value donor: Send personalized thank you')
      recommendations.push('Invite to exclusive alumni events')
      recommendations.push('Consider naming opportunity')
    } else if (score > 50) {
      recommendations.push('Active donor: Share impact reports')
      recommendations.push('Invite to campus visits')
    } else {
      recommendations.push('Re-engagement needed: Send success stories')
      recommendations.push('Offer easy donation options')
    }

    // Based on pattern
    if (pattern === 'regular') {
      recommendations.push('Set up recurring donation reminder')
      recommendations.push('Recognize as consistent supporter')
    }

    // Based on amount
    if (totalAmount > 50000) {
      recommendations.push('Major donor: Personal meeting with principal')
      recommendations.push('Feature in annual report')
    }

    // Based on recency
    const daysSinceLastDonation = Math.floor(
      (Date.now() - lastDonation.createdAt) / (1000 * 60 * 60 * 24)
    )
    if (daysSinceLastDonation > 180) {
      recommendations.push('Send re-engagement campaign')
      recommendations.push('Share recent school achievements')
    }

    return recommendations
  }

  /**
   * Track and categorize all donations
   */
  async trackDonation(donationData) {
    try {
      const donation = new AlumniFund(donationData)
      
      // AI analysis
      const analysis = await this.analyzeDonorPattern(donationData.alumniId)
      if (analysis) {
        donation.aiAnalysis = {
          donorPattern: analysis.donorPattern,
          predictedNextDonation: analysis.predictedNextDonation,
          engagementScore: analysis.engagementScore,
          recommendations: analysis.recommendations
        }
      }

      await donation.save()
      return donation
    } catch (error) {
      console.error('Error tracking donation:', error)
      throw error
    }
  }

  /**
   * Get fund statistics for a school
   */
  async getSchoolFundStats(school) {
    try {
      const donations = await AlumniFund.find({ 
        school, 
        status: 'completed' 
      })

      const totalFunds = donations.reduce((sum, d) => sum + d.amount, 0)
      const donorCount = new Set(donations.map(d => d.alumniId.toString())).size
      
      // Group by purpose
      const byPurpose = {}
      donations.forEach(d => {
        byPurpose[d.purpose] = (byPurpose[d.purpose] || 0) + d.amount
      })

      // Monthly trend (last 12 months)
      const monthlyTrend = []
      for (let i = 11; i >= 0; i--) {
        const date = new Date()
        date.setMonth(date.getMonth() - i)
        const monthStart = new Date(date.getFullYear(), date.getMonth(), 1)
        const monthEnd = new Date(date.getFullYear(), date.getMonth() + 1, 0)

        const monthDonations = donations.filter(d => 
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
      donations.forEach(d => {
        const key = d.alumniId.toString()
        donorTotals[key] = (donorTotals[key] || 0) + d.amount
      })

      const topDonors = Object.entries(donorTotals)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 10)
        .map(([alumniId, amount]) => {
          const donation = donations.find(d => d.alumniId.toString() === alumniId)
          return {
            alumniId,
            name: donation.alumniName,
            amount
          }
        })

      // AI insights
      const insights = this.generateFundInsights(donations, totalFunds, monthlyTrend)

      return {
        totalFunds,
        donorCount,
        averageDonation: totalFunds / donations.length || 0,
        byPurpose,
        monthlyTrend,
        topDonors,
        insights,
        lastUpdated: new Date()
      }
    } catch (error) {
      console.error('Error getting fund stats:', error)
      throw error
    }
  }

  generateFundInsights(donations, totalFunds, monthlyTrend) {
    const insights = []

    // Trend analysis with more detail
    const recentMonths = monthlyTrend.slice(-3)
    const avgRecent = recentMonths.reduce((sum, m) => sum + m.amount, 0) / 3
    const previousMonths = monthlyTrend.slice(-6, -3)
    const avgPrevious = previousMonths.reduce((sum, m) => sum + m.amount, 0) / 3

    if (avgRecent > avgPrevious * 1.2) {
      const growthRate = Math.round(((avgRecent - avgPrevious) / avgPrevious) * 100)
      insights.push({
        type: 'positive',
        message: `🚀 Donations surging! ${growthRate}% growth in last 3 months`,
        action: 'Capitalize on momentum: Send thank-you campaign, share success stories, and launch matching gift challenge'
      })
    } else if (avgRecent < avgPrevious * 0.8) {
      const declineRate = Math.round(((avgPrevious - avgRecent) / avgPrevious) * 100)
      insights.push({
        type: 'warning',
        message: `📉 Donations declining ${declineRate}% - Immediate action needed`,
        action: 'Re-engagement strategy: Email campaign highlighting school achievements, personal calls to top donors, alumni reunion event'
      })
    } else {
      insights.push({
        type: 'info',
        message: '📊 Donations stable - Consistent support maintained',
        action: 'Maintain engagement: Regular newsletters, impact reports, and appreciation events'
      })
    }

    // Purpose analysis with recommendations
    const purposes = {}
    donations.forEach(d => {
      purposes[d.purpose] = (purposes[d.purpose] || 0) + 1
    })
    const topPurpose = Object.entries(purposes).sort((a, b) => b[1] - a[1])[0]
    
    if (topPurpose) {
      const purposeRecommendations = {
        'infrastructure': 'Showcase infrastructure improvements with before/after photos. Create naming opportunities for major donors.',
        'scholarship': 'Share student success stories. Highlight how scholarships changed lives. Create endowment fund for recurring support.',
        'equipment': 'Demonstrate equipment impact on learning. Invite donors to see equipment in use. Create equipment adoption program.',
        'general': 'Provide transparency on fund utilization. Share quarterly impact reports. Offer donors choice in allocation.',
        'event': 'Share event highlights and student testimonials. Create annual signature event. Offer sponsorship tiers.'
      }
      
      insights.push({
        type: 'info',
        message: `🎯 Most popular cause: ${topPurpose[0]} (${topPurpose[1]} donations)`,
        action: purposeRecommendations[topPurpose[0]] || 'Highlight impact in this area to attract more donors'
      })
    }

    // Milestone tracking with specific goals
    if (totalFunds >= 900000 && totalFunds < 1000000) {
      const remaining = 1000000 - totalFunds
      insights.push({
        type: 'milestone',
        message: `🎯 Just ₹${remaining.toLocaleString('en-IN')} away from ₹10 Lakh milestone!`,
        action: `Launch mini-campaign: "Help us reach ₹10L". Create urgency with countdown. Offer recognition for donors who help reach goal.`
      })
    } else if (totalFunds >= 1000000 && totalFunds < 1100000) {
      insights.push({
        type: 'milestone',
        message: '🎉 Milestone achieved: ₹10 Lakh raised!',
        action: 'Celebrate publicly: Press release, social media campaign, donor appreciation event. Set next goal: ₹25 Lakh.'
      })
    } else if (totalFunds >= 2400000 && totalFunds < 2500000) {
      insights.push({
        type: 'milestone',
        message: '🏆 Approaching ₹25 Lakh - Major milestone ahead!',
        action: 'Major donor outreach: Personal meetings with top 10 donors. Propose matching gift challenge for final push.'
      })
    }

    // Donor engagement analysis
    const uniqueDonors = new Set(donations.map(d => d.alumniId.toString())).size
    const repeatDonors = donations.length - uniqueDonors
    const repeatRate = (repeatDonors / donations.length) * 100

    if (repeatRate > 40) {
      insights.push({
        type: 'positive',
        message: `💚 Strong donor loyalty: ${repeatRate.toFixed(0)}% repeat donations`,
        action: 'Reward loyalty: Create recognition tiers (Bronze/Silver/Gold). Send personalized thank-you notes. Exclusive alumni events.'
      })
    } else if (repeatRate < 20) {
      insights.push({
        type: 'warning',
        message: `⚠️ Low repeat rate: Only ${repeatRate.toFixed(0)}% donors give again`,
        action: 'Improve retention: Follow-up within 48hrs of donation. Share impact of their gift. Create recurring donation option.'
      })
    }

    // Seasonal patterns
    const currentMonth = new Date().getMonth()
    const recentMonthData = monthlyTrend[monthlyTrend.length - 1]
    
    if (currentMonth >= 9 && currentMonth <= 11) { // Oct-Dec
      insights.push({
        type: 'info',
        message: '🎄 Year-end giving season - Prime fundraising time',
        action: 'Maximize season: Tax benefit reminders, year-end appeal letter, matching gift campaign, alumni reunion planning'
      })
    } else if (currentMonth >= 2 && currentMonth <= 4) { // Mar-May
      insights.push({
        type: 'info',
        message: '🎓 Alumni reunion season approaching',
        action: 'Plan reunion: Coordinate with alumni association. Create giving opportunities at event. Honor major donors publicly.'
      })
    }

    // Donation size analysis
    const avgDonation = totalFunds / donations.length
    if (avgDonation > 10000) {
      insights.push({
        type: 'positive',
        message: `💰 High average donation: ₹${Math.round(avgDonation).toLocaleString('en-IN')}`,
        action: 'Target major gifts: Identify prospects for ₹50K+ donations. Create major donor society. Offer naming opportunities.'
      })
    } else if (avgDonation < 3000) {
      insights.push({
        type: 'info',
        message: `📊 Average donation: ₹${Math.round(avgDonation).toLocaleString('en-IN')} - Room to grow`,
        action: 'Upgrade strategy: Suggest higher amounts in donation form. Share impact of larger gifts. Create giving circles.'
      })
    }

    // Recent activity check
    const lastDonation = donations.length > 0 ? donations[donations.length - 1] : null
    if (lastDonation) {
      const daysSinceLastDonation = Math.floor((Date.now() - new Date(lastDonation.createdAt)) / (1000 * 60 * 60 * 24))
      
      if (daysSinceLastDonation > 30) {
        insights.push({
          type: 'warning',
          message: `⏰ No donations in ${daysSinceLastDonation} days - Engagement needed`,
          action: 'Immediate outreach: Email blast with urgent need. Social media campaign. Personal calls to past donors.'
        })
      } else if (daysSinceLastDonation < 7) {
        insights.push({
          type: 'positive',
          message: '🔥 Active fundraising - Recent donation received',
          action: 'Maintain momentum: Thank donor immediately. Share on social media (with permission). Update progress bar.'
        })
      }
    }

    // Goal setting recommendation
    if (insights.length < 5) {
      const monthlyTarget = Math.round(totalFunds / 12)
      insights.push({
        type: 'info',
        message: `🎯 Suggested monthly target: ₹${monthlyTarget.toLocaleString('en-IN')}`,
        action: 'Set SMART goals: Monthly fundraising target, quarterly campaigns, annual giving day. Track progress publicly.'
      })
    }

    return insights.slice(0, 8) // Return top 8 insights
  }

  /**
   * AI-powered donor retention prediction
   */
  async predictDonorRetention(alumniId) {
    try {
      const analysis = await this.analyzeDonorPattern(alumniId)
      
      if (!analysis) {
        return { retentionProbability: 0, risk: 'unknown' }
      }

      let retentionProbability = analysis.engagementScore

      // Adjust based on pattern
      if (analysis.donorPattern === 'regular') retentionProbability += 10
      else if (analysis.donorPattern === 'occasional') retentionProbability -= 10

      // Adjust based on recency
      if (analysis.predictedNextDonation) {
        const daysUntilPredicted = Math.floor(
          (analysis.predictedNextDonation - Date.now()) / (1000 * 60 * 60 * 24)
        )
        if (daysUntilPredicted < 0) retentionProbability -= 20
      }

      retentionProbability = Math.max(0, Math.min(100, retentionProbability))

      let risk = 'low'
      if (retentionProbability < 30) risk = 'high'
      else if (retentionProbability < 60) risk = 'medium'

      return {
        retentionProbability,
        risk,
        recommendations: analysis.recommendations
      }
    } catch (error) {
      console.error('Error predicting retention:', error)
      return { retentionProbability: 0, risk: 'unknown' }
    }
  }

  /**
   * Generate fund utilization report
   */
  async generateUtilizationReport(school, startDate, endDate) {
    try {
      const donations = await AlumniFund.find({
        school,
        status: 'completed',
        createdAt: { $gte: startDate, $lte: endDate }
      })

      const report = {
        period: {
          start: startDate,
          end: endDate
        },
        totalReceived: donations.reduce((sum, d) => sum + d.amount, 0),
        byPurpose: {},
        byMonth: {},
        topDonors: [],
        utilizationSuggestions: []
      }

      // Group by purpose
      donations.forEach(d => {
        report.byPurpose[d.purpose] = (report.byPurpose[d.purpose] || 0) + d.amount
      })

      // AI utilization suggestions
      Object.entries(report.byPurpose).forEach(([purpose, amount]) => {
        if (amount > 100000) {
          report.utilizationSuggestions.push({
            purpose,
            amount,
            suggestion: this.getUtilizationSuggestion(purpose, amount)
          })
        }
      })

      return report
    } catch (error) {
      console.error('Error generating report:', error)
      throw error
    }
  }

  getUtilizationSuggestion(purpose, amount) {
    const suggestions = {
      'infrastructure': `₹${amount.toLocaleString('en-IN')} available for infrastructure. Consider: Lab upgrades, Building repairs, Furniture replacement`,
      'scholarship': `₹${amount.toLocaleString('en-IN')} for scholarships. Can support ${Math.floor(amount / 10000)} students for one year`,
      'equipment': `₹${amount.toLocaleString('en-IN')} for equipment. Priority: Computers, Lab equipment, Workshop tools`,
      'general': `₹${amount.toLocaleString('en-IN')} in general fund. Allocate to highest priority needs`,
      'event': `₹${amount.toLocaleString('en-IN')} for events. Plan: Alumni meet, Technical workshops, Cultural programs`
    }

    return suggestions[purpose] || `₹${amount.toLocaleString('en-IN')} available for ${purpose}`
  }
}

module.exports = new AIFundManager()
