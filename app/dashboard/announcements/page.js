'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  FaBullhorn, FaArrowLeft, FaPlus, FaReply, FaArchive, 
  FaExclamationCircle, FaClock, FaCheckCircle, FaFilter, FaUndo, FaTrash
} from 'react-icons/fa'
import axios from 'axios'
import Link from 'next/link'

export default function AnnouncementsPage() {
  const router = useRouter()
  const [admin, setAdmin] = useState(null)
  const [announcements, setAnnouncements] = useState([])
  const [loading, setLoading] = useState(true)
  const [showNewForm, setShowNewForm] = useState(false)
  const [selectedAnnouncement, setSelectedAnnouncement] = useState(null)
  const [replyText, setReplyText] = useState('')
  const [filterStatus, setFilterStatus] = useState('active')
  const [message, setMessage] = useState({ type: '', text: '' })
  
  const [formData, setFormData] = useState({
    title: '',
    message: '',
    recipients: 'all_admins',
    targetSchool: '',
    priority: 'normal'
  })

  const schools = ['Ballari', 'Bhadravati', 'Hubballi', 'Bagalkot', 'Kalburgi', 'Mangalore']

  useEffect(() => {
    checkAuth()
  }, [])

  useEffect(() => {
    if (admin) {
      loadAnnouncements()
    }
  }, [admin, filterStatus])

  const checkAuth = () => {
    const adminData = localStorage.getItem('schoolAdmin')
    if (!adminData) {
      router.push('/dashboard/login')
      return
    }
    setAdmin(JSON.parse(adminData))
  }

  const loadAnnouncements = async () => {
    try {
      const token = localStorage.getItem('dashboardToken')
      const response = await axios.get(`/api/dashboard/announcements?status=${filterStatus}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      setAnnouncements(response.data.announcements || [])
    } catch (error) {
      console.error('Error loading announcements:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setMessage({ type: '', text: '' })
    
    try {
      const token = localStorage.getItem('dashboardToken')
      
      // Prepare data - don't send empty targetSchool
      const submitData = {
        title: formData.title,
        message: formData.message,
        recipients: formData.recipients,
        priority: formData.priority
      }
      
      // Only include targetSchool if it has a value
      if (formData.targetSchool) {
        submitData.targetSchool = formData.targetSchool
      }
      
      await axios.post('/api/dashboard/announcements', submitData, {
        headers: { Authorization: `Bearer ${token}` }
      })
      
      setMessage({ type: 'success', text: 'Announcement sent successfully!' })
      setShowNewForm(false)
      setFormData({
        title: '',
        message: '',
        recipients: 'all_admins',
        targetSchool: '',
        priority: 'normal'
      })
      loadAnnouncements()
      
      setTimeout(() => setMessage({ type: '', text: '' }), 3000)
    } catch (error) {
      setMessage({ 
        type: 'error', 
        text: error.response?.data?.error || 'Failed to send announcement' 
      })
    }
  }

  const markAsRead = async (announcementId) => {
    try {
      const token = localStorage.getItem('dashboardToken')
      await axios.patch(`/api/dashboard/announcements/${announcementId}`, {
        action: 'mark_read'
      }, {
        headers: { Authorization: `Bearer ${token}` }
      })
      loadAnnouncements()
    } catch (error) {
      console.error('Error marking as read:', error)
    }
  }

  const handleReply = async (announcementId) => {
    if (!replyText.trim()) return
    
    try {
      const token = localStorage.getItem('dashboardToken')
      await axios.patch(`/api/dashboard/announcements/${announcementId}`, {
        action: 'reply',
        message: replyText
      }, {
        headers: { Authorization: `Bearer ${token}` }
      })
      
      setReplyText('')
      setMessage({ type: 'success', text: 'Reply sent!' })
      loadAnnouncements()
      
      setTimeout(() => setMessage({ type: '', text: '' }), 2000)
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to send reply' })
    }
  }

  const handleArchive = async (announcementId) => {
    if (!confirm('Archive this announcement?')) return
    
    try {
      const token = localStorage.getItem('dashboardToken')
      await axios.delete(`/api/dashboard/announcements/${announcementId}?action=archive`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      
      setMessage({ type: 'success', text: 'Announcement archived!' })
      setSelectedAnnouncement(null)
      loadAnnouncements()
      
      setTimeout(() => setMessage({ type: '', text: '' }), 2000)
    } catch (error) {
      setMessage({ type: 'error', text: error.response?.data?.error || 'Failed to archive' })
    }
  }

  const handleUnarchive = async (announcementId) => {
    if (!confirm('Unarchive this announcement?')) return
    
    try {
      const token = localStorage.getItem('dashboardToken')
      await axios.delete(`/api/dashboard/announcements/${announcementId}?action=unarchive`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      
      setMessage({ type: 'success', text: 'Announcement unarchived!' })
      setSelectedAnnouncement(null)
      loadAnnouncements()
      
      setTimeout(() => setMessage({ type: '', text: '' }), 2000)
    } catch (error) {
      setMessage({ type: 'error', text: error.response?.data?.error || 'Failed to unarchive' })
    }
  }

  const handlePermanentDelete = async (announcementId) => {
    if (!confirm('⚠️ PERMANENT DELETE: This will permanently delete this announcement from the database. This action cannot be undone. Are you sure?')) {
      return
    }
    
    try {
      const token = localStorage.getItem('dashboardToken')
      await axios.delete(`/api/dashboard/announcements/${announcementId}?action=delete`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      
      setMessage({ type: 'success', text: 'Announcement permanently deleted!' })
      setSelectedAnnouncement(null)
      loadAnnouncements()
      
      setTimeout(() => setMessage({ type: '', text: '' }), 2000)
    } catch (error) {
      setMessage({ type: 'error', text: error.response?.data?.error || 'Failed to delete' })
    }
  }

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'urgent': return 'bg-red-100 text-red-800 border-red-300'
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-300'
      case 'normal': return 'bg-blue-100 text-blue-800 border-blue-300'
      case 'low': return 'bg-gray-100 text-gray-800 border-gray-300'
      default: return 'bg-gray-100 text-gray-800 border-gray-300'
    }
  }

  const isUnread = (announcement) => {
    return !announcement.readBy.some(r => r.username === admin?.username)
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading announcements...</p>
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
              <h1 className="text-3xl font-bold text-gray-900">
                <FaBullhorn className="inline mr-3 text-primary-600" />
                Announcements & Messages
              </h1>
              <p className="text-gray-600">
                {admin?.role === 'super_admin' 
                  ? 'Send announcements to all admins or specific schools' 
                  : 'View announcements and communicate with other admins'}
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <FaFilter className="text-gray-600" />
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <option value="active">Active</option>
                  <option value="archived">Archived</option>
                </select>
              </div>
              <button
                onClick={() => setShowNewForm(true)}
                className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center space-x-2"
              >
                <FaPlus />
                <span>New Announcement</span>
              </button>
            </div>
          </div>
        </div>

        {message.text && (
          <div className={`mb-4 p-3 rounded ${
            message.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
          }`}>
            {message.text}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Announcements List */}
          <div className="lg:col-span-1 bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              All Messages ({announcements.length})
            </h2>
            <div className="space-y-2 max-h-[600px] overflow-y-auto">
              {announcements.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                  <FaBullhorn className="text-6xl mx-auto mb-4 opacity-50" />
                  <p>No announcements</p>
                </div>
              ) : (
                announcements.map((announcement) => (
                  <motion.div
                    key={announcement._id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className={`p-4 rounded-lg cursor-pointer transition-all ${
                      selectedAnnouncement?._id === announcement._id
                        ? 'bg-primary-100 border-2 border-primary-500'
                        : isUnread(announcement)
                        ? 'bg-blue-50 border border-blue-200 hover:bg-blue-100'
                        : 'bg-gray-50 border border-gray-200 hover:bg-gray-100'
                    }`}
                    onClick={() => {
                      setSelectedAnnouncement(announcement)
                      if (isUnread(announcement)) {
                        markAsRead(announcement._id)
                      }
                    }}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          {isUnread(announcement) && (
                            <span className="w-2 h-2 bg-blue-600 rounded-full"></span>
                          )}
                          <span className={`text-xs px-2 py-1 rounded border ${getPriorityColor(announcement.priority)}`}>
                            {announcement.priority.toUpperCase()}
                          </span>
                        </div>
                        <h3 className="font-semibold text-gray-900 text-sm line-clamp-1">
                          {announcement.title}
                        </h3>
                        <p className="text-xs text-gray-600 mt-1">
                          From: {announcement.sender.fullName}
                          {announcement.sender.school && ` (${announcement.sender.school})`}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          <FaClock className="inline mr-1" />
                          {new Date(announcement.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    {announcement.replies.length > 0 && (
                      <div className="text-xs text-gray-600 mt-2">
                        <FaReply className="inline mr-1" />
                        {announcement.replies.length} {announcement.replies.length === 1 ? 'reply' : 'replies'}
                      </div>
                    )}
                  </motion.div>
                ))
              )}
            </div>
          </div>

          {/* Announcement Detail */}
          <div className="lg:col-span-2 bg-white rounded-xl shadow-lg p-6">
            {selectedAnnouncement ? (
              <div>
                <div className="flex items-start justify-between mb-6">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <span className={`text-xs px-3 py-1 rounded border ${getPriorityColor(selectedAnnouncement.priority)}`}>
                        {selectedAnnouncement.priority.toUpperCase()}
                      </span>
                      {selectedAnnouncement.recipients === 'all_admins' && (
                        <span className="text-xs px-3 py-1 rounded bg-purple-100 text-purple-800 border border-purple-300">
                          ALL ADMINS
                        </span>
                      )}
                      {selectedAnnouncement.targetSchool && (
                        <span className="text-xs px-3 py-1 rounded bg-green-100 text-green-800 border border-green-300">
                          {selectedAnnouncement.targetSchool}
                        </span>
                      )}
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">
                      {selectedAnnouncement.title}
                    </h2>
                    <div className="text-sm text-gray-600">
                      <p>From: <span className="font-semibold">{selectedAnnouncement.sender.fullName}</span></p>
                      {selectedAnnouncement.sender.school && (
                        <p>School: {selectedAnnouncement.sender.school}</p>
                      )}
                      <p>
                        <FaClock className="inline mr-1" />
                        {new Date(selectedAnnouncement.createdAt).toLocaleString()}
                      </p>
                    </div>
                  </div>
                  {(selectedAnnouncement.sender.username === admin?.username || admin?.role === 'super_admin') && (
                    <div className="flex space-x-2">
                      {filterStatus === 'active' ? (
                        <>
                          <button
                            onClick={() => handleArchive(selectedAnnouncement._id)}
                            className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 flex items-center space-x-2"
                          >
                            <FaArchive />
                            <span>Archive</span>
                          </button>
                          <button
                            onClick={() => handlePermanentDelete(selectedAnnouncement._id)}
                            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 flex items-center space-x-2"
                          >
                            <FaTrash />
                            <span>Delete</span>
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            onClick={() => handleUnarchive(selectedAnnouncement._id)}
                            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 flex items-center space-x-2"
                          >
                            <FaUndo />
                            <span>Unarchive</span>
                          </button>
                          <button
                            onClick={() => handlePermanentDelete(selectedAnnouncement._id)}
                            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 flex items-center space-x-2"
                          >
                            <FaTrash />
                            <span>Delete</span>
                          </button>
                        </>
                      )}
                    </div>
                  )}
                </div>

                <div className="bg-gray-50 p-6 rounded-lg mb-6">
                  <p className="text-gray-800 whitespace-pre-wrap">{selectedAnnouncement.message}</p>
                </div>

                {/* Replies */}
                <div className="mb-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">
                    Replies ({selectedAnnouncement.replies.length})
                  </h3>
                  <div className="space-y-4 max-h-[300px] overflow-y-auto">
                    {selectedAnnouncement.replies.map((reply, index) => (
                      <div key={index} className="bg-blue-50 p-4 rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <div>
                            <span className="font-semibold text-gray-900">{reply.sender.fullName}</span>
                            {reply.sender.school && (
                              <span className="text-sm text-gray-600 ml-2">({reply.sender.school})</span>
                            )}
                          </div>
                          <span className="text-xs text-gray-500">
                            {new Date(reply.createdAt).toLocaleString()}
                          </span>
                        </div>
                        <p className="text-gray-800">{reply.message}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Reply Form */}
                <div className="border-t pt-4">
                  <h3 className="text-lg font-bold text-gray-900 mb-3">Send Reply</h3>
                  <div className="flex space-x-2">
                    <textarea
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                      placeholder="Type your reply..."
                      rows={3}
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                    <button
                      onClick={() => handleReply(selectedAnnouncement._id)}
                      disabled={!replyText.trim()}
                      className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center space-x-2"
                    >
                      <FaReply />
                      <span>Reply</span>
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-20 text-gray-500">
                <FaBullhorn className="text-6xl mx-auto mb-4 opacity-50" />
                <p>Select an announcement to view details</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* New Announcement Modal */}
      <AnimatePresence>
        {showNewForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            onClick={() => setShowNewForm(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-white rounded-xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <h2 className="text-2xl font-bold text-gray-900 mb-4">New Announcement</h2>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Title *</label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="Announcement title"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Message *</label>
                  <textarea
                    required
                    rows={5}
                    value={formData.message}
                    onChange={(e) => setFormData({...formData, message: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="Type your message..."
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Recipients *</label>
                    <select
                      required
                      value={formData.recipients}
                      onChange={(e) => setFormData({...formData, recipients: e.target.value, targetSchool: ''})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    >
                      {admin?.role === 'super_admin' && (
                        <>
                          <option value="all_admins">All Admins</option>
                          <option value="specific_school">Specific School</option>
                        </>
                      )}
                      {admin?.role === 'school_admin' && (
                        <>
                          <option value="super_admin">Super Admin</option>
                          <option value="specific_school">Other School Admin</option>
                        </>
                      )}
                    </select>
                  </div>

                  {formData.recipients === 'specific_school' && (
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1">Target School *</label>
                      <select
                        required
                        value={formData.targetSchool}
                        onChange={(e) => setFormData({...formData, targetSchool: e.target.value})}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                      >
                        <option value="">Select School</option>
                        {schools.map(school => (
                          <option key={school} value={school}>{school}</option>
                        ))}
                      </select>
                    </div>
                  )}

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Priority *</label>
                    <select
                      required
                      value={formData.priority}
                      onChange={(e) => setFormData({...formData, priority: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    >
                      <option value="low">Low</option>
                      <option value="normal">Normal</option>
                      <option value="high">High</option>
                      <option value="urgent">Urgent</option>
                    </select>
                  </div>
                </div>

                <div className="flex space-x-3 pt-4">
                  <button type="submit" className="btn-primary flex-1">
                    Send Announcement
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowNewForm(false)}
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
