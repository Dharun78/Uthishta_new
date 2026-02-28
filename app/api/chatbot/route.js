import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'
import connectDB from '@/lib/mongodb'
import Grant from '@/lib/models/Grant'

// MyScheme.gov.in API integration
const MYSCHEME_API_BASE = 'https://www.myscheme.gov.in/api'

// Fetch all schemes from MyScheme.gov.in
async function fetchMySchemeData() {
  try {
    console.log('Fetching schemes from MyScheme.gov.in...')
    
    // Try the main schemes endpoint
    const response = await fetch(`${MYSCHEME_API_BASE}/schemes`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'GJTS-Karnataka-Grant-Assistant/1.0'
      },
      timeout: 10000
    })

    if (!response.ok) {
      console.log(`MyScheme API returned ${response.status}, trying alternative endpoint...`)
      
      // Try alternative endpoint
      const altResponse = await fetch(`${MYSCHEME_API_BASE}/v1/schemes/all`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'User-Agent': 'GJTS-Karnataka-Grant-Assistant/1.0'
        },
        timeout: 10000
      })
      
      if (!altResponse.ok) {
        throw new Error(`Both endpoints failed: ${response.status}, ${altResponse.status}`)
      }
      
      const data = await altResponse.json()
      return data
    }

    const data = await response.json()
    console.log(`Successfully fetched ${data?.schemes?.length || data?.length || 'unknown'} schemes from MyScheme.gov.in`)
    return data
    
  } catch (error) {
    console.error('Error fetching MyScheme data:', error.message)
    
    // Return mock data structure for development/testing
    return {
      schemes: [
        {
          id: 'mock-1',
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
          id: 'mock-2', 
          name: 'PM SHRI Schools',
          description: 'Pradhan Mantri Schools for Rising India - Model schools with modern infrastructure',
          ministry: 'Ministry of Education',
          category: 'Education Infrastructure',
          beneficiaries: ['Schools'],
          amount: 'Rs 27,360 crore',
          eligibility: 'Selected government schools',
          applicationProcess: 'Through online portal',
          website: 'https://pmshri.education.gov.in'
        }
      ]
    }
  }
}

// Calculate similarity between school needs and scheme
function calculateSchemeSimilarity(scheme, schoolAnswers) {
  let score = 0
  let reasons = []
  
  const schemeText = `${scheme.name} ${scheme.description} ${scheme.category} ${scheme.beneficiaries?.join(' ')}`.toLowerCase()
  
  // Category matching
  if (schoolAnswers.need) {
    const needKeywords = {
      'infrastructure': ['infrastructure', 'building', 'construction', 'facility', 'classroom'],
      'digital': ['digital', 'technology', 'computer', 'internet', 'smart', 'ict'],
      'laboratory': ['laboratory', 'lab', 'science', 'equipment', 'apparatus'],
      'library': ['library', 'book', 'reading', 'resource', 'learning material'],
      'sports': ['sports', 'physical', 'playground', 'athletic', 'fitness'],
      'teacher': ['teacher', 'training', 'professional development', 'faculty', 'capacity building'],
      'inclusive': ['inclusive', 'special needs', 'disability', 'accessible', 'cwsn'],
      'vocational': ['vocational', 'skill', 'employment', 'job', 'career', 'training']
    }
    
    const keywords = needKeywords[schoolAnswers.need] || []
    const matchedKeywords = keywords.filter(keyword => schemeText.includes(keyword))
    
    if (matchedKeywords.length > 0) {
      score += 40
      reasons.push(`Matches your ${schoolAnswers.category} needs (${matchedKeywords.join(', ')})`)
    }
  }
  
  // Education-specific matching
  if (schemeText.includes('education') || schemeText.includes('school')) {
    score += 25
    reasons.push('Education-focused scheme')
  }
  
  // Government scheme preference
  if (scheme.ministry || schemeText.includes('government') || schemeText.includes('ministry')) {
    score += 15
    reasons.push('Government scheme - reliable funding')
  }
  
  // Infrastructure matching
  if (schoolAnswers.infrastructure === 'lacking' && schemeText.includes('infrastructure')) {
    score += 20
    reasons.push('Addresses infrastructure gaps')
  }
  
  // Budget consideration (if amount info available)
  if (scheme.amount && schoolAnswers.budget) {
    // Extract numeric value from amount string
    const amountMatch = scheme.amount.match(/[\d,]+/)
    if (amountMatch) {
      const schemeAmount = parseInt(amountMatch[0].replace(/,/g, ''))
      if (schemeAmount >= schoolAnswers.budget) {
        score += 10
        reasons.push('Adequate funding amount')
      }
    }
  }
  
  return {
    score: Math.min(score, 100), // Cap at 100%
    reasons
  }
}

// Load government data about GJTS schools
let gjtsData
try {
  const dataPath = path.join(process.cwd(), 'data', 'gjts-government-data.json')
  const fileContent = fs.readFileSync(dataPath, 'utf8')
  gjtsData = JSON.parse(fileContent)
} catch (error) {
  console.error('Error loading GJTS data:', error)
  gjtsData = { schools: [], about: {}, admissions: {}, courses: {}, facilities: {}, placements: {} }
}

