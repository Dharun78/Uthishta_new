'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { FaPlus, FaEdit, FaTrash, FaEye, FaEyeSlash, FaBars } from 'react-icons/fa'
import Link from 'next/link'
import axios from 'axios'

export default function CustomPagesManager() {
  const router = useRouter()
  const [admin, setAdmin] = useState(null)
  const [pages, setPages] = useState([])
  const [loading, setLoading] = useState(true)

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
      alert('Only Super Admin can manage custom pages')
      router.push('/dashboard')
      return
    }
    
    setAdmin(parsedAdmin)
    fetchPages()
  }

  const fetchPages = async () => {
    try {
      const token = localStorage.getItem('dashboardToken')
      const response = await axios.get('/api/dashboard/custom-pages', {
        headers: { Authorization: `Bearer ${token}` }
      })
      setPages(response.data.pages)
    } catch (error) {
      console.error('Error fetching pages:', error)
      alert('Failed to load pages')
    } finally {
      setLoading(false)
    }
  }

  const togglePublish = async (slug, currentStatus) => {
    try {
      const token = localStorage.getItem('dashboardToken')
      const newStatus = currentStatus === 'published' ? 'draft' : 'published'
      
      await axios.put(`/api/dashboard/custom-pages/${slug}`, 
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      
      fetchPages()
    } catch (error) {
      console.error('Error toggling publish:', error)
      alert('Failed to update page status')
    }
  }

  const deletePage = async (slug, title) => {
    if (!confirm(`Are you sure you want to delete "${title}"? This action cannot be undone.`)) {
      return
    }

    try {
      const token = localStorage.getItem('dashboardToken')
      await axios.delete(`/api/dashboard/custom-pages/${slug}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      
      alert('Page deleted successfully')
      fetchPages()
    } catch (error) {
      console.error('Error deleting page:', error)
      alert('Failed to delete page')
    }
  }

  if (!admin || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-primary-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Custom Pages Manager</h1>
            <p className="text-gray-600 mt-2">Create and manage custom pages for your website</p>
          </div>
          
          <Link href="/dashboard/pages/custom/new" className="btn-primary flex items-center">
            <FaPlus className="mr-2" />
            Create New Page
          </Link>
        </div>

        {pages.length === 0 ? (
          <div className="bg-white rounded-xl shadow-lg p-12 text-center">
            <div className="text-gray-400 mb-4">
              <FaBars className="text-6xl mx-auto" />
            </div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">No Custom Pages Yet</h3>
            <p className="text-gray-500 mb-6">Create your first custom page to get started</p>
            <Link href="/dashboard/pages/custom/new" className="btn-primary inline-flex items-center">
              <FaPlus className="mr-2" />
              Create Your First Page
            </Link>
          </div>
        ) : (
          <div className="grid gap-6">
            {pages.map((page, index) => (
              <motion.div key={page._id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.1 }} className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-bold text-gray-900">{page.title}</h3>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${page.status === 'published' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>
                        {page.status === 'published' ? 'Published' : 'Draft'}
                      </span>
                      {page.showInMenu && (
                        <span className="px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-700">In Menu</span>
                      )}
                    </div>
                    <p className="text-gray-600 mb-2">
                      <span className="font-mono text-sm bg-gray-100 px-2 py-1 rounded">/{page.slug}</span>
                    </p>
                    {page.metaDescription && (
                      <p className="text-gray-500 text-sm mb-3">{page.metaDescription}</p>
                    )}
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <span>Created: {new Date(page.createdAt).toLocaleDateString()}</span>
                      {page.showInMenu && (<span>Menu Order: {page.menuOrder}</span>)}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 ml-4">
                    <button onClick={() => togglePublish(page.slug, page.status)} className={`p-3 rounded-lg transition-colors ${page.status === 'published' ? 'bg-green-100 text-green-600 hover:bg-green-200' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`} title={page.status === 'published' ? 'Unpublish' : 'Publish'}>
                      {page.status === 'published' ? <FaEye /> : <FaEyeSlash />}
                    </button>
                    <Link href={`/dashboard/pages/custom/${page.slug}/edit`} className="p-3 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-colors" title="Edit">
                      <FaEdit />
                    </Link>
                    <button onClick={() => deletePage(page.slug, page.title)} className="p-3 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors" title="Delete">
                      <FaTrash />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
