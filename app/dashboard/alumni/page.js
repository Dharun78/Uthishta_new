'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  FaUsers, FaGraduationCap, FaBriefcase, FaFilter,
  FaArrowLeft, FaSearch, FaDownload, FaChartBar, FaEdit, FaTrash
} from 'react-icons/fa'
import axios from 'axios'
import Link from 'next/link'

export default function AlumniManagementPage() {
  const router = useRouter()
  const [admin, setAdmin] = useState(null)
  const [selectedSchool, setSelectedSchool] = useState('All')
  const [alumni, setAlumni] = useState([])
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [showAlumniForm, setShowAlumniForm] = useState(false)
  const [editingAlumni, setEditingAlumni] = useState(null)
  const [alumniFormData, setAlumniFormData] = useState({
    name: '',
    email: '',
    phone: '',
    graduationYear: new Date().getFullYear(),
    currentOccupation: '',
    company: '',
    city: '',
    linkedIn: '',
    notes: ''
  })
  const [formMessage, setFormMessage] = useState({ type: '', text: '' })
  
  const schools = [
    { value: 'All', label: 'All Schools' },
    { value: 'Ballari', label: 'Ballari' },
    { value: 'Bhadravati', label: 'Bhadravati' },
    { value: 'Hubballi', label: 'Hubballi' },
    { value: 'Bagalkot', label: 'Bagalkot' },
    { value: 'Kalburgi', label: 'Kalburgi' },
    { value: 'Mangalore', label: 'Mangalore' }
  ]

  useEffect(() => {
    checkAuth()
  }, [])

  useEffect(() => {
    if (admin) {
      loadAlumniData()
    }
  }, [admin, selectedSchool])

  const checkAuth = () => {
    const adminData = localStorage.getItem('schoolAdmin')
    if (!adminData) {
      router.push('/dashboard/login')
      return
    }
    setAdmin(JSON.parse(adminData))
  }

  const loadAlumniData = async () => {
    try {
      const token = localStorage.getItem('dashboardToken')
      
      const schoolParam = admin?.role === 'super_admin' && selectedSchool !== 'All' 
        ? `?school=${selectedSchool}` 
        : ''
      
      const response = await axios.get(`/api/dashboard/alumni${schoolParam}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      
      setAlumni(response.data.alumni)
      setStats(response.data.stats)
    } catch (error) {
      console.error('Error loading alumni data:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredAlumni = alumni.filter(a => 
    a.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    a.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    a.company.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleExport = () => {
    // Convert alumni data to CSV
    const headers = ['Name', 'Email', 'Phone', 'School', 'Graduation Year', 'Occupation', 'Company', 'City', 'Registered Date']
    const csvData = filteredAlumni.map(a => [
      a.name,
      a.email,
      a.phone,
      a.school,
      a.graduationYear,
      a.currentOccupation || '',
      a.company || '',
      a.city || '',
      new Date(a.registeredAt).toLocaleDateString()
    ])
    
    const csvContent = [
      headers.join(','),
      ...csvData.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n')
    
    // Create download link
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    const url = URL.createObjectURL(blob)
    link.setAttribute('href', url)
    link.setAttribute('download', `alumni_${selectedSchool}_${new Date().toISOString().split('T')[0]}.csv`)
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const handleAlumniSubmit = async (e) => {
    e.preventDefault()
    setFormMessage({ type: '', text: '' })
    
    try {
      const token = localStorage.getItem('dashboardToken')
      const adminData = JSON.parse(localStorage.getItem('schoolAdmin'))
      
      if (editingAlumni) {
        // Update existing alumni
        await axios.put(`/api/dashboard/alumni/${editingAlumni._id}`, alumniFormData, {
          headers: { Authorization: `Bearer ${token}` }
        })
        setFormMessage({ type: 'success', text: 'Alumni updated successfully!' })
      } else {
        // Add new alumni
        await axios.post('/api/dashboard/alumni/manual', {
          ...alumniFormData,
          school: admin.role === 'super_admin' ? selectedSchool : adminData.school
        }, {
          headers: { Authorization: `Bearer ${token}` }
        })
        setFormMessage({ type: 'success', text: 'Alumni added successfully!' })
      }
      
      setShowAlumniForm(false)
      setEditingAlumni(null)
      setAlumniFormData({
        name: '',
        email: '',
        phone: '',
        graduationYear: new Date().getFullYear(),
        currentOccupation: '',
        company: '',
        city: '',
        linkedIn: '',
        notes: ''
      })
      
      // Reload alumni data
      loadAlumniData()
      
      setTimeout(() => setFormMessage({ type: '', text: '' }), 3000)
    } catch (error) {
      setFormMessage({ type: 'error', text: 'Failed to save alumni. Please try again.' })
    }
  }

  const handleEditAlumni = (alumnus) => {
    setEditingAlumni(alumnus)
    setAlumniFormData({
      name: alumnus.name,
      email: alumnus.email,
      phone: alumnus.phone,
      graduationYear: alumnus.graduationYear,
      currentOccupation: alumnus.currentOccupation || '',
      company: alumnus.company || '',
      city: alumnus.city || '',
      linkedIn: alumnus.linkedIn || '',
      notes: alumnus.notes || ''
    })
    setShowAlumniForm(true)
  }

  const handleDeleteAlumni = async (alumniId) => {
    if (!confirm('Are you sure you want to delete this alumni? This action cannot be undone.')) {
      return
    }
    
    setFormMessage({ type: '', text: '' })
    
    try {
      const token = localStorage.getItem('dashboardToken')
      await axios.delete(`/api/dashboard/alumni/${alumniId}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      
      setFormMessage({ type: 'success', text: 'Alumni deleted successfully!' })
      loadAlumniData()
      
      setTimeout(() => setFormMessage({ type: '', text: '' }), 3000)
    } catch (error) {
      console.error('Delete error:', error)
      setFormMessage({ 
        type: 'error', 
        text: error.response?.data?.error || 'Failed to delete alumni' 
      })
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading alumni data...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <Link href="/dashboard" className="inline-flex items-center text-primary-600 hover:text-primary-700 mb-4">
              <FaArrowLeft className="mr-2" />
              Back to Dashboard
            </Link>
            <h1 className="text-3xl font-bold text-gray-900">
              <FaUsers className="inline mr-3 text-primary-600" />
              Alumni Management
            </h1>
            <p className="text-gray-600">
              View and manage registered alumni
            </p>
          </div>
          <div className="flex items-center space-x-4">
            {admin?.role === 'super_admin' && (
              <div className="flex items-center space-x-2">
                <FaFilter className="text-gray-600" />
                <select
                  value={selectedSchool}
                  onChange={(e) => setSelectedSchool(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  {schools.map(school => (
                    <option key={school.value} value={school.value}>{school.label}</option>
                  ))}
                </select>
              </div>
            )}
            {admin && (
              <div className="text-right">
                <div className="text-sm text-gray-600">Logged in as</div>
                <div className="font-semibold text-gray-900">{admin.fullName}</div>
                <div className="text-xs text-gray-500">{admin.role === 'super_admin' ? 'Super Admin' : 'School Admin'}</div>
              </div>
            )}
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg p-6 text-white"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm">Total Alumni</p>
                <p className="text-3xl font-bold mt-2">{stats?.total || 0}</p>
              </div>
              <FaUsers className="text-4xl text-blue-200" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl shadow-lg p-6 text-white"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100 text-sm">Graduation Years</p>
                <p className="text-3xl font-bold mt-2">{Object.keys(stats?.byYear || {}).length}</p>
              </div>
              <FaGraduationCap className="text-4xl text-green-200" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl shadow-lg p-6 text-white"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100 text-sm">Top Companies</p>
                <p className="text-3xl font-bold mt-2">{stats?.topCompanies?.length || 0}</p>
              </div>
              <FaBriefcase className="text-4xl text-purple-200" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl shadow-lg p-6 text-white"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-orange-100 text-sm">Schools</p>
                <p className="text-3xl font-bold mt-2">
                  {admin?.role === 'super_admin' && selectedSchool === 'All' 
                    ? Object.keys(stats?.bySchool || {}).length 
                    : 1}
                </p>
              </div>
              <FaChartBar className="text-4xl text-orange-200" />
            </div>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Search and Actions */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              {formMessage.text && (
                <div className={`mb-4 p-3 rounded ${
                  formMessage.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                }`}>
                  {formMessage.text}
                </div>
              )}
              
              <div className="flex items-center space-x-4">
                <div className="flex-1 relative">
                  <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search alumni by name, email, or company..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>
                <button 
                  onClick={() => setShowAlumniForm(true)}
                  className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center space-x-2 whitespace-nowrap"
                >
                  <span>+ Add Alumni</span>
                </button>
                <button 
                  onClick={handleExport}
                  className="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 flex items-center space-x-2"
                >
                  <FaDownload />
                  <span>Export CSV</span>
                </button>
              </div>
            </div>

            {/* Alumni List */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                Alumni Directory ({filteredAlumni.length})
              </h2>
              <div className="space-y-3">
                {filteredAlumni.length === 0 ? (
                  <div className="text-center py-12 text-gray-500">
                    <FaUsers className="text-6xl mx-auto mb-4 opacity-50" />
                    <p>No alumni found</p>
                  </div>
                ) : (
                  filteredAlumni.map((alumnus, index) => (
                    <motion.div
                      key={alumnus._id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="font-semibold text-gray-900 text-lg">
                            {alumnus.name}
                          </div>
                          <div className="text-sm text-gray-600 mt-1">
                            {alumnus.email} • {alumnus.phone}
                          </div>
                          <div className="flex items-center space-x-4 mt-2 text-sm">
                            <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded">
                              GJTS {alumnus.school}
                            </span>
                            <span className="text-gray-600">
                              Class of {alumnus.graduationYear}
                            </span>
                          </div>
                          {alumnus.currentOccupation && (
                            <div className="mt-2 text-sm text-gray-700">
                              <FaBriefcase className="inline mr-1" />
                              {alumnus.currentOccupation}
                              {alumnus.company && ` at ${alumnus.company}`}
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center space-x-2 mt-3">
                        <button
                          onClick={() => handleEditAlumni(alumnus)}
                          className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm flex items-center space-x-1"
                        >
                          <FaEdit />
                          <span>Edit</span>
                        </button>
                        <button
                          onClick={() => handleDeleteAlumni(alumnus._id)}
                          className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 text-sm flex items-center space-x-1"
                        >
                          <FaTrash />
                          <span>Delete</span>
                        </button>
                      </div>
                    </motion.div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* By School (Super Admin only) */}
            {admin?.role === 'super_admin' && selectedSchool === 'All' && stats?.bySchool && (
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">By School</h2>
                <div className="space-y-3">
                  {Object.entries(stats.bySchool)
                    .sort((a, b) => b[1] - a[1])
                    .map(([school, count]) => (
                      <div key={school} className="flex justify-between items-center">
                        <span className="text-gray-700">{school}</span>
                        <span className="font-semibold text-gray-900">{count}</span>
                      </div>
                    ))}
                </div>
              </div>
            )}

            {/* Top Companies */}
            {stats?.topCompanies && stats.topCompanies.length > 0 && (
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Top Companies</h2>
                <div className="space-y-3">
                  {stats.topCompanies.map((item, index) => (
                    <div key={index} className="flex justify-between items-center">
                      <span className="text-gray-700 text-sm">{item.company}</span>
                      <span className="font-semibold text-gray-900">{item.count}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* By Graduation Year */}
            {stats?.byYear && (
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">By Graduation Year</h2>
                <div className="space-y-2">
                  {Object.entries(stats.byYear)
                    .sort((a, b) => b[0] - a[0])
                    .slice(0, 10)
                    .map(([year, count]) => (
                      <div key={year} className="flex justify-between items-center">
                        <span className="text-gray-700">{year}</span>
                        <span className="font-semibold text-gray-900">{count}</span>
                      </div>
                    ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Add Alumni Modal */}
      <AnimatePresence>
        {showAlumniForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            onClick={() => setShowAlumniForm(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-white rounded-xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                {editingAlumni ? 'Edit Alumni' : 'Add Alumni'}
              </h2>
              
              <form onSubmit={handleAlumniSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Full Name *</label>
                    <input
                      type="text"
                      required
                      value={alumniFormData.name}
                      onChange={(e) => setAlumniFormData({...alumniFormData, name: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                      placeholder="John Doe"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Email *</label>
                    <input
                      type="email"
                      required
                      value={alumniFormData.email}
                      onChange={(e) => setAlumniFormData({...alumniFormData, email: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                      placeholder="john@example.com"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Phone *</label>
                    <input
                      type="tel"
                      required
                      value={alumniFormData.phone}
                      onChange={(e) => setAlumniFormData({...alumniFormData, phone: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                      placeholder="+91 9876543210"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Graduation Year *</label>
                    <input
                      type="number"
                      required
                      min="2000"
                      max={new Date().getFullYear() + 10}
                      value={alumniFormData.graduationYear}
                      onChange={(e) => setAlumniFormData({...alumniFormData, graduationYear: parseInt(e.target.value)})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Current Occupation</label>
                    <input
                      type="text"
                      value={alumniFormData.currentOccupation}
                      onChange={(e) => setAlumniFormData({...alumniFormData, currentOccupation: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                      placeholder="Software Engineer"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Company</label>
                    <input
                      type="text"
                      value={alumniFormData.company}
                      onChange={(e) => setAlumniFormData({...alumniFormData, company: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                      placeholder="Quest Global"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">City</label>
                    <input
                      type="text"
                      value={alumniFormData.city}
                      onChange={(e) => setAlumniFormData({...alumniFormData, city: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                      placeholder="Bangalore"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">LinkedIn Profile</label>
                    <input
                      type="url"
                      value={alumniFormData.linkedIn}
                      onChange={(e) => setAlumniFormData({...alumniFormData, linkedIn: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                      placeholder="https://linkedin.com/in/..."
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Notes</label>
                  <textarea
                    rows={2}
                    value={alumniFormData.notes}
                    onChange={(e) => setAlumniFormData({...alumniFormData, notes: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="Additional information..."
                  />
                </div>

                <div className="flex space-x-3 pt-4">
                  <button type="submit" className="btn-primary flex-1">
                    {editingAlumni ? 'Update Alumni' : 'Add Alumni'}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowAlumniForm(false)
                      setEditingAlumni(null)
                      setAlumniFormData({
                        name: '',
                        email: '',
                        phone: '',
                        graduationYear: new Date().getFullYear(),
                        currentOccupation: '',
                        company: '',
                        city: '',
                        linkedIn: '',
                        notes: ''
                      })
                    }}
                    className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
