'use client'
import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { motion } from 'framer-motion'
import { 
  FaArrowLeft, FaEdit, FaTrash, FaCalendarAlt, FaClock, 
  FaMapMarkerAlt, FaUsers, FaEnvelope, FaCheckCircle 
} from 'react-icons/fa'
import axios from 'axios'
import Link from 'next/link'

export default function EventDetailsPage() {
  const router = useRouter()
  const params = useParams()
  const [event, setEvent] = useState(null)
  const [loading, setLoading] = useState(true)
  const [admin, setAdmin] = useState(null)
  const [message, setMessage] = useState({ type: '', text: '' })

  useEffect(() => {
    checkAuth()
  }, [])

  useEffect(() => {
    if (admin && params.id) {
      loadEvent()
    }
  }, [admin, params.id])

  const checkAuth = () => {
    const adminData = localStorage.getItem('schoolAdmin')
    if (!adminData) {
      router.push('/dashboard/login')
      return
    }
    setAdmin(JSON.parse(adminData))
  }

  const loadEvent = async () => {
    try {
      const token = localStorage.getItem('dashboardToken')
      const response = await axios.get(`/api/dashboard/events/${params.id}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      setEvent(response.data.event)
    } catch (error) {
      console.error('Error loading event:', error)
      setMessage({ type: 'error', text: 'Failed to load event details' })
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this event? This action cannot be undone.')) {
      return
    }
    
    try {
      const token = localStorage.getItem('dashboardToken')
      await axios.delete(`/api/dashboard/events/${params.id}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      
      setMessage({ type: 'success', text: 'Event deleted successfully!' })
      setTimeout(() => {
        router.push('/dashboard/events')
      }, 1500)
    } catch (error) {
      console.error('Delete error:', error)
      setMessage({ 
        type: 'error', 
        text: error.response?.data?.error || 'Failed to delete event' 
      })
    }
  }

  const handleSendNotification = async () => {
    if (!confirm('Send email notifications to all registered alumni?')) {
      return
    }
    
    try {
      const token = localStorage.getItem('dashboardToken')
      await axios.post(`/api/dashboard/events/${params.id}/notify`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      })
      
      setMessage({ type: 'success', text: 'Notifications sent successfully!' })
    } catch (error) {
      console.error('Notification error:', error)
      setMessage({ 
        type: 'error', 
        text: error.response?.data?.error || 'Failed to send notifications' 
      })
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading event details...</p>
        </div>
      </div>
    )
  }

  if (!event) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Event Not Found</h2>
          <Link href="/dashboard/events" className="text-primary-600 hover:text-primary-700">
            ← Back to Events
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="mb-6">
          <Link href="/dashboard/events" className="inline-flex items-center text-primary-600 hover:text-primary-700 mb-4">
            <FaArrowLeft className="mr-2" />
            Back to Events
          </Link>
        </div>

        {message.text && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`mb-6 p-4 rounded-lg ${
              message.type === 'success' 
                ? 'bg-green-100 text-green-800 border border-green-300' 
                : 'bg-red-100 text-red-800 border border-red-300'
            }`}
          >
            {message.text}
          </motion.div>
        )}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-lg overflow-hidden"
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-primary-600 to-primary-800 text-white p-8">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h1 className="text-3xl font-bold mb-2">{event.title}</h1>
                {event.school && (
                  <span className="inline-block px-3 py-1 bg-white bg-opacity-20 rounded-full text-sm">
                    {event.school}
                  </span>
                )}
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => router.push(`/dashboard/events?edit=${event._id}`)}
                  className="px-4 py-2 bg-white text-primary-600 rounded-lg hover:bg-gray-100 flex items-center space-x-2"
                >
                  <FaEdit />
                  <span>Edit</span>
                </button>
                <button
                  onClick={handleDelete}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 flex items-center space-x-2"
                >
                  <FaTrash />
                  <span>Delete</span>
                </button>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-8">
            {/* Event Type Badge */}
            <div className="mb-6">
              <span className="px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-semibold">
                {event.eventType}
              </span>
            </div>

            {/* Description */}
            <div className="mb-8">
              <h2 className="text-xl font-bold text-gray-900 mb-3">Description</h2>
              <p className="text-gray-700 leading-relaxed">{event.description}</p>
            </div>

            {/* Event Details Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="flex items-start space-x-3">
                <FaCalendarAlt className="text-primary-600 text-xl mt-1" />
                <div>
                  <div className="text-sm text-gray-600">Date</div>
                  <div className="font-semibold text-gray-900">
                    {new Date(event.date).toLocaleDateString('en-US', { 
                      weekday: 'long', 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}
                  </div>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <FaClock className="text-primary-600 text-xl mt-1" />
                <div>
                  <div className="text-sm text-gray-600">Time</div>
                  <div className="font-semibold text-gray-900">{event.time}</div>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <FaMapMarkerAlt className="text-primary-600 text-xl mt-1" />
                <div>
                  <div className="text-sm text-gray-600">Venue</div>
                  <div className="font-semibold text-gray-900">{event.venue}</div>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <FaUsers className="text-primary-600 text-xl mt-1" />
                <div>
                  <div className="text-sm text-gray-600">Target Audience</div>
                  <div className="font-semibold text-gray-900">
                    {event.targetAudience?.join(', ') || 'All'}
                  </div>
                </div>
              </div>
            </div>

            {/* Registration Info */}
            {event.registrationRequired && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
                <h3 className="text-lg font-bold text-gray-900 mb-3 flex items-center">
                  <FaCheckCircle className="text-blue-600 mr-2" />
                  Registration Required
                </h3>
                {event.registrationLink && (
                  <div className="mb-2">
                    <span className="text-sm text-gray-600">Registration Link: </span>
                    <a 
                      href={event.registrationLink} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-primary-600 hover:text-primary-700 underline"
                    >
                      {event.registrationLink}
                    </a>
                  </div>
                )}
                {event.maxParticipants && (
                  <div>
                    <span className="text-sm text-gray-600">Max Participants: </span>
                    <span className="font-semibold text-gray-900">{event.maxParticipants}</span>
                  </div>
                )}
              </div>
            )}

            {/* Send Notification Button */}
            <div className="border-t pt-6">
              <button
                onClick={handleSendNotification}
                className="w-full md:w-auto px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center justify-center space-x-2"
              >
                <FaEnvelope />
                <span>Send Email Notifications to Alumni</span>
              </button>
              <p className="text-sm text-gray-600 mt-2">
                AI Nudge System will send personalized emails to all registered alumni
              </p>
            </div>

            {/* Metadata */}
            <div className="border-t mt-8 pt-6">
              <div className="text-sm text-gray-600">
                <div className="mb-1">
                  <span className="font-semibold">Created by:</span> {event.createdBy || 'Admin'}
                </div>
                <div>
                  <span className="font-semibold">Created on:</span>{' '}
                  {new Date(event.createdAt).toLocaleDateString('en-US', { 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
