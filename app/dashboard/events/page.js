'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { FaCalendarAlt, FaEdit, FaTrash, FaPlus, FaArrowLeft, FaFilter } from 'react-icons/fa'
import axios from 'axios'
import Link from 'next/link'

export default function EventsPage() {
  const router = useRouter()
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const [admin, setAdmin] = useState(null)
  const [selectedSchool, setSelectedSchool] = useState('All')
  const [editingEvent, setEditingEvent] = useState(null)
  const [editFormData, setEditFormData] = useState({})
  const [message, setMessage] = useState({ type: '', text: '' })
  
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
      loadEvents()
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

  const loadEvents = async () => {
    try {
      const token = localStorage.getItem('dashboardToken')
      const schoolParam = admin?.role === 'super_admin' && selectedSchool !== 'All' 
        ? `?school=${selectedSchool}` 
        : ''
      
      const response = await axios.get(`/api/dashboard/events${schoolParam}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      
      setEvents(response.data.events || [])
    } catch (error) {
      console.error('Error loading events:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (event) => {
    setEditingEvent(event)
    setEditFormData({
      title: event.title,
      description: event.description,
      eventType: event.eventType,
      date: event.date ? event.date.split('T')[0] : '',
      time: event.time,
      venue: event.venue,
      school: event.school
    })
  }

  const handleUpdate = async (e) => {
    e.preventDefault()
    setMessage({ type: '', text: '' })
    
    try {
      const token = localStorage.getItem('dashboardToken')
      await axios.put(`/api/dashboard/events/${editingEvent._id}`, editFormData, {
        headers: { Authorization: `Bearer ${token}` }
      })
      
      setMessage({ type: 'success', text: 'Event updated successfully!' })
      setEditingEvent(null)
      loadEvents()
      
      setTimeout(() => setMessage({ type: '', text: '' }), 3000)
    } catch (error) {
      console.error('Update error:', error)
      setMessage({ 
        type: 'error', 
        text: error.response?.data?.error || 'Failed to update event' 
      })
    }
  }

  const handleDelete = async (eventId) => {
    if (!confirm('Are you sure you want to delete this event? This action cannot be undone.')) {
      return
    }
    
    setMessage({ type: '', text: '' })
    
    try {
      const token = localStorage.getItem('dashboardToken')
      await axios.delete(`/api/dashboard/events/${eventId}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      
      setMessage({ type: 'success', text: 'Event deleted successfully!' })
      loadEvents()
      
      setTimeout(() => setMessage({ type: '', text: '' }), 3000)
    } catch (error) {
      console.error('Delete error:', error)
      setMessage({ 
        type: 'error', 
        text: error.response?.data?.error || 'Failed to delete event' 
      })
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading events...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="mb-6">
          <Link href="/dashboard" className="inline-flex items-center text-primary-600 hover:text-primary-700 mb-4">
            <FaArrowLeft className="mr-2" />
            Back to Dashboard
          </Link>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Event Management</h1>
              <p className="text-gray-600">Manage all school events</p>
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
              <button
                onClick={() => router.push('/dashboard/events/create')}
                className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center space-x-2"
              >
                <FaPlus />
                <span>Create Event</span>
              </button>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          {message.text && (
            <div className={`mb-4 p-3 rounded ${
              message.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
            }`}>
              {message.text}
            </div>
          )}
          
          <div className="mb-4">
            <h2 className="text-xl font-bold text-gray-900">
              {events.length} Events
            </h2>
          </div>

          {events.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <FaCalendarAlt className="text-6xl mx-auto mb-4 opacity-50" />
              <p>No events found</p>
              <button
                onClick={() => router.push('/dashboard/events/create')}
                className="mt-4 btn-primary"
              >
                Create Your First Event
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {events.map((event, index) => (
                <motion.div
                  key={event._id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-bold text-lg text-gray-900">{event.title}</h3>
                        {event.school && (
                          <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-semibold">
                            {event.school}
                          </span>
                        )}
                      </div>
                      <p className="text-gray-600 text-sm mt-1">{event.description}</p>
                      <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                        <span>📅 {new Date(event.date).toLocaleDateString()}</span>
                        <span>🕐 {event.time}</span>
                        <span>📍 {event.venue}</span>
                        <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs">
                          {event.eventType}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2 mt-3">
                    <button
                      onClick={() => router.push(`/dashboard/events/${event._id}`)}
                      className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 text-sm flex items-center space-x-1"
                    >
                      <FaCalendarAlt />
                      <span>View Details</span>
                    </button>
                    <button
                      onClick={() => handleEdit(event)}
                      className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm flex items-center space-x-1"
                    >
                      <FaEdit />
                      <span>Edit</span>
                    </button>
                    <button
                      onClick={() => handleDelete(event._id)}
                      className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 text-sm flex items-center space-x-1"
                    >
                      <FaTrash />
                      <span>Delete</span>
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Edit Event Modal */}
      <AnimatePresence>
        {editingEvent && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            onClick={() => setEditingEvent(null)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-white rounded-xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Edit Event</h2>
              
              <form onSubmit={handleUpdate} className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Event Title *</label>
                  <input
                    type="text"
                    required
                    value={editFormData.title}
                    onChange={(e) => setEditFormData({...editFormData, title: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Description *</label>
                  <textarea
                    required
                    rows={3}
                    value={editFormData.description}
                    onChange={(e) => setEditFormData({...editFormData, description: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Event Type *</label>
                    <select
                      required
                      value={editFormData.eventType}
                      onChange={(e) => setEditFormData({...editFormData, eventType: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    >
                      <option value="workshop">Workshop</option>
                      <option value="seminar">Seminar</option>
                      <option value="placement">Placement Drive</option>
                      <option value="cultural">Cultural Event</option>
                      <option value="sports">Sports Event</option>
                      <option value="alumni-meet">Alumni Meet</option>
                      <option value="other">Other</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">School *</label>
                    {admin?.role === 'super_admin' ? (
                      <select
                        required
                        value={editFormData.school}
                        onChange={(e) => setEditFormData({...editFormData, school: e.target.value})}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                      >
                        {schools.filter(s => s.value !== 'All').map(school => (
                          <option key={school.value} value={school.value}>{school.label}</option>
                        ))}
                      </select>
                    ) : (
                      <input
                        type="text"
                        value={editFormData.school}
                        disabled
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-100 text-gray-600"
                      />
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Date *</label>
                    <input
                      type="date"
                      required
                      value={editFormData.date}
                      onChange={(e) => setEditFormData({...editFormData, date: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Time *</label>
                    <input
                      type="time"
                      required
                      value={editFormData.time}
                      onChange={(e) => setEditFormData({...editFormData, time: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Venue *</label>
                    <input
                      type="text"
                      required
                      value={editFormData.venue}
                      onChange={(e) => setEditFormData({...editFormData, venue: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                  </div>
                </div>

                <div className="flex space-x-3 pt-4">
                  <button type="submit" className="btn-primary flex-1">
                    Update Event
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditingEvent(null)}
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
