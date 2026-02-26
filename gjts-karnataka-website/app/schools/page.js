'use client'
import { motion } from 'framer-motion'
import SchoolCard from '@/components/SchoolCard'
import schoolsData from '@/data/schools-data.json'

export default function SchoolsPage() {
  const schools = [
    { id: 1, name: 'GJTS Ballari', location: 'Ballari', image: '/images/ballari.jpg', students: 150 },
    { id: 2, name: 'GJTS Bhadravati', location: 'Bhadravati', image: '/images/bhadravati.jpg', students: 140 },
    { id: 3, name: 'GJTS Hubballi', location: 'Hubballi', image: '/images/hubballi.jpg', students: 160 },
    { id: 4, name: 'GJTS Bagalkot', location: 'Bagalkot', image: '/images/bagalkot.jpg', students: 135 },
    { id: 5, name: 'GJTS Kalburgi', location: 'Kalburgi', image: '/images/kalburgi.jpg', students: 145 },
    { id: 6, name: 'GJTS Mangalore', location: 'Mangalore', image: '/images/mangalore.jpg', students: 155 },
  ]

  return (
    <div className="min-h-screen py-20 px-4">
      <div className="container mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h1 className="text-5xl font-bold text-gray-900 mb-4">Our Schools</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Six Government Junior Technical Schools across Karnataka, providing quality technical education
            to students from underserved communities
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {schools.map((school, index) => (
            <SchoolCard key={school.id} school={school} index={index} />
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="card max-w-4xl mx-auto"
        >
          <h2 className="text-3xl font-bold text-gray-900 mb-6">About Our Initiative</h2>
          <div className="space-y-4 text-gray-700">
            <p>
              Since 2013, Quest Global in partnership with Uthishta NGO has been supporting Government Junior
              Technical Schools across Karnataka. What started with a single school in Hubballi has now expanded
              to six campuses serving over 800 students.
            </p>
            <p>
              Our comprehensive support includes infrastructure development, modern equipment, scholarships,
              and skills development programs. This sustained effort has resulted in a 17% increase in admissions
              and a 70% placement rate for our graduates.
            </p>
            <p>
              Each school offers technical education in Electronics, Mechanical Engineering, Computer Science,
              and Electrical Engineering, preparing students for successful careers in technology and engineering.
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
