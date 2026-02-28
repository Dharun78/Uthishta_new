import { NextResponse } from 'next/server'

// MyScheme.gov.in API integration test endpoint
const MYSCHEME_API_BASE = 'https://www.myscheme.gov.in/api'

// Fetch all schemes from MyScheme.gov.in
async function fetchMySchemeData() {
  try {
    console.log('Testing MyScheme.gov.in API...')
    
    // Try multiple possible endpoints
    const endpoints = [
      `${MYSCHEME_API_BASE}/schemes`,
      `${MYSCHEME_API_BASE}/v1/schemes/all`,
      `${MYSCHEME_API_BASE}/schemes/all`,
      'https://www.myscheme.gov.in/schemes/api/all',
      'https://api.myscheme.gov.in/schemes'
    ]
    
    for (const endpoint of endpoints) {
      try {
        console.log(`Trying endpoint: ${endpoint}`)
        
        const response = await fetch(endpoint, {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
            'User-Agent': 'GJTS-Karnataka-Grant-Assistant/1.0',
            'Content-Type': 'application/json'
          },
          timeout: 15000
        })

        console.log(`Response status: ${response.status}`)
        
        if (response.ok) {
          const data = await response.json()
          console.log(`Success! Got data from ${endpoint}`)
          return {
            success: true,
            endpoint: endpoint,
            data: data,
            schemes: data?.schemes || data?.data || (Array.isArray(data) ? data : [])
          }
        }
        
      } catch (endpointError) {
        console.log(`Endpoint ${endpoint} failed:`, endpointError.message)
        continue
      }
    }
    
    // If all endpoints fail, return mock data for testing
    console.log('All endpoints failed, returning mock data for testing')
    return {
      success: false,
      message: 'All MyScheme.gov.in endpoints failed, using mock data',
      data: {
        schemes: [
          {
            id: 'mock-samagra',
            name: 'Samagra Shiksha Abhiyan',
            description: 'Comprehensive scheme for school education covering infrastructure, teacher training, and quality improvement',
            ministry: 'Ministry of Education',
            category: 'Education',
            beneficiaries: ['Schools', 'Students', 'Teachers'],
            amount: 'Rs 2,94,283 crore',
            eligibility: 'Government and aided schools',
            applicationProcess: 'Through state education department',
            website: 'https://samagrashiksha.in',
            keywords: ['education', 'infrastructure', 'teacher training', 'quality']
          },
          {
            id: 'mock-pmshri',
            name: 'PM SHRI Schools',
            description: 'Pradhan Mantri Schools for Rising India - Model schools with modern infrastructure and facilities',
            ministry: 'Ministry of Education',
            category: 'Education Infrastructure',
            beneficiaries: ['Schools'],
            amount: 'Rs 27,360 crore',
            eligibility: 'Selected government schools',
            applicationProcess: 'Through online portal',
            website: 'https://pmshri.education.gov.in',
            keywords: ['infrastructure', 'model schools', 'modern facilities']
          },
          {
            id: 'mock-digital',
            name: 'Digital India - School Digitization',
            description: 'Digital infrastructure development for schools including computers, internet connectivity, and smart classrooms',
            ministry: 'Ministry of Electronics and IT',
            category: 'Digital Infrastructure',
            beneficiaries: ['Schools', 'Students'],
            amount: 'Rs 5-20 lakh per school',
            eligibility: 'Government schools',
            applicationProcess: 'Through state IT department',
            website: 'https://digitalindia.gov.in',
            keywords: ['digital', 'technology', 'computers', 'internet', 'smart classroom']
          },
          {
            id: 'mock-skill',
            name: 'Skill India - Vocational Education',
            description: 'Skill development and vocational training programs for students',
            ministry: 'Ministry of Skill Development',
            category: 'Skill Development',
            beneficiaries: ['Students', 'Schools'],
            amount: 'Rs 2-10 lakh',
            eligibility: 'Schools with vocational courses',
            applicationProcess: 'Through NSDC portal',
            website: 'https://skillindia.gov.in',
            keywords: ['skill', 'vocational', 'training', 'employment']
          }
        ]
      },
      schemes: [
        {
          id: 'mock-samagra',
          name: 'Samagra Shiksha Abhiyan',
          description: 'Comprehensive scheme for school education covering infrastructure, teacher training, and quality improvement',
          ministry: 'Ministry of Education',
          category: 'Education',
          beneficiaries: ['Schools', 'Students', 'Teachers'],
          amount: 'Rs 2,94,283 crore',
          eligibility: 'Government and aided schools',
          applicationProcess: 'Through state education department',
          website: 'https://samagrashiksha.in'
        },
        {
          id: 'mock-pmshri',
          name: 'PM SHRI Schools',
          description: 'Pradhan Mantri Schools for Rising India - Model schools with modern infrastructure',
          ministry: 'Ministry of Education',
          category: 'Education Infrastructure',
          beneficiaries: ['Schools'],
          amount: 'Rs 27,360 crore',
          eligibility: 'Selected government schools',
          applicationProcess: 'Through online portal',
          website: 'https://pmshri.education.gov.in'
        },
        {
          id: 'mock-digital',
          name: 'Digital India - School Digitization',
          description: 'Digital infrastructure development for schools',
          ministry: 'Ministry of Electronics and IT',
          category: 'Digital Infrastructure',
          beneficiaries: ['Schools', 'Students'],
          amount: 'Rs 5-20 lakh per school',
          eligibility: 'Government schools',
          applicationProcess: 'Through state IT department',
          website: 'https://digitalindia.gov.in'
        },
        {
          id: 'mock-skill',
          name: 'Skill India - Vocational Education',
          description: 'Skill development and vocational training programs',
          ministry: 'Ministry of Skill Development',
          category: 'Skill Development',
          beneficiaries: ['Students', 'Schools'],
          amount: 'Rs 2-10 lakh',
          eligibility: 'Schools with vocational courses',
          applicationProcess: 'Through NSDC portal',
          website: 'https://skillindia.gov.in'
        }
      ]
    }
    
  } catch (error) {
    console.error('Error in fetchMySchemeData:', error)
    return {
      success: false,
      error: error.message,
      message: 'Failed to fetch from MyScheme.gov.in API'
    }
  }
}

