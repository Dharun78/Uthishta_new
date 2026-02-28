'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { FaCalendarAlt, FaClock, FaMapMarkerAlt, FaUsers, FaEnvelope } from 'react-icons/fa'
import axios from 'axios'

export default function CreateEvent() {
  const router = useRouter()
  const [admin, setAdmin] = useState(null)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    eventType: 'workshop',
    date: '',
    time: '',
    venue: '',
    school: '',
    targetAudience: ['all'],
    registrationRequired: false,
    registrationLink: '',
    maxParticipants: '',
    sendEmailNotification: true
  })
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  const schools = [
    { value: 'Ballari', label: 'Ballari' },
    { value: 'Bhadravati', label: 'Bhadravati' },
    { value: 'Hubballi', label: 'Hubballi' },
    { value: 'Bagalkot', label: 'Bagalkot' },
    { value: 'Kalburgi', label: 'Kalburgi' },
    { value: 'Mangalore', label: 'Mangalore' }
  ]

  useEffect(() => {
    const adminData = localStorage.getItem('schoolAdmin')
    if (adminData) {
      const parsedAdmin = JSON.parse(adminData)
      setAdmin(parsedAdmin)
      
      // Auto-set school for school admin
      if (parsedAdmin.role !== 'super_admin') {
        setFormData(prev => ({ ...prev, school: parsedAdmin.school }))
      }
    }
  }, [])

  const eventTypes = [
    { value: 'workshop', label: 'Workshop' },
    { value: 'seminar', label: 'Seminar' },
    { value: 'placement', label: 'Placement Drive' },
    { value: 'cultural', label: 'Cultural Event' },
    { value: 'sports', label: 'Sports Event' },
    { value: 'alumni-meet', label: 'Alumni Meet' },
    { value: 'other', label: 'Other' }
  ]

  const audiences = [
    { value: 'all', label: 'All' },
    { value: 'students', label: 'Students' },
    { value: 'alumni', label: 'Alumni' },
    { value: 'faculty', label: 'Faculty' }
  ]

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const token = localStorage.getItem('dashboardToken')
      const response = await axios.post('/api/dashboard/events', formData, {
        headers: { Authorization: `Bearer ${token}` }
      })

      setSuccess(true)
      
      // If email notification is enabled, trigger AI nudge system
      if (formData.sendEmailNotification) {
        await axios.post(`/api/dashboard/events/${response.data.event._id}/notify`, {}, {
          headers: { Authorization: `Bearer ${token}` }
        })
      }

      setTimeout(() => {
        router.push('/dashboard')
      }, 2000)
    } catch (error) {
      alert('Error creating event: ' + (error.response?.data?.error || error.message))
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    })
  }

  const handleAudienceChange = (value) => {
    if (value === 'all') {
      setFormData({ ...formData, targetAudience: ['all'] })
    } else {
      const newAudience = formData.targetAudience.filter(a => a !== 'all')
      if (newAudience.includes(value)) {
        setFormData({ ...formData, targetAudience: newAudience.filter(a => a !== value) })
      } else {
        setFormData({ ...formData, targetAudience: [...newAudience, value] })
      }
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="mb-6">
            <button
              onClick={() => router.back()}
              className="text-primary-600 hover:text-primary-700 font-semibold"
            >
              ← Back to Dashboard
            </button>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Create New Event</h1>
            <p className="text-gray-600 mb-8">Fill in the details to create an event and notify alumni</p>

            {success && (
              <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-6">
                ✅ Event created successfully! {formData.sendEmailNotification && 'AI Nudge System is sending notifications...'}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Event Title */}
              <div>
                <label className="block text-gray-700 font-semibold mb-2">
                  Event Title *
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="e.g., Annual Alumni Meet 2026"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-gray-700 font-semibold mb-2">
                  Description *
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  required
                  rows="4"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="Describe the event..."
                ></textarea>
              </div>

              {/* Event Type */}
              <div>
                <label className="block text-gray-700 font-semibold mb-2">
                  Event Type *
                </label>
                <select
                  name="eventType"
                  value={formData.eventType}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  {eventTypes.map(type => (
                    <option key={type.value} value={type.value}>{type.label}</option>
                  ))}
                </select>
              </div>

              {/* School Selection */}
              <div>
                <label className="block text-gray-700 font-semibold mb-2">
                  School *
                </label>
                {admin?.role === 'super_admin' ? (
                  <select
                    name="school"
                    value={formData.school}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  >
                    <option value="">Select School</option>
                    {schools.map(school => (
                      <option key={school.value} value={school.value}>{school.label}</option>
                    ))}
                  </select>
                ) : (
                  <input
                    type="text"
                    value={formData.school}
                    disabled
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-100 text-gray-600"
                  />
                )}
              </div>

              {/* Date and Time */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">
                    <FaCalendarAlt className="inline mr-2" />
                    Date *
                  </label>
                  <input
                    type="date"
                    name="date"
                    value={formData.date}
                    onChange={handleChange}
                    required
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-semibold mb-2">
                    <FaClock className="inline mr-2" />
                    Time *
                  </label>
                  <input
                    type="time"
                    name="time"
                    value={formData.time}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>
              </div>

              {/* Venue */}
              <div>
                <label className="block text-gray-700 font-semibold mb-2">
                  <FaMapMarkerAlt className="inline mr-2" />
                  Venue *
                </label>
                <input
                  type="text"
                  name="venue"
                  value={formData.venue}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="e.g., School Auditorium"
                />
              </div>

              {/* Target Audience */}
              <div>
                <label className="block text-gray-700 font-semibold mb-2">
                  <FaUsers className="inline mr-2" />
                  Target Audience *
                </label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {audiences.map(audience => (
                    <label key={audience.value} className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.targetAudience.includes(audience.value)}
                        onChange={() => handleAudienceChange(audience.value)}
                        className="w-5 h-5 text-primary-600 rounded focus:ring-primary-500"
                      />
                      <span className="text-gray-700">{audience.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Registration */}
              <div className="border border-gray-200 rounded-lg p-4">
                <label className="flex items-center space-x-2 cursor-pointer mb-4">
                  <input
                    type="checkbox"
                    name="registrationRequired"
                    checked={formData.registrationRequired}
                    onChange={handleChange}
                    className="w-5 h-5 text-primary-600 rounded focus:ring-primary-500"
                  />
                  <span className="text-gray-700 font-semibold">Registration Required</span>
                </label>

                {formData.registrationRequired && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-gray-700 mb-2">Registration Link</label>
                      <input
                        type="url"
                        name="registrationLink"
                        value={formData.registrationLink}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                        placeholder="https://..."
                      />
                    </div>

                    <div>
                      <label className="block text-gray-700 mb-2">Max Participants (Optional)</label>
                      <input
                        type="number"
                        name="maxParticipants"
                        value={formData.maxParticipants}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                        placeholder="e.g., 100"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Email Notification */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    name="sendEmailNotification"
                    checked={formData.sendEmailNotification}
                    onChange={handleChange}
                    className="w-5 h-5 text-primary-600 rounded focus:ring-primary-500"
                  />
                  <div>
                    <span className="text-gray-900 font-semibold flex items-center">
                      <FaEnvelope className="mr-2" />
                      Send AI-Powered Email Notifications
                    </span>
                    <p className="text-sm text-gray-600 mt-1">
                      AI Nudge System will send personalized emails to all registered alumni
                    </p>
                  </div>
                </label>
              </div>

              {/* Submit Button */}
              <div className="flex space-x-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Creating Event...' : 'Create Event & Publish'}
                </button>
                <button
                  type="button"
                  onClick={() => router.back()}
                  className="px-6 py-3 border border-gray-300 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
