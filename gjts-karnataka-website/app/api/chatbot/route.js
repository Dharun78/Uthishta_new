import { NextResponse } from 'next/server'

// School data for chatbot training
const schoolData = {
  schools: [
    {
      name: 'GJTS Ballari',
      location: 'Ballari, Karnataka',
      students: 150,
      established: '2013',
      courses: ['Electronics', 'Mechanical', 'Computer Science'],
    },
    {
      name: 'GJTS Bhadravati',
      location: 'Bhadravati, Karnataka',
      students: 140,
      established: '2023',
      courses: ['Electronics', 'Mechanical', 'Electrical'],
    },
    {
      name: 'GJTS Hubballi',
      location: 'Hubballi, Karnataka',
      students: 160,
      established: '2013',
      courses: ['Electronics', 'Mechanical', 'Computer Science'],
    },
    {
      name: 'GJTS Bagalkot',
      location: 'Bagalkot, Karnataka',
      students: 135,
      established: '2023',
      courses: ['Electronics', 'Mechanical'],
    },
    {
      name: 'GJTS Kalburgi',
      location: 'Kalburgi, Karnataka',
      students: 145,
      established: '2023',
      courses: ['Electronics', 'Mechanical', 'Computer Science'],
    },
    {
      name: 'GJTS Mangalore',
      location: 'Mangalore, Karnataka',
      students: 155,
      established: '2023',
      courses: ['Electronics', 'Mechanical', 'Electrical'],
    },
  ],
  general: {
    totalStudents: '800+',
    campuses: 6,
    placementRate: '70%',
    admissionGrowth: '17%',
    partner: 'Quest Global & Uthishta NGO',
    grades: '8th to 10th standard',
    scholarships: 'Merit-based scholarships available',
    facilities: ['Science Labs', 'Libraries', 'Computer Labs', 'Sports Facilities'],
  },
}

// Simple rule-based chatbot
function generateResponse(message) {
  const lowerMessage = message.toLowerCase()

  // Greetings
  if (lowerMessage.match(/hello|hi|hey|greetings/)) {
    return 'Hello! I\'m here to help you with information about Government Junior Technical Schools in Karnataka. You can ask me about admissions, courses, locations, or any specific school.'
  }

  // Schools information
  if (lowerMessage.includes('school') || lowerMessage.includes('campus')) {
    if (lowerMessage.includes('how many') || lowerMessage.includes('list')) {
      return `We have ${schoolData.general.campuses} GJTS campuses across Karnataka:\n1. GJTS Ballari\n2. GJTS Bhadravati\n3. GJTS Hubballi\n4. GJTS Bagalkot\n5. GJTS Kalburgi\n6. GJTS Mangalore\n\nEach school offers quality technical education with modern facilities.`
    }
    
    // Specific school queries
    const schoolNames = ['ballari', 'bhadravati', 'hubballi', 'bagalkot', 'kalburgi', 'mangalore']
    for (const schoolName of schoolNames) {
      if (lowerMessage.includes(schoolName)) {
        const school = schoolData.schools.find(s => s.name.toLowerCase().includes(schoolName))
        return `${school.name} is located in ${school.location}. It has approximately ${school.students} students and offers courses in ${school.courses.join(', ')}. The school was established in ${school.established}.`
      }
    }
  }

  // Admissions
  if (lowerMessage.includes('admission') || lowerMessage.includes('apply') || lowerMessage.includes('enroll')) {
    return 'Admissions are open for grades 8-10. We offer merit-based scholarships for top-performing students. The admission process includes:\n1. Online application\n2. Entrance test\n3. Interview\n4. Document verification\n\nFor detailed information, please visit our Admissions page or contact your nearest GJTS campus.'
  }

  // Courses
  if (lowerMessage.includes('course') || lowerMessage.includes('subject') || lowerMessage.includes('stream')) {
    return 'Our schools offer technical courses in:\n• Electronics\n• Mechanical Engineering\n• Computer Science\n• Electrical Engineering\n\nStudents receive hands-on training with modern equipment and experienced faculty.'
  }

  // Facilities
  if (lowerMessage.includes('facilit') || lowerMessage.includes('infrastructure') || lowerMessage.includes('lab')) {
    return `Our schools are equipped with:\n• ${schoolData.general.facilities.join('\n• ')}\n\nWe also provide uniforms, school bags, tool kits, and sports materials to all students.`
  }

  // Placement
  if (lowerMessage.includes('placement') || lowerMessage.includes('job') || lowerMessage.includes('career')) {
    return `We have an impressive ${schoolData.general.placementRate} placement rate! Our partnership with ${schoolData.general.partner} helps students transition to higher education and employment. Many of our graduates work with leading technology firms including Quest Global.`
  }

  // Scholarships
  if (lowerMessage.includes('scholarship') || lowerMessage.includes('financial')) {
    return 'We offer merit-based scholarships for top-performing students in grades 8-10 across all six GJTS campuses. Additionally, students pursuing Engineering degrees through DCET can receive scholarship support.'
  }

  // Alumni
  if (lowerMessage.includes('alumni') || lowerMessage.includes('graduate')) {
    return 'Our alumni network is growing strong! 70% of our engineering graduates have secured employment with leading technology firms. You can register as an alumni on our Alumni page to stay connected and contribute to our community.'
  }

  // Contact
  if (lowerMessage.includes('contact') || lowerMessage.includes('phone') || lowerMessage.includes('email')) {
    return 'You can reach us at:\nEmail: info@gjtskarnataka.edu.in\nPhone: 080-XXXX-XXXX\n\nFor specific school contacts, please visit the individual school pages.'
  }

  // Default response
  return 'I can help you with information about:\n• Our 6 GJTS campuses\n• Admissions process\n• Courses offered\n• Facilities and infrastructure\n• Placements and careers\n• Scholarships\n• Alumni registration\n\nWhat would you like to know?'
}

export async function POST(request) {
  try {
    const { message } = await request.json()
    
    const response = generateResponse(message)
    
    return NextResponse.json({ message: response })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to process message' },
      { status: 500 }
    )
  }
}
