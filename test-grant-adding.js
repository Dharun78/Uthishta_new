// Test script for grant adding functionality
const axios = require('axios')

async function testGrantAdding() {
  try {
    console.log('🔐 Testing login...')
    
    // Step 1: Login as super admin
    const loginResponse = await axios.post('http://localhost:3000/api/dashboard/login', {
      username: 'superadmin',
      password: 'super123'
    })
    
    const token = loginResponse.data.token
    console.log('✅ Login successful, token obtained')
    
    // Step 2: Test grant adding with sample data
    console.log('📝 Testing grant adding...')
    
    const sampleGrant = {
      name: 'Test Digital Infrastructure Grant',
      description: 'Sample grant for testing digital infrastructure development in government schools',
      amount: 'Rs 10-20 lakh per school',
      category: 'Digital Infrastructure',
      provider: 'Ministry of Education & IT',
      eligibility: 'Government schools, Minimum 100 students, Commitment to digital literacy',
      deadline: 'March 2026',
      status: 'active',
      applicationUrl: 'https://digitalindia.gov.in/education'
    }
    
    const grantResponse = await axios.post('http://localhost:3000/api/dashboard/grants/manual', sampleGrant, {
      headers: { 
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    })
    
    console.log('✅ Grant added successfully!')
    console.log('📊 Grant details:', {
      id: grantResponse.data.grant._id,
      title: grantResponse.data.grant.title,
      category: grantResponse.data.grant.category,
      amount: grantResponse.data.grant.amount
    })
    
    return {
      success: true,
      message: 'Grant adding functionality is working correctly',
      sampleData: sampleGrant
    }
    
  } catch (error) {
    console.error('❌ Error testing grant adding:', error.response?.data || error.message)
    
    if (error.response?.status === 401) {
      return {
        success: false,
        error: 'Authentication failed - check login credentials',
        details: error.response.data
      }
    } else if (error.response?.status === 403) {
      return {
        success: false,
        error: 'Authorization failed - only Super Admin can add grants',
        details: error.response.data
      }
    } else if (error.response?.status === 500) {
      return {
        success: false,
        error: 'Server error - check database connection and field validation',
        details: error.response.data
      }
    } else {
      return {
        success: false,
        error: 'Network or server connection error',
        details: error.message
      }
    }
  }
}

// Sample input data for testing
const sampleInputs = {
  valid: {
    name: 'Digital Education Infrastructure Grant',
    description: 'Funding for setting up computer labs, smart classrooms, internet connectivity, and digital learning resources in government schools.',
    amount: 'Rs 5-15 lakh per school',
    category: 'Digital Infrastructure',
    provider: 'Ministry of Education & IT',
    eligibility: 'Government schools without digital infrastructure, Schools with minimum 100 students, Commitment to digital literacy programs, Teacher training participation',
    deadline: 'Q1 2026',
    status: 'active',
    applicationUrl: 'https://digitalindia.gov.in/education'
  },
  infrastructure: {
    name: 'Karnataka School Infrastructure Grant',
    description: 'State government allocation for improving infrastructure in government schools including classrooms, labs, libraries, and facilities.',
    amount: 'Rs 50 lakh - 2 crore',
    category: 'Infrastructure & Quality',
    provider: 'Government of Karnataka',
    eligibility: 'Government schools in Karnataka, Pre-university colleges, Schools requiring infrastructure upgrades, Priority to rural areas',
    deadline: 'Annual application cycle',
    status: 'active',
    applicationUrl: 'https://schooleducation.kar.nic.in/'
  },
  vocational: {
    name: 'Skill Development Grant for Schools',
    description: 'Support for establishing vocational training programs and skill development centers in schools.',
    amount: 'Rs 2-10 lakh',
    category: 'Vocational Training',
    provider: 'Ministry of Skill Development',
    eligibility: 'Schools with vocational courses, Partnership with industry, Certified trainers',
    deadline: 'Rolling applications',
    status: 'active',
    applicationUrl: 'https://skillindia.gov.in'
  }
}

console.log('🧪 GRANT ADDING FUNCTIONALITY TEST')
console.log('=' .repeat(50))

testGrantAdding().then(result => {
  console.log('\n📋 TEST RESULTS:')
  console.log('=' .repeat(50))
  
  if (result.success) {
    console.log('✅ Status: SUCCESS')
    console.log('📝 Message:', result.message)
    console.log('\n🎯 SAMPLE VALID INPUTS FOR TESTING:')
    console.log('=' .repeat(50))
    
    Object.entries(sampleInputs).forEach(([type, data]) => {
      console.log(`\n📊 ${type.toUpperCase()} GRANT:`)
      console.log(`Name: ${data.name}`)
      console.log(`Category: ${data.category}`)
      console.log(`Amount: ${data.amount}`)
      console.log(`Provider: ${data.provider}`)
      console.log(`Deadline: ${data.deadline}`)
    })
    
    console.log('\n💡 USAGE INSTRUCTIONS:')
    console.log('1. Login as Super Admin (superadmin / super123)')
    console.log('2. Go to Funds page')
    console.log('3. Click "Add New Grant" button')
    console.log('4. Fill the form with any of the sample data above')
    console.log('5. Submit the form')
    
  } else {
    console.log('❌ Status: FAILED')
    console.log('🚨 Error:', result.error)
    console.log('📝 Details:', result.details)
    
    console.log('\n🔧 TROUBLESHOOTING:')
    console.log('1. Ensure server is running on http://localhost:3000')
    console.log('2. Check MongoDB connection')
    console.log('3. Verify admin credentials are seeded')
    console.log('4. Check browser console for detailed errors')
  }
  
  console.log('\n' + '=' .repeat(50))
})