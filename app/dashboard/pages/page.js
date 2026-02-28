'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { 
  FaArrowLeft, FaHome, FaInfoCircle, FaGraduationCap, 
  FaEnvelope, FaUsers, FaEdit, FaCheck
} from 'react-icons/fa'
import Link from 'next/link'

export default function PagesManagementHub() {
  const router = useRouter()
  const [admin, setAdmin] = useState(null)
  const [loading, setLoading] = useState(true)

  const pages = [
    {
      id: 'home',
      name: 'Home Page',
      description: 'Edit hero section, features, stats, and call-to-action',
      icon: FaHome,
      color: 'blue',
      url: '/dashboard/pages/home'
    },
    {
      id: 'about',
      name: 'About Page',
      description: 'Edit mission, vision, history, and values',
      icon: FaInfoCircle,
      color: 'green',
      url: '/dashboard/pages/about'
    },
    {
      id: 'admissions',
      name: 'Admissions Page',
      description: 'Edit admission process, eligibility, and important dates',
      icon: FaGraduationCap,
      color: 'purple',
      url: '/dashboard/pages/admissions'
    },
    {
      id: 'contact',
      name: 'Contact Page',
      description: 'Edit contact information and social media links',
      icon: FaEnvelope,
      color: 'orange',
      url: '/dashboard/pages/contact'
    },
    {
      id: 'alumni',
      name: 'Alumni Page',
      description: 'Edit alumni registration info and benefits',
      icon: FaUsers,
      color: 'pink',
      url: '/dashboard/pages/alumni'
    }
  ]

  useEffect(() => {
    checkAuth()
  }, [])

  const checkAuth = () => {
    const adminData = localStorage.getItem('schoolAdmin')
    if (!adminData) {
      router.push('/dashboard/login')
      return
    }
    const parsedAdmin = JSON.parse(adminData)
    
    // Only super admin can access
    if (parsedAdmin.role !== 'super_admin') {
      alert('Only Super Admin can edit website pages')
      router.push('/dashboard')
      return
    }
    
    setAdmin(parsedAdmin)
    setLoading(false)
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 font-semibold">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <Link href="/dashboard" className="inline-flex items-center text-primary-600 hover:text-primary-700 mb-4">
            <FaArrowLeft className="mr-2" />
            Back to Dashboard
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">
            <FaEdit className="inline mr-3 text-primary-600" />
            Website Content Management
          </h1>
          <p className="text-gray-600 mt-2">
            Edit content for all website pages - Changes appear immediately on the live site
          </p>
          {admin && (
            <div className="mt-4 bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
              <p className="text-sm text-blue-800">
                <FaCheck className="inline mr-2" />
                <strong>Super Admin Access:</strong> You can edit all website pages. Changes will be visible to all visitors.
              </p>
            </div>
          )}
        </div>

        {/* Pages Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {pages.map((page, index) => {
            const Icon = page.icon
            return (
              <motion.div
                key={page.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Link href={page.url}>
                  <div className={`bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-all cursor-pointer border-t-4 border-${page.color}-500 group`}>
                    <div className="flex items-start justify-between mb-4">
                      <div className={`w-14 h-14 bg-${page.color}-100 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform`}>
                        <Icon className={`text-2xl text-${page.color}-600`} />
                      </div>
                      <FaEdit className="text-gray-400 group-hover:text-primary-600 transition-colors" />
                    </div>
                    
                    <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-primary-600 transition-colors">
                      {page.name}
                    </h3>
                    
                    <p className="text-gray-600 text-sm">
                      {page.description}
                    </p>
                    
                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <span className="text-primary-600 text-sm font-semibold group-hover:underline">
                        Edit Content →
                      </span>
                    </div>
                  </div>
                </Link>
              </motion.div>
            )
          })}
        </div>

        {/* Info Section */}
        <div className="mt-12 bg-gradient-to-r from-primary-50 to-primary-100 rounded-xl p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            How to Use the CMS
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">✏️ Inline Editing</h3>
              <p className="text-gray-700 text-sm">
                Click on any page above to see its content. Hover over sections to see edit buttons. Click "Edit" to modify content directly.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">💾 Save Changes</h3>
              <p className="text-gray-700 text-sm">
                After editing, click "Save" on individual sections, then "Save All Changes" at the top to update the database.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">👁️ Preview</h3>
              <p className="text-gray-700 text-sm">
                The CMS shows content exactly as it appears on the live site. What you see is what visitors will see.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">🔄 Instant Updates</h3>
              <p className="text-gray-700 text-sm">
                Changes appear immediately on the live website after saving. No deployment or restart needed.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
