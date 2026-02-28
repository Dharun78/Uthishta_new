'use client'
import { motion } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'
import { FaMapMarkerAlt, FaUsers } from 'react-icons/fa'
import { useState } from 'react'

export default function SchoolCard({ school, index }) {
  const [imageError, setImageError] = useState(false)
  
  // Placeholder image from Unsplash (school/education themed)
  const placeholderImage = `https://images.unsplash.com/photo-1562774053-701939374585?w=800&h=600&fit=crop&q=80`
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="card group cursor-pointer"
    >
      <div className="relative h-48 rounded-lg mb-4 overflow-hidden bg-gray-200">
        {!imageError ? (
          <Image
            src={school.image}
            alt={school.name}
            fill
            className="object-cover group-hover:scale-110 transition-transform duration-300"
            onError={() => setImageError(true)}
          />
        ) : (
          <Image
            src={placeholderImage}
            alt={school.name}
            fill
            className="object-cover group-hover:scale-110 transition-transform duration-300"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <h3 className="text-white text-xl font-bold">{school.name}</h3>
        </div>
      </div>
      
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
