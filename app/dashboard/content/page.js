'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { 
  FaArrowLeft, FaSave, FaPlus, FaTrash, FaEdit, FaTimes, FaCheck,
  FaMapMarkerAlt, FaPhone, FaEnvelope, FaCalendar,
  FaGraduationCap, FaTrophy, FaTools
} from 'react-icons/fa'
import axios from 'axios'
import Link from 'next/link'
import schoolsData from '@/data/schools-data.json'

export default function ContentManagementPage() {
  const router = useRouter()
  const [admin, setAdmin] = useState(null)
  const [selectedSchool, setSelectedSchool] = useState('')
  const [content, setContent] = useState(null)
  const [schoolInfo, setSchoolInfo] = useState(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState({ type: '', text: '' })
  
  // Editing states for each section
  const [editingSection, setEditingSection] = useState(null)
  const [editingIndex, setEditingIndex] = useState(null)
  const [tempData, setTempData] = useState(null)
  
  const schools = [
    { value: 'Ballari', label: 'Ballari', id: 'ballari' },
    { value: 'Bhadravati', label: 'Bhadravati', id: 'bhadravati' },
    { value: 'Hubballi', label: 'Hubballi', id: 'hubballi' },
    { value: 'Bagalkot', label: 'Bagalkot', id: 'bagalkot' },
    { value: 'Kalburgi', label: 'Kalburgi', id: 'kalburgi' },
    { value: 'Mangalore', label: 'Mangalore', id: 'mangalore' }
  ]

  useEffect(() => {
    checkAuth()
  }, [])

  useEffect(() => {
    if (admin && selectedSchool) {
      loadContent()
      loadSchoolInfo()
    }
  }, [admin, selectedSchool])

  const checkAuth = () => {
    const adminData = localStorage.getItem('schoolAdmin')
    if (!adminData) {
      router.push('/dashboard/login')
      return
    }
    const parsedAdmin = JSON.parse(adminData)
    setAdmin(parsedAdmin)
    
    if (parsedAdmin.role === 'super_admin') {
      setSelectedSchool('Ballari')
    } else {
      setSelectedSchool(parsedAdmin.school)
    }
  }

  const loadSchoolInfo = () => {
    const schoolId = schools.find(s => s.value === selectedSchool)?.id
    const schoolData = schoolsData.schools.find(s => s.id === schoolId)
    setSchoolInfo(schoolData)
  }

  const loadContent = async () => {
    try {
      setLoading(true)
      const token = localStorage.getItem('dashboardToken')
      
      const response = await axios.get(`/api/dashboard/content?school=${selectedSchool}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      
      const dbContent = response.data.content
      const schoolId = schools.find(s => s.value === selectedSchool)?.id
      const jsonSchool = schoolsData.schools.find(s => s.id === schoolId)
      
      // Merge database content with JSON data
      setContent({
        ...dbContent,
        courses: dbContent.courses?.length > 0 ? dbContent.courses : jsonSchool?.courses || [],
        facilities: Array.isArray(dbContent.facilities) && dbContent.facilities.length > 0 
          ? dbContent.facilities 
          : (jsonSchool?.facilities?.map(f => typeof f === 'string' ? { name: f, description: '' } : f) || []),
        achievements: Array.isArray(dbContent.achievements) && dbContent.achievements.length > 0 
          ? dbContent.achievements 
          : (jsonSchool?.achievements?.map(a => typeof a === 'string' ? { title: a, description: '', year: new Date().getFullYear() } : a) || []),
        contactInfo: {
          email: dbContent.contactInfo?.email || jsonSchool?.contact?.email || '',
          phone: dbContent.contactInfo?.phone || jsonSchool?.contact?.phone || '',
          address: dbContent.contactInfo?.address || jsonSchool?.contact?.address || '',
          website: dbContent.contactInfo?.website || ''
        }
      })
    } catch (error) {
      console.error('Error loading content:', error)
      setMessage({ type: 'error', text: 'Failed to load content' })
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    try {
      setSaving(true)
      setMessage({ type: '', text: '' })
      
      const token = localStorage.getItem('dashboardToken')
      
      const response = await axios.put('/api/dashboard/content', {
        school: selectedSchool,
        ...content
      }, {
        headers: { Authorization: `Bearer ${token}` }
      })
      
      setMessage({ type: 'success', text: '✅ Content saved successfully! Changes are now live on the school page.' })
      setContent(response.data.content)
      
      window.scrollTo({ top: 0, behavior: 'smooth' })
      setTimeout(() => setMessage({ type: '', text: '' }), 5000)
    } catch (error) {
      console.error('Error saving content:', error)
      setMessage({ 
        type: 'error', 
        text: `❌ ${error.response?.data?.error || 'Failed to save content'}` 
      })
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } finally {
      setSaving(false)
    }
  }

  // Edit handlers
  const startEdit = (section, index = null) => {
    setEditingSection(section)
    setEditingIndex(index)
    
    if (section === 'contact') {
      setTempData({ ...content.contactInfo })
    } else if (index !== null) {
      const item = content[section][index]
      // Normalize data: convert strings to objects
      if (section === 'facilities') {
        setTempData(typeof item === 'string' ? { name: item, description: '' } : { ...item })
      } else if (section === 'achievements') {
        setTempData(typeof item === 'string' ? { title: item, description: '', year: new Date().getFullYear() } : { ...item })
      } else {
        setTempData({ ...item })
      }
    }
  }

  const cancelEdit = () => {
    setEditingSection(null)
    setEditingIndex(null)
    setTempData(null)
  }

  const saveEdit = () => {
    if (editingSection === 'contact') {
      setContent({ ...content, contactInfo: tempData })
    } else if (editingIndex !== null) {
      const newArray = [...content[editingSection]]
      newArray[editingIndex] = tempData
      setContent({ ...content, [editingSection]: newArray })
    }
    cancelEdit()
  }

  const addItem = (section) => {
    const newItem = section === 'courses' 
      ? { name: '', duration: '', description: '' }
      : section === 'facilities'
      ? { name: '', description: '' }
      : { title: '', description: '', year: new Date().getFullYear() }
    
    setContent({ ...content, [section]: [...content[section], newItem] })
  }

  const removeItem = (section, index) => {
    const newArray = content[section].filter((_, i) => i !== index)
    setContent({ ...content, [section]: newArray })
  }

  if (loading || !admin || !content || !schoolInfo) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 font-semibold">Loading content...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Fixed Header */}
      <div className="bg-white shadow-md sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center space-x-4">
              <Link href="/dashboard" className="text-primary-600 hover:text-primary-700">
                <FaArrowLeft className="text-xl" />
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">✏️ Edit School Content</h1>
                <p className="text-sm text-gray-600">Click the edit buttons to modify content - changes appear instantly on the school page</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              {admin.role === 'super_admin' && (
                <select
                  value={selectedSchool}
                  onChange={(e) => setSelectedSchool(e.target.value)}
                  className="px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 font-semibold"
                >
                  {schools.map(school => (
                    <option key={school.value} value={school.value}>{school.label}</option>
                  ))}
                </select>
              )}
              
              <button
                onClick={handleSave}
                disabled={saving}
                className="btn-primary disabled:opacity-50 px-6 py-2 font-semibold shadow-lg"
              >
                <FaSave className="inline mr-2" />
                {saving ? 'Saving...' : 'Save All Changes'}
              </button>
            </div>
          </div>
          
          {message.text && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`mt-3 p-3 rounded-lg ${
                message.type === 'success' 
                  ? 'bg-green-100 text-green-800 border border-green-300' 
                  : 'bg-red-100 text-red-800 border border-red-300'
              }`}
            >
              {message.text}
            </motion.div>
          )}
        </div>
      </div>

      {/* School Page Replica with Edit Buttons */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-800 text-white py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="text-5xl font-bold mb-4">{schoolInfo.name}</h1>
            <div className="flex items-center space-x-6 text-lg">
              <span className="flex items-center">
                <FaMapMarkerAlt className="mr-2" />
                {schoolInfo.location}
              </span>
              <span className="flex items-center">
                <FaCalendar className="mr-2" />
                Established {schoolInfo.established}
              </span>
              <span className="flex items-center">
                <FaGraduationCap className="mr-2" />
                {schoolInfo.students} Students
              </span>
            </div>
          </motion.div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Courses Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-xl shadow-lg p-8 relative"
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-3xl font-bold text-gray-900">
                  <FaGraduationCap className="inline mr-3 text-primary-600" />
                  Courses Offered
                </h2>
                <button
                  onClick={() => addItem('courses')}
                  className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-semibold"
                >
                  <FaPlus className="inline mr-1" /> Add Course
                </button>
              </div>
              
              <div className="space-y-6">
                {Array.isArray(content.courses) && content.courses.map((course, index) => (
                  <div key={index} className="relative">
                    {editingSection === 'courses' && editingIndex === index ? (
                      // Edit Mode
                      <div className="border-4 border-blue-500 rounded-lg p-6 bg-blue-50">
                        <div className="flex justify-between items-center mb-4">
                          <h3 className="text-lg font-bold text-blue-900">Editing Course {index + 1}</h3>
                          <div className="space-x-2">
                            <button
                              onClick={saveEdit}
                              className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded text-sm"
                            >
                              <FaCheck className="inline mr-1" /> Save
                            </button>
                            <button
                              onClick={cancelEdit}
                              className="bg-gray-500 hover:bg-gray-600 text-white px-3 py-1 rounded text-sm"
                            >
                              <FaTimes className="inline mr-1" /> Cancel
                            </button>
                          </div>
                        </div>
                        
                        <div className="space-y-3">
                          <input
                            type="text"
                            value={tempData.name}
                            onChange={(e) => setTempData({ ...tempData, name: e.target.value })}
                            className="w-full px-3 py-2 border-2 border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                            placeholder="Course Name"
                          />
                          <input
                            type="text"
                            value={tempData.duration}
                            onChange={(e) => setTempData({ ...tempData, duration: e.target.value })}
                            className="w-full px-3 py-2 border-2 border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                            placeholder="Duration"
                          />
                          <textarea
                            value={tempData.description}
                            onChange={(e) => setTempData({ ...tempData, description: e.target.value })}
                            rows={3}
                            className="w-full px-3 py-2 border-2 border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                            placeholder="Description"
                          />
                        </div>
                      </div>
                    ) : (
                      // View Mode
                      <div className="border-l-4 border-primary-500 pl-6 py-4 relative group">
                        <div className="absolute -right-2 top-2 opacity-0 group-hover:opacity-100 transition-opacity space-x-2">
                          <button
                            onClick={() => startEdit('courses', index)}
                            className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm"
                          >
                            <FaEdit className="inline mr-1" /> Edit
                          </button>
                          <button
                            onClick={() => removeItem('courses', index)}
                            className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm"
                          >
                            <FaTrash className="inline mr-1" /> Delete
                          </button>
                        </div>
                        
                        <h3 className="text-xl font-bold text-gray-900">{course.name}</h3>
                        <p className="text-gray-600 mt-2">{course.description}</p>
                        <p className="text-sm text-primary-600 mt-2">
                          Duration: {course.duration}
                        </p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Facilities Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-xl shadow-lg p-8"
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-3xl font-bold text-gray-900">
                  <FaTools className="inline mr-3 text-primary-600" />
                  Facilities
                </h2>
                <button
                  onClick={() => addItem('facilities')}
                  className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-semibold"
                >
                  <FaPlus className="inline mr-1" /> Add Facility
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Array.isArray(content.facilities) && content.facilities.map((facility, index) => (
                  <div key={index}>
                    {editingSection === 'facilities' && editingIndex === index ? (
                      // Edit Mode
                      <div className="border-4 border-blue-500 rounded-lg p-4 bg-blue-50">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm font-bold text-blue-900">Editing</span>
                          <div className="space-x-1">
                            <button
                              onClick={saveEdit}
                              className="bg-green-500 hover:bg-green-600 text-white px-2 py-1 rounded text-xs"
                            >
                              <FaCheck />
                            </button>
                            <button
                              onClick={cancelEdit}
                              className="bg-gray-500 hover:bg-gray-600 text-white px-2 py-1 rounded text-xs"
                            >
                              <FaTimes />
                            </button>
                          </div>
                        </div>
                        <input
                          type="text"
                          value={tempData.name}
                          onChange={(e) => setTempData({ ...tempData, name: e.target.value })}
                          className="w-full px-3 py-2 border-2 border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                          placeholder="Facility name"
                        />
                      </div>
                    ) : (
                      // View Mode
                      <div className="flex items-center justify-between space-x-3 p-4 bg-gray-50 rounded-lg group">
                        <div className="flex items-center space-x-3 flex-1">
                          <div className="w-2 h-2 bg-primary-600 rounded-full"></div>
                          <span className="text-gray-700">
                            {typeof facility === 'string' ? facility : (facility?.name || 'Unnamed Facility')}
                          </span>
                        </div>
                        <div className="opacity-0 group-hover:opacity-100 transition-opacity space-x-1">
                          <button
                            onClick={() => startEdit('facilities', index)}
                            className="bg-blue-500 hover:bg-blue-600 text-white px-2 py-1 rounded text-xs"
                          >
                            <FaEdit />
                          </button>
                          <button
                            onClick={() => removeItem('facilities', index)}
                            className="bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded text-xs"
                          >
                            <FaTrash />
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Achievements Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white rounded-xl shadow-lg p-8"
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-3xl font-bold text-gray-900">
                  <FaTrophy className="inline mr-3 text-yellow-500" />
                  Achievements
                </h2>
                <button
                  onClick={() => addItem('achievements')}
                  className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-semibold"
                >
                  <FaPlus className="inline mr-1" /> Add Achievement
                </button>
              </div>
              
              <div className="space-y-4">
                {Array.isArray(content.achievements) && content.achievements.map((achievement, index) => (
                  <div key={index}>
                    {editingSection === 'achievements' && editingIndex === index ? (
                      // Edit Mode
                      <div className="border-4 border-blue-500 rounded-lg p-4 bg-blue-50">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm font-bold text-blue-900">Editing Achievement</span>
                          <div className="space-x-1">
                            <button
                              onClick={saveEdit}
                              className="bg-green-500 hover:bg-green-600 text-white px-2 py-1 rounded text-xs"
                            >
                              <FaCheck className="inline mr-1" /> Save
                            </button>
                            <button
                              onClick={cancelEdit}
                              className="bg-gray-500 hover:bg-gray-600 text-white px-2 py-1 rounded text-xs"
                            >
                              <FaTimes className="inline mr-1" /> Cancel
                            </button>
                          </div>
                        </div>
                        <input
                          type="text"
                          value={tempData.title}
                          onChange={(e) => setTempData({ ...tempData, title: e.target.value })}
                          className="w-full px-3 py-2 border-2 border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                          placeholder="Achievement title"
                        />
                      </div>
                    ) : (
                      // View Mode
                      <div className="flex items-start justify-between space-x-4 p-4 bg-yellow-50 rounded-lg group">
                        <div className="flex items-start space-x-4 flex-1">
                          <FaTrophy className="text-yellow-500 text-xl mt-1" />
                          <span className="text-gray-700">
                            {typeof achievement === 'string' ? achievement : (achievement?.title || 'Unnamed Achievement')}
                          </span>
                        </div>
                        <div className="opacity-0 group-hover:opacity-100 transition-opacity space-x-1">
                          <button
                            onClick={() => startEdit('achievements', index)}
                            className="bg-blue-500 hover:bg-blue-600 text-white px-2 py-1 rounded text-xs"
                          >
                            <FaEdit />
                          </button>
                          <button
                            onClick={() => removeItem('achievements', index)}
                            className="bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded text-xs"
                          >
                            <FaTrash />
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Sidebar - Contact Information */}
          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white rounded-xl shadow-lg p-6 sticky top-24"
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-gray-900">Contact Information</h3>
                {editingSection !== 'contact' && (
                  <button
                    onClick={() => startEdit('contact')}
                    className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm"
                  >
                    <FaEdit className="inline mr-1" /> Edit
                  </button>
                )}
              </div>
              
              {editingSection === 'contact' ? (
                // Edit Mode
                <div className="border-4 border-blue-500 rounded-lg p-4 bg-blue-50 space-y-4">
                  <div className="flex justify-end space-x-2 mb-3">
                    <button
                      onClick={saveEdit}
                      className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded text-sm"
                    >
                      <FaCheck className="inline mr-1" /> Save
                    </button>
                    <button
                      onClick={cancelEdit}
                      className="bg-gray-500 hover:bg-gray-600 text-white px-3 py-1 rounded text-sm"
                    >
                      <FaTimes className="inline mr-1" /> Cancel
                    </button>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Address</label>
                    <textarea
                      value={tempData.address}
                      onChange={(e) => setTempData({ ...tempData, address: e.target.value })}
                      rows={2}
                      className="w-full px-3 py-2 border-2 border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Phone</label>
                    <input
                      type="text"
                      value={tempData.phone}
                      onChange={(e) => setTempData({ ...tempData, phone: e.target.value })}
                      className="w-full px-3 py-2 border-2 border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Email</label>
                    <input
                      type="email"
                      value={tempData.email}
                      onChange={(e) => setTempData({ ...tempData, email: e.target.value })}
                      className="w-full px-3 py-2 border-2 border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              ) : (
                // View Mode
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <FaMapMarkerAlt className="text-primary-600 text-xl mt-1" />
                    <div>
                      <div className="font-semibold text-gray-900">Address</div>
                      <div className="text-gray-600 text-sm">{content.contactInfo?.address}</div>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <FaPhone className="text-primary-600 text-xl mt-1" />
                    <div>
                      <div className="font-semibold text-gray-900">Phone</div>
                      <div className="text-gray-600 text-sm">{content.contactInfo?.phone}</div>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <FaEnvelope className="text-primary-600 text-xl mt-1" />
                    <div>
                      <div className="font-semibold text-gray-900">Email</div>
                      <div className="text-gray-600 text-sm">{content.contactInfo?.email}</div>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
}
