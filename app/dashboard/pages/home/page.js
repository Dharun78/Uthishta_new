'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { FaArrowLeft, FaSave, FaEdit, FaTimes, FaCheck, FaGraduationCap, FaUsers, FaAward, FaMapMarkerAlt, FaPlus, FaTrash } from 'react-icons/fa'
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
      // No auth needed for GET requests to pages API
      const response = await axios.get('/api/dashboard/pages?page=home')
      
      console.log('API Response:', response.data)
      
      if (response.data.success && response.data.content?.sections) {
        const sections = response.data.content.sections
        
        console.log('Sections before fix:', sections)
        
        // Ensure facilities and achievements are arrays
        if (sections.facilities && !Array.isArray(sections.facilities)) {
          console.warn('Facilities is not an array, converting:', sections.facilities)
          sections.facilities = []
        }
        if (sections.achievements && !Array.isArray(sections.achievements)) {
          console.warn('Achievements is not an array, converting:', sections.achievements)
          sections.achievements = []
        }
        
        // Initialize if missing
        if (!sections.facilities) {
          sections.facilities = []
        }
        if (!sections.achievements) {
          sections.achievements = []
        }
        
        console.log('Sections after fix:', sections)
        
        setContent(sections)
      } else {
        console.log('No content found, using defaults')
        // Use default content if no data with proper arrays
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
          },
          facilities: [],
          achievements: []
        })
      }
    } catch (error) {
      console.error('Error loading content:', error)
      setMessage({ type: 'error', text: 'Failed to load content' })
      // Set default content on error with proper arrays
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
        },
        facilities: [],
        achievements: []
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
        sections: content
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
    let data = content[section]
    
    // Ensure facilities and achievements are arrays
    if (section === 'facilities' && (!data || !Array.isArray(data))) {
      data = []
    }
    if (section === 'achievements' && (!data || !Array.isArray(data))) {
      data = []
    }
    
    setTempData(JSON.parse(JSON.stringify(data)))
  }

  const saveEdit = () => {
    let dataToSave = tempData
    
    // Final safety check before saving
    if (editingSection === 'facilities' && !Array.isArray(dataToSave)) {
      dataToSave = []
    }
    if (editingSection === 'achievements' && !Array.isArray(dataToSave)) {
      dataToSave = []
    }
    
    setContent({ ...content, [editingSection]: dataToSave })
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
                <h1 className="text-2xl font-bold">✏️ Edit Home Page</h1>
                <p className="text-sm text-gray-600">Hover over sections to see edit buttons</p>
              </div>
            </div>
            <button onClick={handleSave} disabled={saving} className="btn-primary">
              <FaSave className="inline mr-2" />
              {saving ? 'Saving...' : 'Save All Changes'}
            </button>
            {admin?.role === 'super_admin' && (
              <button 
                onClick={async () => {
                  if (confirm('Reset home page to default? This will clear all facilities and achievements.')) {
                    try {
                      const token = localStorage.getItem('dashboardToken')
                      await axios.post('/api/dashboard/pages/reset', { page: 'home' }, {
                        headers: { Authorization: `Bearer ${token}` }
                      })
                      setMessage({ type: 'success', text: '✅ Page reset! Reloading...' })
                      setTimeout(() => window.location.reload(), 1000)
                    } catch (error) {
                      setMessage({ type: 'error', text: '❌ Failed to reset' })
                    }
                  }
                }}
                className="px-4 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                Reset Page
              </button>
            )}
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
        <div className="bg-blue-50 border-l-4 border-blue-500 p-6 rounded">
          <h3 className="font-bold text-blue-900 mb-2">💡 How to Edit</h3>
          <ul className="text-blue-800 text-sm space-y-1">
            <li>• Hover over any section to see the Edit button</li>
            <li>• Click Edit to modify the content</li>
            <li>• Click Save to confirm changes or Cancel to discard</li>
            <li>• Click "Save All Changes" at the top to persist to database</li>
          </ul>
        </div>
      </div>

      {/* Facilities Section */}
      <section className="py-16 bg-gray-50 relative group">
        {editingSection === 'facilities' ? (
          <div className="container mx-auto px-4 border-4 border-blue-500 rounded-lg p-8 bg-white">
            <div className="flex justify-end space-x-2 mb-4">
              <button onClick={saveEdit} className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded">
                <FaCheck className="inline mr-1" /> Save
              </button>
              <button onClick={cancelEdit} className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded">
                <FaTimes className="inline mr-1" /> Cancel
              </button>
            </div>
            <h2 className="text-3xl font-bold text-center mb-8">Facilities</h2>
            <div className="space-y-4">
              {Array.isArray(tempData) && tempData.map((facility, index) => (
                <div key={index} className="border rounded-lg p-4 bg-gray-50">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-semibold">Facility {index + 1}</h4>
                    <button
                      onClick={() => {
                        if (Array.isArray(tempData)) {
                          const newFacilities = tempData.filter((_, i) => i !== index)
                          setTempData(newFacilities)
                        }
                      }}
                      className="text-red-600 hover:text-red-800"
                    >
                      <FaTrash />
                    </button>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold mb-1">Name</label>
                      <input
                        type="text"
                        value={facility?.name || ''}
                        onChange={(e) => {
                          if (Array.isArray(tempData)) {
                            const newFacilities = [...tempData]
                            newFacilities[index].name = e.target.value
                            setTempData(newFacilities)
                          }
                        }}
                        className="w-full px-3 py-2 border rounded"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold mb-1">Description</label>
                      <input
                        type="text"
                        value={facility?.description || ''}
                        onChange={(e) => {
                          if (Array.isArray(tempData)) {
                            const newFacilities = [...tempData]
                            newFacilities[index].description = e.target.value
                            setTempData(newFacilities)
                          }
                        }}
                        className="w-full px-3 py-2 border rounded"
                      />
                    </div>
                  </div>
                </div>
              ))}
              <button
                onClick={() => {
                  if (Array.isArray(tempData)) {
                    setTempData([...tempData, { name: '', description: '' }])
                  }
                }}
                className="w-full py-3 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors"
              >
                <FaPlus className="inline mr-2" /> Add Facility
              </button>
            </div>
          </div>
        ) : (
          <div className="container mx-auto px-4">
            <button
              onClick={() => startEdit('facilities')}
              className="absolute top-4 right-4 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded opacity-0 group-hover:opacity-100 transition-opacity z-10"
            >
              <FaEdit className="inline mr-1" /> Edit Facilities
            </button>
            <h2 className="text-3xl font-bold text-center mb-12">Our Facilities</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {content.facilities && Array.isArray(content.facilities) && content.facilities.map((facility, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white p-6 rounded-lg shadow-lg"
                >
                  <h3 className="text-xl font-bold text-primary-600 mb-2">{facility?.name || 'Facility'}</h3>
                  <p className="text-gray-600">{facility?.description || 'Description'}</p>
                </motion.div>
              ))}
              {(!content.facilities || content.facilities.length === 0) && (
                <div className="col-span-3 text-center text-gray-500 py-8">
                  No facilities added yet. Click Edit to add facilities.
                </div>
              )}
            </div>
          </div>
        )}
      </section>

      {/* Achievements Section */}
      <section className="py-16 bg-white relative group">
        {editingSection === 'achievements' ? (
          <div className="container mx-auto px-4 border-4 border-blue-500 rounded-lg p-8 bg-blue-50">
            <div className="flex justify-end space-x-2 mb-4">
              <button onClick={saveEdit} className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded">
                <FaCheck className="inline mr-1" /> Save
              </button>
              <button onClick={cancelEdit} className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded">
                <FaTimes className="inline mr-1" /> Cancel
              </button>
            </div>
            <h2 className="text-3xl font-bold text-center mb-8">Achievements</h2>
            <div className="space-y-4">
              {Array.isArray(tempData) && tempData.map((achievement, index) => (
                <div key={index} className="border rounded-lg p-4 bg-white">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-semibold">Achievement {index + 1}</h4>
                    <button
                      onClick={() => {
                        if (Array.isArray(tempData)) {
                          const newAchievements = tempData.filter((_, i) => i !== index)
                          setTempData(newAchievements)
                        }
                      }}
                      className="text-red-600 hover:text-red-800"
                    >
                      <FaTrash />
                    </button>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold mb-1">Title</label>
                      <input
                        type="text"
                        value={achievement?.title || ''}
                        onChange={(e) => {
                          if (Array.isArray(tempData)) {
                            const newAchievements = [...tempData]
                            newAchievements[index].title = e.target.value
                            setTempData(newAchievements)
                          }
                        }}
                        className="w-full px-3 py-2 border rounded"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold mb-1">Description</label>
                      <input
                        type="text"
                        value={achievement?.description || ''}
                        onChange={(e) => {
                          if (Array.isArray(tempData)) {
                            const newAchievements = [...tempData]
                            newAchievements[index].description = e.target.value
                            setTempData(newAchievements)
                          }
                        }}
                        className="w-full px-3 py-2 border rounded"
                      />
                    </div>
                  </div>
                </div>
              ))}
              <button
                onClick={() => {
                  if (Array.isArray(tempData)) {
                    setTempData([...tempData, { title: '', description: '' }])
                  }
                }}
                className="w-full py-3 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors"
              >
                <FaPlus className="inline mr-2" /> Add Achievement
              </button>
            </div>
          </div>
        ) : (
          <div className="container mx-auto px-4">
            <button
              onClick={() => startEdit('achievements')}
              className="absolute top-4 right-4 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded opacity-0 group-hover:opacity-100 transition-opacity z-10"
            >
              <FaEdit className="inline mr-1" /> Edit Achievements
            </button>
            <h2 className="text-3xl font-bold text-center mb-12">Our Achievements</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {content.achievements && Array.isArray(content.achievements) && content.achievements.map((achievement, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-gradient-to-r from-primary-50 to-primary-100 p-6 rounded-lg shadow-lg"
                >
                  <FaAward className="text-4xl text-primary-600 mb-4" />
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{achievement?.title || 'Achievement'}</h3>
                  <p className="text-gray-700">{achievement?.description || 'Description'}</p>
                </motion.div>
              ))}
              {(!content.achievements || content.achievements.length === 0) && (
                <div className="col-span-2 text-center text-gray-500 py-8">
                  No achievements added yet. Click Edit to add achievements.
                </div>
              )}
            </div>
          </div>
        )}
      </section>
    </div>
  )
}