// Test similarity calculation
function testSimilarityCalculation() {
  const mockScheme = {
    name: 'Digital India - School Digitization',
    description: 'Digital infrastructure development for schools including computers, internet connectivity, and smart classrooms',
    ministry: 'Ministry of Electronics and IT',
    category: 'Digital Infrastructure',
    beneficiaries: ['Schools', 'Students'],
    amount: 'Rs 5-20 lakh per school'
  }
  
  const mockAnswers = {
    need: 'digital',
    category: 'Digital Infrastructure',
    enrollment: 150,
    budget: 1000000,
    infrastructure: 'partial',
    timeline: 'soon'
  }
  
  // Calculate similarity
  let score = 0
  let reasons = []
  
  const schemeText = `${mockScheme.name} ${mockScheme.description} ${mockScheme.category} ${mockScheme.beneficiaries?.join(' ')}`.toLowerCase()
  
  // Category matching
  const needKeywords = {
    'digital': ['digital', 'technology', 'computer', 'internet', 'smart', 'ict']
  }
  
  const keywords = needKeywords[mockAnswers.need] || []
  const matchedKeywords = keywords.filter(keyword => schemeText.includes(keyword))
  
  if (matchedKeywords.length > 0) {
    score += 40
    reasons.push(`Matches your ${mockAnswers.category} needs (${matchedKeywords.join(', ')})`)
  }
  
  // Education-specific matching
  if (schemeText.includes('education') || schemeText.includes('school')) {
    score += 25
    reasons.push('Education-focused scheme')
  }
  
  // Government scheme preference
  if (mockScheme.ministry || schemeText.includes('government') || schemeText.includes('ministry')) {
    score += 15
    reasons.push('Government scheme - reliable funding')
  }
  
  return {
    scheme: mockScheme,
    answers: mockAnswers,
    score: Math.min(score, 100),
    reasons: reasons
  }
}

export async function GET(request) {
  try {
    console.log('Starting MyScheme.gov.in API test...')
    
    // Test the API fetch
    const apiResult = await fetchMySchemeData()
    
    // Test similarity calculation
    const similarityTest = testSimilarityCalculation()
    
    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
      apiTest: apiResult,
      similarityTest: similarityTest,
      summary: {
        apiWorking: apiResult.success,
        schemesFound: apiResult.schemes?.length || 0,
        similarityScore: similarityTest.score,
        message: apiResult.success 
          ? `Successfully fetched ${apiResult.schemes?.length || 0} schemes from MyScheme.gov.in`
          : 'API failed, using mock data for testing'
      }
    })
    
  } catch (error) {
    console.error('Test endpoint error:', error)
    return NextResponse.json({
      success: false,
      error: error.message,
      timestamp: new Date().toISOString()
    }, { status: 500 })
  }
}