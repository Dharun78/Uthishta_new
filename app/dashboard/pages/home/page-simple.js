'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { FaArrowLeft, FaSave, FaEdit, FaTimes, FaCheck, FaGraduationCap, FaUsers, FaAward, FaMapMarkerAlt } from 'react-icons/fa'
import axios from 'axios'
import Link from 'next/link'

export default function HomePageEditor() {
  const router = useRouter()
  const [admin, setAdmin] = useState(null)
  const [content, setContent] = useState(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState({ type: '', text: '' })
  const [editingSection, setEditingSection] = useState(null)
  const [tempData, setTempData] = useState(null)

  useEffect(() => {
    const adminData = localStorage.getItem('schoolAdmin')
    if (!adminData) {
      router.push('/dashboard/login')
      return
    }
    const parsedAdmin = JSON.parse(adminData)
    if (parsedAdmin.role !== 'super_admin') {
      alert('Only Super Admin can edit website pages')
      router.push('/dashboard')
      return
    }
    setAdmin(parsedAdmin)
  }, [router])

  useEffect(() => {
    if (admin) loadContent()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [admin])

  const loadContent = async () => {
    try {
      setLoading(true)
      const response = await axios.get('/api/dashboard/pages?page=home')
      
      if (response.data.success && response.data.content?.sections) {
        const sections = response.data.content.sections
        // Only use hero and stats - ignore facilities and achievements
        setContent({
          hero: sections.hero || {
            title: 'Government Junior Technical Schools Karnataka',
            subtitle: 'Empowering Youth Through Technical Education',
            description: 'Building skilled professionals for tomorrow'
          },
          stats: sections.stats || {
            students: '800+',
            schools: '6',
            placement: '70%',
            growth: '17%'
          }
        })
      } else {
        setContent({
          hero: {
            title: 'Government Junior Technical Schools Karnataka',
            subtitle: 'Empowering Youth Through Technical Education',
            description: 'Building skilled professionals for tomorrow'
          },
          stats: {
            students: '800+',
            schools: '6',
            placement: '70%',
            growth: '17%'
          }
        })
      }
    } catch (error) {
      console.error('Error loading content:', error)
      setMessage({ type: 'error', text: 'Failed to load content' })
      setContent({
        hero: {
          title: 'Government Junior Technical Schools Karnataka',
          subtitle: 'Empowering Youth Through Technical Education',
          description: 'Building skilled professionals for tomorrow'
        },
        stats: {
          students: '800+',
          schools: '6',
          placement: '70%',
          growth: '17%'
        }
      })
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    try {
      setSaving(true)
      const token = localStorage.getItem('dashboardToken')
      await axios.put('/api/dashboard/pages', {
        page: 'home',
        sections: {
          ...content,
          facilities: [],
          achievements: []
        }
      }, {
        headers: { Authorization: `Bearer ${token}` }
      })
      setMessage({ type: 'success', text: '✅ Home page updated successfully!' })
      window.scrollTo({ top: 0, behavior: 'smooth' })
      setTimeout(() => setMessage({ type: '', text: '' }), 5000)
    } catch (error) {
      setMessage({ type: 'error', text: `❌ ${error.response?.data?.error || 'Failed to save'}` })
    } finally {
      setSaving(false)
    }
  }

  const startEdit = (section) => {
    setEditingSection(section)
    setTempData(JSON.parse(JSON.stringify(content[section])))
  }

  const saveEdit = () => {
    setContent({ ...content, [editingSection]: tempData })
    setEditingSection(null)
    setTempData(null)
  }

  const cancelEdit = () => {
    setEditingSection(null)
    setTempData(null)
  }

  if (loading || !admin || !content) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Fixed Header */}
      <div className="bg-white shadow-md sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/dashboard/pages" className="text-primary-600 hover:text-primary-700">
                <FaArrowLeft className="text-xl" />
              </Link>
              <div>
                <h1 className="text-2xl font-bold">✏️ Edit Home Page (Simple Version)</h1>
                <p className="text-sm text-gray-600">Hover over sections to see edit buttons</p>
              </div>
            </div>
            <button onClick={handleSave} disabled={saving} className="btn-primary">
              <FaSave className="inline mr-2" />
              {saving ? 'Saving...' : 'Save All Changes'}
            </button>
          </div>
          {message.text && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`mt-3 p-3 rounded-lg ${message.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}
            >
              {message.text}
            </motion.div>
          )}
        </div>
      </div>

      {/* Hero Section */}
      <section className="gradient-bg text-white py-24 px-4 relative group">
        {editingSection === 'hero' ? (
          <div className="container mx-auto border-4 border-blue-500 rounded-lg p-8 bg-blue-900 bg-opacity-50">
            <div className="flex justify-end space-x-2 mb-4">
              <button onClick={saveEdit} className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded">
                <FaCheck className="inline mr-1" /> Save
              </button>
              <button onClick={cancelEdit} className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded">
                <FaTimes className="inline mr-1" /> Cancel
              </button>
            </div>
            <div className="space-y-4 max-w-3xl mx-auto">
              <div>
                <label className="block text-sm font-semibold mb-1">Main Title</label>
                <input
                  type="text"
                  value={tempData.title}
                  onChange={(e) => setTempData({ ...tempData, title: e.target.value })}
                  className="w-full px-4 py-2 rounded text-gray-900"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1">Subtitle</label>
                <input
                  type="text"
                  value={tempData.subtitle}
                  onChange={(e) => setTempData({ ...tempData, subtitle: e.target.value })}
                  className="w-full px-4 py-2 rounded text-gray-900"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1">Description</label>
                <textarea
                  value={tempData.description}
                  onChange={(e) => setTempData({ ...tempData, description: e.target.value })}
                  rows={2}
                  className="w-full px-4 py-2 rounded text-gray-900"
                />
              </div>
            </div>
          </div>
        ) : (
          <div className="container mx-auto text-center">
            <button
              onClick={() => startEdit('hero')}
              className="absolute top-4 right-4 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <FaEdit className="inline mr-1" /> Edit Hero
            </button>
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
        )}
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white relative group">
        {editingSection === 'stats' ? (
          <div className="container mx-auto px-4 border-4 border-blue-500 rounded-lg p-8 bg-blue-50">
            <div className="flex justify-end space-x-2 mb-4">
              <button onClick={saveEdit} className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded">
                <FaCheck className="inline mr-1" /> Save
              </button>
              <button onClick={cancelEdit} className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded">
                <FaTimes className="inline mr-1" /> Cancel
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div>
                <label className="block text-sm font-semibold mb-1">Students</label>
                <input
                  type="text"
                  value={tempData.students}
                  onChange={(e) => setTempData({ ...tempData, students: e.target.value })}
                  className="w-full px-3 py-2 border rounded"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1">Schools</label>
                <input
                  type="text"
                  value={tempData.schools}
                  onChange={(e) => setTempData({ ...tempData, schools: e.target.value })}
                  className="w-full px-3 py-2 border rounded"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1">Placement Rate</label>
                <input
                  type="text"
                  value={tempData.placement}
                  onChange={(e) => setTempData({ ...tempData, placement: e.target.value })}
                  className="w-full px-3 py-2 border rounded"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1">Growth</label>
                <input
                  type="text"
                  value={tempData.growth}
                  onChange={(e) => setTempData({ ...tempData, growth: e.target.value })}
                  className="w-full px-3 py-2 border rounded"
                />
              </div>
            </div>
          </div>
        ) : (
          <div className="container mx-auto px-4">
            <button
              onClick={() => startEdit('stats')}
              className="absolute top-4 right-4 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <FaEdit className="inline mr-1" /> Edit Stats
            </button>
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
        )}
      </section>

      {/* Info Box */}
      <div className="container mx-auto px-4 py-8">
        <div className="bg-yellow-50 border-l-4 border-yellow-500 p-6 rounded">
          <h3 className="font-bold text-yellow-900 mb-2">⚠️ Simplified Version</h3>
          <p className="text-yellow-800 text-sm">
            This is a simplified version without facilities and achievements sections.
            Use the Reset Page button on the full version to fix database issues.
          </p>
        </div>
      </div>
    </div>
  )
}
