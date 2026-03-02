'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { FaArrowLeft, FaSave, FaEye } from 'react-icons/fa'
import Link from 'next/link'
import axios from 'axios'

export default function NewCustomPage() {
  const router = useRouter()
  const [admin, setAdmin] = useState(null)
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    content: '',
    metaDescription: '',
    status: 'draft',
    showInMenu: false,
    menuOrder: 0
  })

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
    
    if (parsedAdmin.role !== 'super_admin') {
      alert('Only Super Admin can create pages')
      router.push('/dashboard')
      return
    }
    
    setAdmin(parsedAdmin)
  }

  const generateSlug = (title) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
  }

  const handleTitleChange = (e) => {
    const title = e.target.value
    setFormData({
      ...formData,
      title,
      slug: generateSlug(title)
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!formData.title || !formData.slug || !formData.content) {
      alert('Please fill in all required fields')
      return
    }

    setLoading(true)

    try {
      const token = localStorage.getItem('dashboardToken')
      await axios.post('/api/dashboard/custom-pages', formData, {
        headers: { Authorization: `Bearer ${token}` }
      })
      
      alert('Page created successfully!')
      router.push('/dashboard/pages/custom')
    } catch (error) {
      console.error('Error creating page:', error)
      alert(error.response?.data?.error || 'Failed to create page')
    } finally {
      setLoading(false)
    }
  }

  if (!admin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-primary-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header */}
        <div className="mb-8">
          <Link href="/dashboard/pages/custom" className="inline-flex items-center text-primary-600 hover:text-primary-700 mb-4">
            <FaArrowLeft className="mr-2" />
            Back to Custom Pages
          </Link>
          
          <h1 className="text-3xl font-bold text-gray-900">Create New Page</h1>
          <p className="text-gray-600 mt-2">Add a new custom page to your website</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-lg p-8">
          {/* Title */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Page Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={handleTitleChange}
              placeholder="e.g., Our Facilities"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              required
            />
          </div>

          {/* Slug */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              URL Slug <span className="text-red-500">*</span>
            </label>
            <div className="flex items-center">
              <span className="text-gray-500 mr-2">yoursite.com/</span>
              <input
                type="text"
                value={formData.slug}
                onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                placeholder="facilities"
                className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                required
              />
            </div>
            <p className="text-sm text-gray-500 mt-1">Auto-generated from title, but you can customize it</p>
          </div>

          {/* Content */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Page Content <span className="text-red-500">*</span>
            </label>
            <textarea
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              placeholder="Write your page content here... (HTML supported)"
              rows={15}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 font-mono text-sm"
              required
            />
            <p className="text-sm text-gray-500 mt-1">You can use HTML tags for formatting</p>
          </div>

          {/* Meta Description */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Meta Description (SEO)
            </label>
            <textarea
              value={formData.metaDescription}
              onChange={(e) => setFormData({ ...formData, metaDescription: e.target.value })}
              placeholder="Brief description for search engines (150-160 characters)"
              rows={3}
              maxLength={160}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
            <p className="text-sm text-gray-500 mt-1">
              {formData.metaDescription.length}/160 characters
            </p>
          </div>

          {/* Settings */}
          <div className="mb-6 p-4 bg-gray-50 rounded-lg">
            <h3 className="font-semibold text-gray-900 mb-4">Page Settings</h3>
            
            {/* Status */}
            <div className="mb-4">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Status
              </label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="draft">Draft (Not visible to public)</option>
                <option value="published">Published (Visible to public)</option>
              </select>
            </div>

            {/* Show in Menu */}
            <div className="mb-4">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.showInMenu}
                  onChange={(e) => setFormData({ ...formData, showInMenu: e.target.checked })}
                  className="w-5 h-5 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                />
                <span className="ml-3 text-sm font-semibold text-gray-700">
                  Show in navigation menu
                </span>
              </label>
            </div>

            {/* Menu Order */}
            {formData.showInMenu && (
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Menu Order
                </label>
                <input
                  type="number"
                  value={formData.menuOrder}
                  onChange={(e) => setFormData({ ...formData, menuOrder: parseInt(e.target.value) })}
                  min="0"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
                <p className="text-sm text-gray-500 mt-1">Lower numbers appear first in the menu</p>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex items-center justify-between pt-6 border-t">
            <Link
              href="/dashboard/pages/custom"
              className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
            >
              Cancel
            </Link>
            
            <button
              type="submit"
              disabled={loading}
              className="btn-primary flex items-center disabled:opacity-50"
            >
              <FaSave className="mr-2" />
              {loading ? 'Creating...' : 'Create Page'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