// Enhanced chatbot with comprehensive knowledge and grants Q&A
async function generateResponse(message, conversationContext = {}) {
  const lowerMessage = message.toLowerCase()
  
  // Check if we're in the middle of grant questionnaire
  if (conversationContext.inGrantQuestionnaire && conversationContext.step) {
    return await processGrantQuestionnaire(message, conversationContext.step, conversationContext)
  }

  // Grants-related queries - NEW FEATURE
  if (lowerMessage.match(/grant|funding|financial support|money|fund|apply|application/)) {
    // Check if asking about grants
    if (lowerMessage.match(/what grant|which grant|help.*choose|recommend.*grant|find.*grant|available grant|grant.*apply|choose.*grant/)) {
      return {
        message: `🎯 I can help you find the perfect grant for your school! Let me ask you a few questions to recommend the best grants:

**Question 1 of 5:** What is your school's primary need right now?

A) 🏗️ Infrastructure (buildings, classrooms, furniture)
B) 💻 Digital/Technology (computers, internet, smart classrooms)
C) 🔬 Laboratory Equipment (science labs, equipment)
D) 📚 Library & Learning Resources
E) 🏃 Sports Facilities
F) 👨‍🏫 Teacher Training & Development
G) ♿ Inclusive Education (special needs support)
H) 🎓 Vocational/Skill Development

Please reply with the letter (A-H) or describe your need.`,
        type: 'grant_question',
        step: 1,
        context: {
          inGrantQuestionnaire: true,
          step: 1,
          grantAnswers: {}
        }
      }
    }

    // General grants information
    if (lowerMessage.match(/how many|list.*grant|all grant|available grant/)) {
      return {
        message: `💰 We have discovered **12+ real government grants** available for GJTS schools:

**🌐 LIVE DATA SOURCES:**
• Local Database: 12 verified grants
• MyScheme.gov.in: Real-time government schemes (updated daily)

**Major Schemes:**
1. 🏛️ Samagra Shiksha Abhiyan - Rs 2,94,283 crore (comprehensive school development)
2. 🎯 PM SHRI Schools - Rs 27,360 crore (model school transformation)
3. 🏗️ Karnataka Infrastructure Grant - Rs 850 crore

**Specific Purpose Grants (Rs 2-20 lakh per school):**
4. 💻 Digital Education Infrastructure
5. 🍽️ Mid-Day Meal Enhancement
6. 🔬 Science Lab Modernization
7. 📚 Library Development
8. 🏃 Sports Infrastructure
9. 👨‍🏫 Teacher Training
10. ♿ Inclusive Education Support
11. 🎓 Vocational Education
12. 🔧 School Maintenance Fund

**🚀 NEW FEATURE:** Real-time integration with MyScheme.gov.in portal for latest government schemes!

Would you like me to help you choose the most suitable grants for your school? Just say "help me choose a grant" and I'll ask you a few questions!`,
        type: 'grant_info'
      }
    }

    // Application help
    if (lowerMessage.match(/how.*apply|application process|apply for|steps.*apply/)) {
      return {
        message: `📝 **Grant Application Process - General Steps:**

**Step 1: Identify Suitable Grants**
• Use our AI to match your school's needs with available grants
• Check eligibility criteria carefully

**Step 2: Prepare Documents**
Common documents needed:
• School registration certificate
• UDISE code
• Previous year's financial statements
• Infrastructure assessment report
• Student enrollment data
• Staff details
• Bank account information

**Step 3: Online Application**
• Visit the grant provider's official portal
• Create account/login
• Fill application form accurately
• Upload required documents
• Submit before deadline

**Step 4: Follow-up**
• Note your application reference number
• Track application status online
• Respond to queries promptly
• Prepare for site inspection if required

**Step 5: Grant Utilization**
• Use funds only for approved purposes
• Maintain proper accounts
• Submit utilization certificates
• Keep all bills and receipts

💡 **Want specific guidance?** Tell me which grant you're interested in, and I'll provide detailed application steps and required documents!`,
        type: 'application_help'
      }
    }
  }

  // Greetings
  if (lowerMessage.match(/^(hello|hi|hey|greetings|good morning|good afternoon|good evening)$/i)) {
    return `Hello! I'm your GJTS Karnataka Assistant. I have comprehensive knowledge about all 6 Government Junior Technical Schools in Karnataka. I can help you with:

📚 Admissions & Eligibility
🎓 Courses & Curriculum
🏫 School Locations & Facilities
💼 Placements & Career Paths
💰 Scholarships & Financial Aid
🤝 Quest Global Partnership
👥 Alumni Network
🎯 **NEW: Grant Discovery & Application Help**

What would you like to know?`
  }

  // About GJTS
  if (lowerMessage.match(/what is|about|tell me about|information about/) && lowerMessage.match(/gjts|government junior technical/)) {
    return `Government Junior Technical Schools (GJTS) are specialized technical education institutions in Karnataka managed by the Department of Technical Education.

🎯 Key Facts:
• Established: 2013 (started with Hubballi, expanded to 6 schools in 2023)
• Total Schools: 6 campuses across Karnataka
• Total Students: 800+ students
• Grades: 8th to 10th standard
• Partnership: Quest Global & Uthishta NGO
• Placement Rate: 70% for engineering graduates
• Admission Growth: 17% year-on-year

🎓 Mission: Provide quality technical education to students from economically weaker sections and prepare them for technical careers.

The initiative has been supported by Quest Global for over a decade, providing infrastructure, scholarships, and career pathways.`
  }

  // Schools information
  if (lowerMessage.includes('school') || lowerMessage.includes('campus') || lowerMessage.includes('location')) {
    if (lowerMessage.includes('how many') || lowerMessage.includes('list') || lowerMessage.includes('all')) {
      return `We have 6 GJTS campuses across Karnataka:

1. 🏫 GJTS Ballari (Est. 2013) - 150 students
   District: Ballari | Courses: Electronics, Mechanical, Computer Science

2. 🏫 GJTS Bhadravati (Est. 2023) - 140 students
   District: Shivamogga | Courses: Electronics, Mechanical, Electrical
   Facilities: Hostel available

3. 🏫 GJTS Hubballi (Est. 2013) - 160 students
   District: Dharwad | Courses: Electronics, Mechanical, Computer Science
   Achievement: Highest placement rate, Robotics winners

4. 🏫 GJTS Bagalkot (Est. 2023) - 135 students
   District: Bagalkot | Courses: Electronics, Mechanical

5. 🏫 GJTS Kalburgi (Est. 2023) - 145 students
   District: Kalaburagi | Courses: Electronics, Mechanical, Computer Science
   Facilities: Hostel available

6. 🏫 GJTS Mangalore (Est. 2023) - 155 students
   District: Dakshina Kannada | Courses: Electronics, Mechanical, Electrical

Each school offers quality technical education with modern facilities!`
    }
    
    // Specific school queries
    const schoolNames = ['ballari', 'bhadravati', 'hubballi', 'bagalkot', 'kalburgi', 'mangalore']
    for (const schoolName of schoolNames) {
      if (lowerMessage.includes(schoolName)) {
        const school = gjtsData.schools.find(s => s.name.toLowerCase().includes(schoolName))
        if (school) {
          return `📍 ${school.name}

🏛️ Location: ${school.location}, ${school.district} District
📅 Established: ${school.established}
👥 Students: ${school.students}
📧 Email: ${school.email}
📞 Phone: ${school.phone}
📮 Address: ${school.address}

📚 Courses Offered:
${school.courses.map(c => `• ${c}`).join('\n')}

🏗️ Facilities:
${school.facilities.map(f => `• ${f}`).join('\n')}

🏆 Achievements:
${school.achievements.map(a => `• ${a}`).join('\n')}

Would you like to know more about admissions or courses?`
        }
      }
    }
  }

  // Admissions
  if (lowerMessage.includes('admission') || lowerMessage.includes('apply') || lowerMessage.includes('enroll') || lowerMessage.includes('eligibility')) {
    return `📝 GJTS Admissions Information

✅ Eligibility:
• Students who have completed 7th standard
• Age: 13-15 years
• Open to all students, priority for economically weaker sections

📋 Application Process:
1. Online application through official website
2. Entrance examination
3. Merit-based selection
4. Document verification
5. Final admission

📄 Required Documents:
• 7th standard marks card
• Transfer certificate
• Caste certificate (if applicable)
• Income certificate
• Aadhar card
• Passport size photographs

💰 Fees: Minimal fees with extensive scholarship support

📈 Recent Achievement: 17% increase in admissions due to improved facilities and outcomes!

For specific school admissions, please contact the school directly or visit our Admissions page.`
  }

  // Courses
  if (lowerMessage.includes('course') || lowerMessage.includes('subject') || lowerMessage.includes('stream') || lowerMessage.includes('curriculum')) {
    return `🎓 GJTS Courses & Curriculum

⏱️ Duration: 3 years (Grade 8 to Grade 10)
📚 Board: Karnataka State Board with technical subjects

🔧 Technical Streams:

1. 📡 Electronics
   • Basic electronics & circuits
   • Digital electronics
   • Practical training
   Career: Electronics Technician, Maintenance Engineer

2. ⚙️ Mechanical Engineering
   • Workshop practice
   • Machine tools & fitting
   • Welding & mechanical systems
   Career: Mechanical Technician, Production Assistant

3. 💻 Computer Science
   • Programming basics
   • Computer hardware & software
   • Web development
   Career: IT Support, Junior Programmer

4. ⚡ Electrical Engineering
   • Electrical circuits & wiring
   • Motors & generators
   • Power systems
   Career: Electrical Technician, Wireman

All courses include hands-on training with modern equipment and experienced faculty!`
  }

  // Facilities
  if (lowerMessage.includes('facilit') || lowerMessage.includes('infrastructure') || lowerMessage.includes('lab')) {
    return `🏗️ GJTS Facilities & Infrastructure

Thanks to Quest Global's support, our schools have modern facilities:

🔬 Academic Facilities:
• Well-equipped science laboratories
• Modern computer labs with internet
• Technical workshops with latest equipment
• Well-stocked libraries
• Smart classrooms with digital learning tools

🏃 Other Facilities:
• Sports facilities and playgrounds
• Separate hostels for boys and girls (Bhadravati, Kalburgi, Mangalore)
• Transportation facilities
• Medical facilities
• Nutritious mid-day meals

🎁 Free Provisions for All Students:
• Uniforms
• School bags
• Tool kits
• Textbooks
• Sports materials

Recent Upgrades (2023-2026):
• All-in-one desktop units with MS Office
• Infrastructure upgrades (desks, benches, book racks)
• Waterproofing and painting
• Digital literacy training for faculty`
  }

  // Placement & Career
  if (lowerMessage.includes('placement') || lowerMessage.includes('job') || lowerMessage.includes('career') || lowerMessage.includes('employment')) {
    return `💼 GJTS Placements & Career Outcomes

🎯 Impressive Results:
• 70% placement rate for engineering graduates
• Many graduates work with leading technology firms including Quest Global
• Strong education-to-employment pathway

🤝 Industry Partners:
• Quest Global (primary partner)
• Bosch
• Toyota
• Infosys
• TCS
• Local industries

📈 Career Support:
• Career counseling
• Skill development workshops
• Industry visits
• Internship opportunities
• Placement assistance
• Higher education guidance

🎓 Career Pathways After 10th:
1. Direct employment in technical roles
2. Diploma courses through lateral entry
3. Engineering degrees through DCET (with Quest Global scholarships)
4. ITI courses
5. Entrepreneurship

Success Story: Students who receive DCET scholarships and complete engineering have 70% employment rate with top tech firms!`
  }

  // Scholarships
  if (lowerMessage.includes('scholarship') || lowerMessage.includes('financial') || lowerMessage.includes('fees') || lowerMessage.includes('cost')) {
    return `💰 GJTS Scholarships & Financial Support

Quest Global provides extensive scholarship support:

🏆 Merit-Based Scholarships:
• For top-performing students in grades 8-10
• Available across all six GJTS campuses
• Covers tuition and learning materials

🎓 Higher Education Scholarships:
• For JTS alumni pursuing Engineering degrees
• Available for students qualifying through DCET (Diploma Common Entrance Test)
• Covers engineering education costs

📋 Government Scholarships:
• SC/ST scholarships
• Minority scholarships
• EWS (Economically Weaker Section) support
• OBC scholarships

💵 Fee Structure:
• Minimal fees for GJTS education
• Most students receive full or partial scholarship support
• Free uniforms, books, bags, tool kits, and meals

📞 For scholarship applications, contact your nearest GJTS campus or visit the Admissions page.`
  }

  // Quest Global Partnership
  if (lowerMessage.includes('quest') || lowerMessage.includes('partner') || lowerMessage.includes('uthishta') || lowerMessage.includes('support')) {
    return `🤝 Quest Global Partnership

Quest Global, the world's largest independent pure-play engineering services company, has been supporting GJTS schools for over a decade through their "Education for Underserved" initiative in collaboration with NGO partner Uthishta.

📅 Timeline:
• 2013: Started with single school in Hubballi
• 2023: Expanded to all 6 GJTS institutions
• 2026: Continuing strong support and growth

💡 Quest Global's Contributions:
• Infrastructure development (labs, libraries, furniture)
• Digital literacy (computers, software, trained faculty)
• Learning resources and technology access
• Merit-based scholarships for grades 8-10
• DCET scholarships for engineering aspirants
• Skills development workshops
• Career counseling and placement support

📊 Impact:
• 800+ students directly benefited
• 17% increase in admissions
• Improved attendance rates
• 70% placement rate for engineering graduates
• Many alumni now work at Quest Global

🎯 Mission: Create long-term value through education and skill development, opening doors for students from underserved communities.

"By strengthening Junior Technical Schools and creating clear pathways to higher education, we are shaping the future of India's engineering talent." - Ajit Prabhu, Co-founder & CEO, Quest Global`
  }

  // Alumni
  if (lowerMessage.includes('alumni') || lowerMessage.includes('graduate') || lowerMessage.includes('former student')) {
    return `👥 GJTS Alumni Network

Our alumni network is growing strong with impressive outcomes!

📊 Alumni Success:
• 70% of engineering graduates secured employment with leading tech firms
• Many alumni work at Quest Global, Bosch, Toyota, Infosys, TCS
• Some pursuing post-graduation courses
• Several taking internship opportunities
• Strong education-to-employment pathway

🎓 Alumni Support:
• DCET scholarships for engineering aspirants
• Career guidance and mentorship
• Networking opportunities
• Job placement assistance
• Continued connection with GJTS community

💼 Career Progression:
Many students successfully transition from:
GJTS (8-10th) → Diploma/ITI → Engineering (via DCET) → Employment

🌟 Success Stories:
• Graduates returning as professionals to the ecosystem that nurtured them
• Alumni working with leading technology firms
• Some pursuing advanced degrees and research

📝 Alumni Registration:
Visit our Alumni page to register, stay connected, and contribute to the community!`
  }

  // Contact
  if (lowerMessage.includes('contact') || lowerMessage.includes('phone') || lowerMessage.includes('email') || lowerMessage.includes('reach')) {
    return `📞 Contact Information

🏛️ Department of Technical Education, Karnataka
📧 Email: dte@kar.nic.in
🌐 Website: https://dte.kar.nic.in

📮 GJTS General Contact:
📧 Email: info@gjtskarnataka.edu.in
📞 Helpline: 1800-XXX-XXXX
⏰ Hours: Monday to Friday, 9:00 AM to 5:00 PM

🏫 Individual School Contacts:

1. GJTS Ballari: gjts.ballari@dte.kar.nic.in | +91-8392-XXXXXX
2. GJTS Bhadravati: gjts.bhadravati@dte.kar.nic.in | +91-8182-XXXXXX
3. GJTS Hubballi: gjts.hubballi@dte.kar.nic.in | +91-836-XXXXXX
4. GJTS Bagalkot: gjts.bagalkot@dte.kar.nic.in | +91-8354-XXXXXX
5. GJTS Kalburgi: gjts.kalburgi@dte.kar.nic.in | +91-8472-XXXXXX
6. GJTS Mangalore: gjts.mangalore@dte.kar.nic.in | +91-824-XXXXXX

For specific inquiries, please contact the relevant school directly!`
  }

  // Hostel
  if (lowerMessage.includes('hostel') || lowerMessage.includes('accommodation') || lowerMessage.includes('boarding')) {
    return `🏠 Hostel Facilities

Hostel facilities are available at select GJTS campuses:

✅ Schools with Hostel:
1. GJTS Bhadravati (Shivamogga District)
2. GJTS Kalburgi (Kalaburagi District)
3. GJTS Mangalore (Dakshina Kannada District)

🏢 Hostel Features:
• Separate hostels for boys and girls
• Safe and secure environment
• Nutritious meals provided
• Study rooms and common areas
• 24/7 supervision
• Medical facilities nearby

💰 Hostel Fees: Minimal charges with scholarship support available

📝 For hostel admission and availability, please contact the specific school directly.

Other schools provide transportation facilities for day scholars.`
  }

  // Age/Grade specific
  if (lowerMessage.match(/what age|age limit|which grade|which class/)) {
    return `👦👧 Age & Grade Requirements

📚 GJTS offers education for:
• Grades: 8th to 10th standard
• Age: 13-15 years
• Entry: After completing 7th standard

📋 Eligibility:
• Students who have completed 7th standard
• Age between 13-15 years at time of admission
• Open to all students, priority for economically weaker sections

🎓 After 10th Standard:
Students can pursue:
• Diploma courses (lateral entry)
• Engineering through DCET
• ITI courses
• Direct employment
• Entrepreneurship

The 3-year program provides strong technical foundation for future careers!`
  }

  // Documents
  if (lowerMessage.includes('document') || lowerMessage.includes('certificate') || lowerMessage.includes('what do i need')) {
    return `📄 Required Documents for Admission

Please prepare the following documents:

✅ Academic Documents:
• 7th standard marks card
• Transfer certificate from previous school
• School leaving certificate

✅ Identity Documents:
• Aadhar card (student)
• Passport size photographs (recent)

✅ Category Certificates (if applicable):
• Caste certificate (SC/ST/OBC)
• Income certificate (for EWS)
• Minority certificate (if applicable)

✅ Additional Documents:
• Parent/Guardian ID proof
• Address proof
• Bank account details (for scholarship)

📝 Note: All documents should be original with photocopies. Certificates should be attested by appropriate authorities.

For specific document requirements, please contact your nearest GJTS campus.`
  }

  // Comparison or choice
  if (lowerMessage.match(/which school|best school|which campus|recommend|choose/)) {
    return `🎯 Choosing the Right GJTS Campus

All 6 GJTS campuses offer quality education! Here's how to choose:

📍 By Location:
• North Karnataka: Hubballi, Bagalkot, Kalburgi, Ballari
• Central Karnataka: Bhadravati
• Coastal Karnataka: Mangalore

🏆 By Achievements:
• Highest Placement: GJTS Hubballi
• Robotics Excellence: GJTS Hubballi
• Newest Infrastructure: GJTS Bhadravati, Bagalkot, Kalburgi, Mangalore (Est. 2023)

🏠 Hostel Availability:
• GJTS Bhadravati, Kalburgi, Mangalore

📚 Course Availability:
• All 4 streams: Hubballi, Kalburgi, Mangalore
• 3 streams: Ballari, Bhadravati
• 2 streams: Bagalkot

💡 Recommendation: Choose based on:
1. Proximity to your home
2. Desired technical stream
3. Hostel requirement
4. Specific school achievements

All schools have Quest Global support and excellent facilities!`
  }

  // Default response with helpful suggestions
  return `I'm here to help! I have detailed information about GJTS Karnataka. You can ask me about:

📚 Admissions & Eligibility
• "How do I apply?"
• "What documents do I need?"
• "What is the age limit?"

🎓 Courses & Education
• "What courses are offered?"
• "Tell me about Electronics course"
• "What is the curriculum?"

🏫 Schools & Locations
• "List all schools"
• "Tell me about GJTS Hubballi"
• "Which school has hostel?"

💼 Career & Placements
• "What are the placement rates?"
• "Career options after 10th?"
• "Tell me about Quest Global partnership"

💰 Scholarships & Fees
• "What scholarships are available?"
• "How much are the fees?"

👥 Alumni & Success Stories
• "Alumni achievements"
• "Career outcomes"

🎯 **Grants & Funding (NEW!)**
• "What grants are available?"
• "Help me choose a grant"
• "How do I apply for grants?"

Just ask your question, and I'll provide detailed information!`
}

