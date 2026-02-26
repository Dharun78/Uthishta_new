'use client'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { FaMapMarkerAlt, FaUsers } from 'react-icons/fa'

export default function SchoolCard({ school, index }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="card group cursor-pointer"
    >
      <div className="relative h-48 bg-gradient-to-br from-primary-400 to-primary-600 rounded-lg mb-4 overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center text-white text-6xl font-bold opacity-20">
          {school.name.split(' ')[1]}
        </div>
      </div>
      
      <h3 className="text-2xl font-bold text-gray-900 mb-2">{school.name}</h3>
      
      <div className="flex items-center text-gray-600 mb-2">
        <FaMapMarkerAlt className="mr-2 text-primary-600" />
        <span>{school.location}</span>
      </div>
      
      <div className="flex items-center text-gray-600 mb-4">
        <FaUsers className="mr-2 text-primary-600" />
        <span>{school.students}+ Students</span>
      </div>
      
      <Link 
        href={`/schools/${school.location.toLowerCase()}`}
        className="text-primary-600 font-semibold hover:text-primary-700 transition-colors"
      >
        Learn More →
      </Link>
    </motion.div>
  )
}
