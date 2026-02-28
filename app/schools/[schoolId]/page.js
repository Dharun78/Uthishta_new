'use client'
import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  FaMapMarkerAlt, FaPhone, FaEnvelope, FaCalendar, 
  FaGraduationCap, FaTrophy, FaTools, FaArrowLeft 
} from 'react-icons/fa'
import Link from 'next/link'
import schoolsData from '@/data/schools-data.json'
import axios from 'axios'

export default function SchoolDetailPage({ params }) {
  const [school, setSchool] = useState(null)
  const [dbContent, setDbContent] = useState(null)

  useEffect(() => {
    loadSchoolData()
  }, [params.schoolId])

  const loadSchoolData = async () => {
    // Load JSON data first
    const jsonSchool = schoolsData.schools.find(s => s.id === params.schoolId)
    
    // Try to load from database
    try {
      const schoolName = jsonSchool?.name?.replace('Government Junior Technical School ', '')
      const response = await axios.get(`/api/public/school-content?school=${schoolName}`)
      
      if (response.data.success && response.data.content) {
        const content = response.data.content
        
        // Merge database content with JSON data
        const mergedSchool = {
          ...jsonSchool,
          courses: content.courses?.length > 0 ? content.courses : jsonSchool.courses,
          facilities: content.facilities?.length > 0 
            ? content.facilities.map(f => f.name || f) 
            : jsonSchool.facilities,
          achievements: content.achievements?.length > 0 
            ? content.achievements.map(a => a.title || a) 
            : jsonSchool.achievements,
          contact: {
            email: content.contactInfo?.email || jsonSchool.contact.email,
            phone: content.contactInfo?.phone || jsonSchool.contact.phone,
            address: content.contactInfo?.address || jsonSchool.contact.address
          }
        }
        
        setSchool(mergedSchool)
        setDbContent(content)
      } else {
        setSchool(jsonSchool)
      }
    } catch (error) {
      console.log('Loading from JSON (database not available)')
      setSchool(jsonSchool)
    }
  }

  if (!school) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading school details...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-800 text-white py-20">
        <div className="container mx-auto px-4">
          <Link href="/schools" className="inline-flex items-center text-white hover:text-gray-200 mb-6">
            <FaArrowLeft className="mr-2" />
            Back to Schools
          </Link>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="text-5xl font-bold mb-4">{school.name}</h1>
            <div className="flex items-center space-x-6 text-lg">
              <span className="flex items-center">
                <FaMapMarkerAlt className="mr-2" />
                {school.location}
              </span>
              <span className="flex items-center">
                <FaCalendar className="mr-2" />
                Established {school.established}
              </span>
              <span className="flex items-center">
                <FaGraduationCap className="mr-2" />
                {school.students} Students
              </span>
            </div>
          </motion.div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Courses */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-xl shadow-lg p-8"
            >
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                <FaGraduationCap className="inline mr-3 text-primary-600" />
                Courses Offered
              </h2>
              <div className="space-y-6">
                {school.courses.map((course, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="border-l-4 border-primary-500 pl-6 py-4"
                  >
                    <h3 className="text-xl font-bold text-gray-900">{course.name}</h3>
                    <p className="text-gray-600 mt-2">{course.description}</p>
                    <p className="text-sm text-primary-600 mt-2">
                      Duration: {course.duration}
                    </p>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Facilities */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-xl shadow-lg p-8"
            >
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                <FaTools className="inline mr-3 text-primary-600" />
                Facilities
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {school.facilities.map((facility, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.05 }}
                    className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg"
                  >
                    <div className="w-2 h-2 bg-primary-600 rounded-full"></div>
                    <span className="text-gray-700">{facility}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Achievements */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white rounded-xl shadow-lg p-8"
            >
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                <FaTrophy className="inline mr-3 text-yellow-500" />
                Achievements
              </h2>
              <div className="space-y-4">
                {school.achievements.map((achievement, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-start space-x-4 p-4 bg-yellow-50 rounded-lg"
                  >
                    <FaTrophy className="text-yellow-500 text-xl mt-1" />
                    <span className="text-gray-700">{achievement}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Contact Information */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white rounded-xl shadow-lg p-6 sticky top-6"
            >
              <h3 className="text-xl font-bold text-gray-900 mb-4">Contact Information</h3>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <FaMapMarkerAlt className="text-primary-600 text-xl mt-1" />
                  <div>
                    <div className="font-semibold text-gray-900">Address</div>
                    <div className="text-gray-600 text-sm">{school.contact.address}</div>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <FaPhone className="text-primary-600 text-xl mt-1" />
                  <div>
                    <div className="font-semibold text-gray-900">Phone</div>
                    <div className="text-gray-600 text-sm">{school.contact.phone}</div>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <FaEnvelope className="text-primary-600 text-xl mt-1" />
                  <div>
                    <div className="font-semibold text-gray-900">Email</div>
                    <div className="text-gray-600 text-sm">{school.contact.email}</div>
                  </div>
                </div>
              </div>

              <div className="mt-6 space-y-3">
                <Link href="/admissions" className="block">
                  <button className="w-full btn-primary">
                    Apply Now
                  </button>
                </Link>
                <Link href="/alumni" className="block">
                  <button className="w-full px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50">
                    Alumni Registration
                  </button>
                </Link>
              </div>
            </motion.div>

            {/* Quick Stats */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-gradient-to-br from-primary-500 to-primary-700 rounded-xl shadow-lg p-6 text-white"
            >
              <h3 className="text-xl font-bold mb-4">Quick Stats</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span>Students</span>
                  <span className="text-2xl font-bold">{school.students}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Courses</span>
                  <span className="text-2xl font-bold">{school.courses.length}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Facilities</span>
                  <span className="text-2xl font-bold">{school.facilities.length}</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
}