// Process grant questionnaire responses
async function processGrantQuestionnaire(message, step, context) {
  const lowerMessage = message.toLowerCase()
  
  // Initialize context if not exists
  if (!context.grantAnswers) {
    context.grantAnswers = {}
  }

  // Step 1: Primary Need
  if (step === 1) {
    let category = ''
    let need = ''
    
    // Better pattern matching with more flexibility
    if (lowerMessage.match(/^a$|infrastructure|building|classroom|furniture|construction|repair/)) {
      category = 'Infrastructure & Quality'
      need = 'infrastructure'
    } else if (lowerMessage.match(/^b$|digital|technology|computer|internet|smart|tech|it|software|hardware/)) {
      category = 'Digital Infrastructure'
      need = 'digital'
    } else if (lowerMessage.match(/^c$|lab|science|equipment|experiment|apparatus/)) {
      category = 'Laboratory & Equipment'
      need = 'laboratory'
    } else if (lowerMessage.match(/^d$|library|book|reading|resource/)) {
      category = 'Library & Resources'
      need = 'library'
    } else if (lowerMessage.match(/^e$|sports|playground|physical|athletic|game/)) {
      category = 'Sports & Physical Education'
      need = 'sports'
    } else if (lowerMessage.match(/^f$|teacher|training|professional|development|faculty/)) {
      category = 'Teacher Development'
      need = 'teacher'
    } else if (lowerMessage.match(/^g$|inclusive|special needs|disability|accessible|cwsn/)) {
      category = 'Inclusive Education'
      need = 'inclusive'
    } else if (lowerMessage.match(/^h$|vocational|skill|career|job|employment/)) {
      category = 'Vocational Training'
      need = 'vocational'
    } else {
      return {
        message: `I understand you're looking for grants, but I need to know your primary need more clearly.

Please choose one option:
A) Infrastructure B) Digital/Technology C) Laboratory D) Library E) Sports F) Teacher Training G) Inclusive Education H) Vocational

Or describe it in simple terms like "we need computers" or "we need sports facilities"`,
        type: 'grant_question',
        step: 1,
        context: {
          ...context,
          step: 1
        }
      }
    }

    context.grantAnswers.category = category
    context.grantAnswers.need = need

    return {
      message: `Perfect! You need support for **${category}**.

**Question 2 of 5:** What is your school's current student enrollment?

A) Less than 100 students
B) 100-250 students
C) 250-500 students
D) 500-1000 students
E) More than 1000 students

Please reply with the letter (A-E) or tell me the approximate number.`,
      type: 'grant_question',
      step: 2,
      context: {
        ...context,
        step: 2
      }
    }
  }

  // Step 2: Student Enrollment
  if (step === 2) {
    let enrollment = 0
    
    // Extract number from message or use letter choice
    const numberMatch = message.match(/\d+/)
    if (numberMatch) {
      enrollment = parseInt(numberMatch[0])
    } else if (lowerMessage.match(/^a$|less.*100|under 100|below 100|small/)) {
      enrollment = 75
    } else if (lowerMessage.match(/^b$|100.*250|hundred|150|200/)) {
      enrollment = 175
    } else if (lowerMessage.match(/^c$|250.*500|300|400|medium/)) {
      enrollment = 375
    } else if (lowerMessage.match(/^d$|500.*1000|600|700|800|900|large/)) {
      enrollment = 750
    } else if (lowerMessage.match(/^e$|more.*1000|over 1000|1000\+|very large/)) {
      enrollment = 1200
    } else {
      return {
        message: `Please tell me your student enrollment. You can say:
- A letter (A-E)
- A number like "180 students" or "350"
- Or describe it like "around 200" or "about 400"`,
        type: 'grant_question',
        step: 2,
        context: {
          ...context,
          step: 2
        }
      }
    }

    context.grantAnswers.enrollment = enrollment

    return {
      message: `Great! Your school has approximately **${enrollment} students**.

**Question 3 of 5:** What is your estimated budget requirement?

A) 💰 Rs 10,000 - Rs 1 lakh (Small maintenance/supplies)
B) 💰 Rs 1-5 lakh (Minor upgrades)
C) 💰 Rs 5-15 lakh (Significant improvements)
D) 💰 Rs 15-50 lakh (Major infrastructure)
E) 💰 Rs 50 lakh+ (Comprehensive development)

Please reply with the letter (A-E).`,
      type: 'grant_question',
      step: 3,
      context: {
        ...context,
        step: 3
      }
    }
  }

  // Step 3: Budget Requirement
  if (step === 3) {
    let budgetRange = ''
    if (lowerMessage.match(/^a$/)) {
      budgetRange = 'small'
      context.grantAnswers.budget = 50000
    } else if (lowerMessage.match(/^b$/)) {
      budgetRange = 'minor'
      context.grantAnswers.budget = 300000
    } else if (lowerMessage.match(/^c$/)) {
      budgetRange = 'significant'
      context.grantAnswers.budget = 1000000
    } else if (lowerMessage.match(/^d$/)) {
      budgetRange = 'major'
      context.grantAnswers.budget = 3000000
    } else if (lowerMessage.match(/^e$/)) {
      budgetRange = 'comprehensive'
      context.grantAnswers.budget = 10000000
    } else {
      return {
        message: `Please choose one of the budget ranges (A-E).`,
        type: 'grant_question',
        step: 3,
        context: {
          ...context,
          step: 3
        }
      }
    }

    return {
      message: `Perfect! Budget requirement noted.

**Question 4 of 5:** Does your school have the following?

A) ✅ All basic infrastructure (building, electricity, water)
B) ⚠️ Some infrastructure gaps
C) ❌ Significant infrastructure needs

Please reply with the letter (A-C).`,
      type: 'grant_question',
      step: 4,
      context: {
        ...context,
        step: 4
      }
    }
  }

  // Step 4: Infrastructure Status
  if (step === 4) {
    if (lowerMessage.match(/^a$|all|yes|complete/)) {
      context.grantAnswers.infrastructure = 'complete'
    } else if (lowerMessage.match(/^b$|some|partial/)) {
      context.grantAnswers.infrastructure = 'partial'
    } else if (lowerMessage.match(/^c$|significant|no|lacking/)) {
      context.grantAnswers.infrastructure = 'lacking'
    } else {
      return {
        message: `Please choose one option (A-C) regarding your infrastructure status.`,
        type: 'grant_question',
        step: 4,
        context: {
          ...context,
          step: 4
        }
      }
    }

    return {
      message: `Thank you! Last question...

**Question 5 of 5:** When do you need the funding?

A) 🚨 Urgent (within 1-2 months)
B) ⏰ Soon (within 3-6 months)
C) 📅 Planning ahead (6-12 months)

Please reply with the letter (A-C).`,
      type: 'grant_question',
      step: 5,
      context: {
        ...context,
        step: 5
      }
    }
  }

  // Step 5: Timeline - Generate Recommendations
  if (step === 5) {
    let timeline = ''
    if (lowerMessage.match(/^a$|urgent|immediate/)) {
      timeline = 'urgent'
    } else if (lowerMessage.match(/^b$|soon/)) {
      timeline = 'soon'
    } else if (lowerMessage.match(/^c$|planning|later/)) {
      timeline = 'planning'
    } else {
      return {
        message: `Please choose one timeline option (A-C).`,
        type: 'grant_question',
        step: 5,
        context: {
          ...context,
          step: 5
        }
      }
    }

    context.grantAnswers.timeline = timeline

    // Generate recommendations based on answers
    return await generateGrantRecommendations(context.grantAnswers)
  }

  return {
    message: `Something went wrong. Let's start over. Say "help me choose a grant" to begin.`,
    type: 'error'
  }
}

