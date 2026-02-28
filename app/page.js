'use client'
import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { FaGraduationCap, FaUsers, FaAward, FaMapMarkerAlt } from 'react-icons/fa'
import SchoolCard from '@/components/SchoolCard'

const schools = [
  { id: 1, name: 'GJTS Ballari', location: 'Ballari', image: '/images/ballari.jpg', students: 150 },
  { id: 2, name: 'GJTS Bhadravati', location: 'Bhadravati', image: '/images/bhadravati.jpg', students: 140 },
  { id: 3, name: 'GJTS Hubballi', location: 'Hubballi', image: '/images/hubballi.jpg', students: 160 },
  { id: 4, name: 'GJTS Bagalkot', location: 'Bagalkot', image: '/images/bagalkot.jpg', students: 135 },
  { id: 5, name: 'GJTS Kalburgi', location: 'Kalburgi', image: '/images/kalburgi.jpg', students: 145 },
  { id: 6, name: 'GJTS Mangalore', location: 'Mangalore', image: '/images/mangalore.jpg', students: 155 },
]

// Default content (fallback if database is empty)
const defaultContent = {
  hero: {
    title: 'Government Junior Technical Schools',
    subtitle: 'Empowering Karnataka\'s Youth with Quality Technical Education',
    description: 'Building skilled professionals for tomorrow'
  },
  stats: {
    students: '800+',
    schools: '6',
    placement: '70%',
    growth: '17%'
  }
}

export default function Home() {
  const [content, setContent] = useState(defaultContent)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadContent()
  }, [])

  const loadContent = async () => {
    try {
      const response = await fetch('/api/dashboard/pages?page=home')
      const data = await response.json()
      if (data.success && data.content?.sections) {
        setContent(data.content.sections)
      }
    } catch (error) {
      console.error('Error loading home page content:', error)
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
  return (
    <>
      {/* Hero Section */}
      <section className="gradient-bg text-white py-24 px-4">
        <div className="container mx-auto text-center">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-6xl font-bold mb-6"
          >
            {content.hero.title}
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto"
          >
            {content.hero.subtitle}
          </motion.p>
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="flex gap-4 justify-center flex-wrap"
          >
            <Link href="/admissions" className="btn-primary">
              Apply Now
            </Link>
            <Link href="/about" className="bg-white text-primary-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-all">
              Learn More
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              { icon: FaGraduationCap, value: content.stats.students, label: 'Students' },
              { icon: FaUsers, value: content.stats.schools, label: 'Campuses' },
              { icon: FaAward, value: content.stats.placement, label: 'Placement Rate' },
              { icon: FaMapMarkerAlt, value: content.stats.growth, label: 'Admission Growth' },
            ].map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <stat.icon className="text-5xl text-primary-600 mx-auto mb-4" />
                <h3 className="text-4xl font-bold text-gray-900">{stat.value}</h3>
                <p className="text-gray-600 mt-2">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Schools Section */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="container mx-auto">
          <h2 className="section-title text-center mb-12">Our Campuses</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {schools.map((school, index) => (
              <SchoolCard key={school.id} school={school} index={index} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 gradient-bg text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-6">Join Our Alumni Network</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Connect with fellow graduates and contribute to the growth of our institutions
          </p>
          <Link href="/alumni" className="bg-white text-primary-600 px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 transition-all inline-block">
            Register as Alumni
          </Link>
        </div>
      </section>
    </>
  )
}
