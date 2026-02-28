'use client'
import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { FaCheckCircle, FaCalendar, FaFileAlt, FaUserGraduate } from 'react-icons/fa'

const defaultContent = {
  eligibility: {
    education: 'Completed 7th standard',
    age: '13-15 years'
  },
  dates: {
    applicationStart: 'March 1, 2026',
    applicationEnd: 'May 31, 2026',
    entranceTest: 'June 15, 2026',
    resultsAnnouncement: 'June 30, 2026'
  }
}

export default function AdmissionsPage() {
  const [content, setContent] = useState(defaultContent)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadContent()
  }, [])

  const loadContent = async () => {
    try {
      const response = await fetch('/api/dashboard/pages?page=admissions')
      const data = await response.json()
      if (data.success && data.content?.sections) {
        setContent(data.content.sections)
      }
    } catch (error) {
      console.error('Error loading admissions page content:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-primary-600"></div>
      </div>
    )
  }

  const steps = [
    {
      icon: FaFileAlt,
      title: 'Online Application',
      description: 'Fill out the online application form with required details'
    },
    {
      icon: FaUserGraduate,
      title: 'Entrance Test',
      description: 'Appear for the entrance examination at your chosen campus'
    },
    {
      icon: FaCheckCircle,
      title: 'Interview',
      description: 'Attend the personal interview with school faculty'
    },
    {
      icon: FaCalendar,
      title: 'Admission',
      description: 'Complete document verification and secure your seat'
    }
  ]

  const eligibility = [
    content.eligibility.education,
    `Age: ${content.eligibility.age}`,
    'Resident of Karnataka',
    'Interest in technical education'
  ]

  const documents = [
    'Birth Certificate',
    'Previous year mark sheets',
    'Transfer Certificate',
    'Caste Certificate (if applicable)',
    'Income Certificate',
    'Passport size photographs',
    'Aadhar Card'
  ]

  return (
    <div className="min-h-screen py-20 px-4">
      <div className="container mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h1 className="text-5xl font-bold text-gray-900 mb-4">Admissions</h1>
          <p className="text-xl text-gray-600">
            Join Karnataka's premier technical education institutions
          </p>
        </motion.div>

        {/* Admission Process */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Admission Process</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="card text-center"
              >
                <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <step.icon className="text-3xl text-primary-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{step.title}</h3>
                <p className="text-gray-600">{step.description}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Eligibility & Documents */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            className="card"
          >
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Eligibility Criteria</h2>
            <ul className="space-y-3">
              {eligibility.map((item, index) => (
                <li key={index} className="flex items-start">
                  <FaCheckCircle className="text-green-500 mt-1 mr-3 flex-shrink-0" />
                  <span className="text-gray-700">{item}</span>
                </li>
              ))}
            </ul>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            className="card"
          >
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Required Documents</h2>
            <ul className="space-y-3">
              {documents.map((doc, index) => (
                <li key={index} className="flex items-start">
                  <FaCheckCircle className="text-blue-500 mt-1 mr-3 flex-shrink-0" />
                  <span className="text-gray-700">{doc}</span>
                </li>
              ))}
            </ul>
          </motion.div>
        </div>

        {/* Scholarships */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="card bg-gradient-to-br from-primary-50 to-blue-50 mb-16"
        >
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Scholarships Available</h2>
          <p className="text-gray-700 mb-4">
            We offer merit-based scholarships for top-performing students in grades 8-10 across all six GJTS campuses.
            Additionally, students pursuing Engineering degrees through DCET can receive scholarship support.
          </p>
          <ul className="space-y-2 text-gray-700">
            <li className="flex items-center">
              <FaCheckCircle className="text-green-500 mr-2" />
              Merit-based scholarships for academic excellence
            </li>
            <li className="flex items-center">
              <FaCheckCircle className="text-green-500 mr-2" />
              Financial assistance for economically disadvantaged students
            </li>
            <li className="flex items-center">
              <FaCheckCircle className="text-green-500 mr-2" />
              DCET scholarship for engineering aspirants
            </li>
          </ul>
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="text-center gradient-bg text-white p-12 rounded-2xl"
        >
          <h2 className="text-3xl font-bold mb-4">Ready to Apply?</h2>
          <p className="text-xl mb-8">
            Start your journey towards a successful technical career
          </p>
          <a 
            href="/contact" 
            className="bg-white text-primary-600 px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 transition-all inline-block"
          >
            Contact Us to Apply
          </a>
          <p className="text-sm mt-6 opacity-90">
            Get in touch with us for admission details and application process
          </p>
        </motion.div>
      </div>
    </div>
  )
}