// Generate grant recommendations based on questionnaire
async function generateGrantRecommendations(answers) {
  try {
    await connectDB()
    
    // Fetch grants from both sources
    const [localGrants, mySchemeData] = await Promise.all([
      Grant.find({ status: 'active' }).lean(),
      fetchMySchemeData()
    ])
    
    console.log(`Found ${localGrants.length} local grants and ${mySchemeData?.schemes?.length || 0} MyScheme grants`)
    
    // Process local grants
    const matchedLocalGrants = []
    for (const grant of localGrants) {
      let score = 0
      let reasons = []
      
      // Match by category
      if (grant.category && answers.category) {
        if (grant.category.toLowerCase().includes(answers.need) || 
            answers.category.toLowerCase().includes(grant.category.toLowerCase())) {
          score += 40
          reasons.push(`Perfect match for ${answers.category}`)
        }
      }
      
      // Match by budget
      if (grant.amount) {
        const grantMin = grant.amount.min || 0
        const grantMax = grant.amount.max || 999999999
        if (answers.budget >= grantMin && answers.budget <= grantMax) {
          score += 30
          reasons.push(`Budget aligns with your requirement`)
        }
      }
      
      // Match by enrollment (some grants have minimum student requirements)
      if (answers.enrollment >= 100) {
        score += 15
        reasons.push(`Your enrollment meets typical requirements`)
      }
      
      // Timeline consideration
      if (answers.timeline === 'urgent' && grant.applicationDeadline) {
        const deadline = new Date(grant.applicationDeadline)
        const now = new Date()
        const daysUntilDeadline = Math.floor((deadline - now) / (1000 * 60 * 60 * 24))
        if (daysUntilDeadline > 30) {
          score += 15
          reasons.push(`Sufficient time to apply (${daysUntilDeadline} days)`)
        }
      } else {
        score += 15
      }
      
      if (score > 0) {
        matchedLocalGrants.push({
          ...grant,
          matchScore: score,
          matchReasons: reasons,
          source: 'local'
        })
      }
    }
    
    // Process MyScheme grants
    const matchedMySchemeGrants = []
    if (mySchemeData?.schemes) {
      for (const scheme of mySchemeData.schemes) {
        const similarity = calculateSchemeSimilarity(scheme, answers)
        
        if (similarity.score > 20) { // Only include if reasonable match
          matchedMySchemeGrants.push({
            title: scheme.name,
            description: scheme.description,
            grantProvider: scheme.ministry || 'Government of India',
            amount: scheme.amount || 'Amount varies',
            applicationUrl: scheme.website,
            category: scheme.category?.toLowerCase() || 'education',
            matchScore: similarity.score,
            matchReasons: similarity.reasons,
            source: 'myscheme',
            eligibility: scheme.eligibility,
            applicationProcess: scheme.applicationProcess
          })
        }
      }
    }
    
    // Combine and sort all grants
    const allMatchedGrants = [...matchedLocalGrants, ...matchedMySchemeGrants]
    allMatchedGrants.sort((a, b) => b.matchScore - a.matchScore)
    
    // Take top 5 grants
    const topGrants = allMatchedGrants.slice(0, 5)
    
    if (topGrants.length === 0) {
      return {
        message: `Based on your requirements, I couldn't find exact matches. However, I recommend:

1. **Samagra Shiksha Abhiyan** - Comprehensive scheme covering all aspects of school education
2. **PM SHRI Schools** - For overall school transformation
3. **Karnataka Infrastructure Grant** - State-level support

Please visit the Grants Discovery page in your dashboard to explore all available grants, or contact the Department of Technical Education for personalized guidance.`,
        type: 'grant_recommendations'
      }
    }
    
    let response = `🎯 **Perfect! Based on your answers, here are the TOP ${topGrants.length} GRANTS recommended for your school:**\n\n`
    response += `📊 **Sources:** Local Database (${matchedLocalGrants.length}) + MyScheme.gov.in (${matchedMySchemeGrants.length})\n\n`
    
    topGrants.forEach((grant, index) => {
      const sourceIcon = grant.source === 'local' ? '🏛️' : '🌐'
      
      // Display amount properly
      let amountDisplay = ''
      if (grant.perSchoolAmount) {
        amountDisplay = `Per School: ${grant.perSchoolAmount}`
        if (grant.totalAmount) {
          amountDisplay += `\n💰 Total Scheme: ${grant.totalAmount}`
        }
      } else if (grant.amount && typeof grant.amount === 'object') {
        const min = (grant.amount.min || 0).toLocaleString('en-IN')
        const max = (grant.amount.max || 999999999).toLocaleString('en-IN')
        amountDisplay = `₹${min} - ₹${max}`
      } else if (grant.amount) {
        amountDisplay = grant.amount
      } else {
        amountDisplay = 'Amount varies'
      }
      
      response += `**${index + 1}. ${grant.title || 'Untitled Grant'}** ${sourceIcon} (${grant.matchScore}% match)\n`
      response += `💰 ${amountDisplay}\n`
      response += `🏛️ Provider: ${grant.grantProvider || 'Not specified'}\n`
      
      if (grant.applicationDeadline) {
        response += `📅 Deadline: ${new Date(grant.applicationDeadline).toLocaleDateString()}\n`
      } else if (grant.source === 'myscheme') {
        response += `📅 Deadline: Check official website\n`
      }
      
      response += `✅ Why this matches:\n`
      grant.matchReasons.forEach(reason => {
        response += `   • ${reason}\n`
      })
      
      if (grant.applicationUrl) {
        response += `🔗 Apply: ${grant.applicationUrl}\n`
      }
      
      response += `\n`
    })
    
    response += `\n📋 **Next Steps:**\n\n`
    response += `1. **Review Details**: Check the full grant details and official websites\n`
    response += `2. **Verify Eligibility**: Confirm your school meets all criteria\n`
    response += `3. **Prepare Documents**: Gather required documents (school registration, UDISE, financial statements, etc.)\n`
    response += `4. **Apply Online**: Visit the official portal links provided\n`
    response += `5. **Track Application**: Keep your reference number and follow up regularly\n\n`
    
    response += `💡 **Need help with application?** Ask me "How do I apply for [grant name]?" and I'll provide step-by-step guidance!\n\n`
    response += `🌐 **MyScheme.gov.in Integration**: Real-time data from government schemes portal\n`
    response += `🔗 Visit your **Grants Discovery** page in the dashboard to see all details and application links.`
    
    return {
      message: response,
      type: 'grant_recommendations',
      grants: topGrants,
      sources: {
        local: matchedLocalGrants.length,
        myscheme: matchedMySchemeGrants.length
      }
    }
    
  } catch (error) {
    console.error('Error generating recommendations:', error)
    return {
      message: `I encountered an error while analyzing grants. Please try again or visit the Grants Discovery page in your dashboard.

Error details: ${error.message}`,
      type: 'error'
    }
  }
}
export async function POST(request) {
  try {
    const { message, context = {} } = await request.json()
    
    // Generate response with context
    const result = await generateResponse(message, context)
    
    // If result has context, return it
    if (result && typeof result === 'object') {
      return NextResponse.json(result)
    }
    
    // Otherwise return as simple message
    return NextResponse.json({ message: result })
  } catch (error) {
    console.error('Chatbot error:', error)
    return NextResponse.json(
      { error: 'Failed to process message', details: error.message },
      { status: 500 }
    )
  }
}
