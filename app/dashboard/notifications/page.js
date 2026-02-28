'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { 
  FaArrowLeft, FaBell, FaCheckDouble, FaExclamationTriangle,
  FaInfoCircle, FaDollarSign, FaGift, FaCalendar, FaCog,
  FaUsers, FaCheck
} from 'react-icons/fa'
import axios from 'axios'
import Link from 'next/link'

export default function NotificationsPage() {
  const router = useRouter()
  const [admin, setAdmin] = useState(null)
  const [notifications, setNotifications] = useState([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all') // all, unread, alumni, donation, grant, event

  useEffect(() => {
    checkAuth()
  }, [])

  useEffect(() => {
    if (admin) {
      loadNotifications()
    }
  }, [admin, filter])

  const checkAuth = () => {
    const adminData = localStorage.getItem('schoolAdmin')
    if (!adminData) {
      router.push('/dashboard/login')
      return
    }
    setAdmin(JSON.parse(adminData))
  }

  const loadNotifications = async () => {
    try {
      setLoading(true)
      const token = localStorage.getItem('dashboardToken')
      
      const unreadOnly = filter === 'unread'
      const response = await axios.get(`/api/dashboard/notifications?unreadOnly=${unreadOnly}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      
      let filteredNotifications = response.data.notifications
      
      // Apply type filter
      if (filter !== 'all' && filter !== 'unread') {
        filteredNotifications = filteredNotifications.filter(n => n.type === filter)
      }
      
      setNotifications(filteredNotifications)
      setUnreadCount(response.data.unreadCount)
    } catch (error) {
      console.error('Error loading notifications:', error)
    } finally {
      setLoading(false)
    }
  }

  const markAsRead = async (notificationId) => {
    try {
      const token = localStorage.getItem('dashboardToken')
      
      await axios.put('/api/dashboard/notifications', {
        notificationId
      }, {
        headers: { Authorization: `Bearer ${token}` }
      })
      
      loadNotifications()
    } catch (error) {
      console.error('Error marking notification as read:', error)
    }
  }

  const markAllAsRead = async () => {
    try {
      const token = localStorage.getItem('dashboardToken')
      
      await axios.put('/api/dashboard/notifications', {
        markAllRead: true
      }, {
        headers: { Authorization: `Bearer ${token}` }
      })
      
      loadNotifications()
    } catch (error) {
      console.error('Error marking all as read:', error)
    }
  }

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'alumni': return FaUsers
      case 'donation': return FaDollarSign
      case 'grant': return FaGift
      case 'event': return FaCalendar
      case 'system': return FaCog
      case 'alert': return FaExclamationTriangle
      default: return FaInfoCircle
    }
  }

  const getNotificationColor = (type, priority) => {
    if (priority === 'urgent') return 'red'
    if (priority === 'high') return 'orange'
    
    switch (type) {
      case 'alumni': return 'blue'
      case 'donation': return 'green'
      case 'grant': return 'purple'
      case 'event': return 'pink'
      case 'system': return 'gray'
      case 'alert': return 'yellow'
      default: return 'blue'
    }
  }

  const formatDate = (date) => {
    const now = new Date()
    const notifDate = new Date(date)
    const diffMs = now - notifDate
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMs / 3600000)
    const diffDays = Math.floor(diffMs / 86400000)

    if (diffMins < 1) return 'Just now'
    if (diffMins < 60) return `${diffMins}m ago`
    if (diffHours < 24) return `${diffHours}h ago`
    if (diffDays < 7) return `${diffDays}d ago`
    return notifDate.toLocaleDateString()
  }

  if (loading || !admin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 font-semibold">Loading notifications...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-5xl">
        {/* Header */}
        <div className="mb-8">
          <Link href="/dashboard" className="inline-flex items-center text-primary-600 hover:text-primary-700 mb-4">
            <FaArrowLeft className="mr-2" />
            Back to Dashboard
          </Link>
          
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                <FaBell className="inline mr-3 text-primary-600" />
                Notifications
              </h1>
              <p className="text-gray-600 mt-2">
                {unreadCount > 0 ? `You have ${unreadCount} unread notification${unreadCount > 1 ? 's' : ''}` : 'All caught up!'}
              </p>
            </div>
            
            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg font-semibold"
              >
                <FaCheckDouble className="inline mr-2" />
                Mark All as Read
              </button>
            )}
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-md p-4 mb-6">
          <div className="flex flex-wrap gap-2">
            {[
              { value: 'all', label: 'All', icon: FaBell },
              { value: 'unread', label: 'Unread', icon: FaInfoCircle },
              { value: 'alumni', label: 'Alumni', icon: FaUsers },
              { value: 'donation', label: 'Donations', icon: FaDollarSign },
              { value: 'grant', label: 'Grants', icon: FaGift },
              { value: 'event', label: 'Events', icon: FaCalendar }
            ].map(({ value, label, icon: Icon }) => (
              <button
                key={value}
                onClick={() => setFilter(value)}
                className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                  filter === value
                    ? 'bg-primary-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <Icon className="inline mr-2" />
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Notifications List */}
        <div className="space-y-4">
          {notifications.length === 0 ? (
            <div className="bg-white rounded-xl shadow-md p-12 text-center">
              <FaBell className="text-6xl text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-gray-900 mb-2">No Notifications</h3>
              <p className="text-gray-600">
                {filter === 'unread' 
                  ? 'You have no unread notifications' 
                  : 'No notifications to display'}
              </p>
            </div>
          ) : (
            notifications.map((notification, index) => {
              const Icon = getNotificationIcon(notification.type)
              const color = getNotificationColor(notification.type, notification.priority)
              
              return (
                <motion.div
                  key={notification._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className={`bg-white rounded-xl shadow-md hover:shadow-lg transition-all ${
                    !notification.read ? 'border-l-4 border-primary-600' : ''
                  }`}
                >
                  <div className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-4 flex-1">
                        <div className={`w-12 h-12 bg-${color}-100 rounded-full flex items-center justify-center flex-shrink-0`}>
                          <Icon className={`text-xl text-${color}-600`} />
                        </div>
                        
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-1">
                            <h3 className="text-lg font-bold text-gray-900">{notification.title}</h3>
                            {!notification.read && (
                              <span className="bg-primary-600 text-white text-xs px-2 py-1 rounded-full">New</span>
                            )}
                            {notification.priority === 'urgent' && (
                              <span className="bg-red-600 text-white text-xs px-2 py-1 rounded-full">Urgent</span>
                            )}
                            {notification.priority === 'high' && (
                              <span className="bg-orange-600 text-white text-xs px-2 py-1 rounded-full">High</span>
                            )}
                          </div>
                          
                          <p className="text-gray-700 mb-2">{notification.message}</p>
                          
                          <div className="flex items-center space-x-4 text-sm text-gray-500">
                            <span>{formatDate(notification.createdAt)}</span>
                            {notification.school && notification.school !== 'All' && (
                              <span className="bg-gray-100 px-2 py-1 rounded">{notification.school}</span>
                            )}
                            {notification.school === 'All' && (
                              <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded">All Schools</span>
                            )}
                          </div>
                          
                          {notification.actionUrl && (
                            <Link 
                              href={notification.actionUrl}
                              className="inline-block mt-3 text-primary-600 hover:text-primary-700 font-semibold"
                            >
                              View Details →
                            </Link>
                          )}
                        </div>
                      </div>
                      
                      {!notification.read && (
                        <button
                          onClick={() => markAsRead(notification._id)}
                          className="ml-4 text-gray-400 hover:text-primary-600 transition-colors"
                          title="Mark as read"
                        >
                          <FaCheck className="text-xl" />
                        </button>
                      )}
                    </div>
                  </div>
                </motion.div>
              )
            })
          )}
        </div>
      </div>
    </div>
  )
}
