'use client'
import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { FaRocket, FaUsers, FaLightbulb, FaHandshake } from 'react-icons/fa'

const defaultContent = {
  mission: 'To provide quality technical education and skill development to students across Karnataka',
  vision: 'To be the leading technical education institution empowering youth with industry-ready skills',
  history: 'Established in 2013, GJTS has been at the forefront of technical education in Karnataka',
  values: [
    'Excellence in Education',
    'Industry Collaboration',
    'Student-Centric Approach',
    'Innovation and Growth'
  ]
}

export default function AboutPage() {
  const [content, setContent] = useState(defaultContent)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadContent()
  }, [])

  const loadContent = async () => {
    try {
      const response = await fetch('/api/dashboard/pages?page=about')
      const data = await response.json()
      if (data.success && data.content?.sections) {
        setContent(data.content.sections)
      }
    } catch (error) {
      console.error('Error loading about page content:', error)
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

  const valueIcons = [FaRocket, FaUsers, FaLightbulb, FaHandshake]

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="gradient-bg text-white py-20 px-4">
        <div className="container mx-auto max-w-4xl text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl font-bold mb-6"
          >
            About GJTS Karnataka
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xl"
          >
            Empowering Karnataka's youth with quality technical education since 2013
          </motion.p>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              className="card"
            >
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Mission</h2>
              <p className="text-gray-700 leading-relaxed">
                {content.mission}
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              className="card"
            >
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Vision</h2>
              <p className="text-gray-700 leading-relaxed">
                {content.vision}
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-4xl font-bold text-gray-900 mb-12 text-center">Our Values</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {content.values.map((value, index) => {
              const Icon = valueIcons[index % valueIcons.length]
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="text-center"
                >
                  <div className="w-20 h-20 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Icon className="text-4xl text-primary-600" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{value}</h3>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Partnership */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="card"
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Partnership</h2>
            <div className="space-y-4 text-gray-700">
              <p>
                Since 2013, Quest Global, the world's largest independent pure-play engineering services company,
                has been supporting Government Junior Technical Schools in Karnataka through its "Education for
                Underserved" initiative in collaboration with NGO partner Uthishta.
              </p>
              <p>
                What began with a single school in Hubballi has expanded to all six Government JTS institutions
                across Ballari, Bhadravati, Hubballi, Bagalkot, Kalburgi, and Mangalore, directly benefiting
                over 800 students.
              </p>
              <p>
                This comprehensive support includes infrastructure development (science labs, libraries, computer
                labs), learning resources, technology access, furniture, scholarships, and holistic student
                development programs.
              </p>
              <p className="font-semibold text-primary-600">
                Results: 17% increase in admissions, 70% placement rate for graduates, and hundreds of students
                successfully transitioning to higher education.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Impact Stats */}
      <section className="py-20 px-4 gradient-bg text-white">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-4xl font-bold mb-12 text-center">Our Impact</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { value: '800+', label: 'Students Supported' },
              { value: '6', label: 'Campuses' },
              { value: '70%', label: 'Placement Rate' },
              { value: '17%', label: 'Admission Growth' }
            ].map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="text-5xl font-bold mb-2">{stat.value}</div>
                <div className="text-lg opacity-90">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
