'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { 
  FaCalendarAlt, FaUsers, FaChartLine, FaEnvelope, 
  FaCog, FaSignOutAlt, FaPlus, FaEdit, FaTrash, FaBell, FaFilter 
} from 'react-icons/fa'
import axios from 'axios'
import Link from 'next/link'

export default function Dashboard() {
  const router = useRouter()
  const [admin, setAdmin] = useState(null)
  const [selectedSchool, setSelectedSchool] = useState('All') // For super admin filter
  const [stats, setStats] = useState({
    totalEvents: 0,
    upcomingEvents: 0,
    totalAlumni: 0,
    totalFunds: 0,
    totalFundAmount: 0,
    totalGrants: 0,
    activeGrants: 0,
    emailsSent: 0
  })
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('overview')
  const [unreadNotifications, setUnreadNotifications] = useState(0)
  
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
    loadDashboardData()
    loadNotificationCount()
  }, [selectedSchool])

  const loadNotificationCount = async () => {
    try {
      const token = localStorage.getItem('dashboardToken')
      const response = await axios.get('/api/dashboard/notifications?unreadOnly=true', {
        headers: { Authorization: `Bearer ${token}` }
      })
      setUnreadNotifications(response.data.unreadCount)
    } catch (error) {
      console.error('Error loading notification count:', error)
    }
  }

  const checkAuth = () => {
    const token = localStorage.getItem('dashboardToken')
    const adminData = localStorage.getItem('schoolAdmin')
    
    if (!token || !adminData) {
      router.push('/dashboard/login')
      return
    }
    
    setAdmin(JSON.parse(adminData))
  }

  const loadDashboardData = async () => {
    try {
      const token = localStorage.getItem('dashboardToken')
      const adminData = JSON.parse(localStorage.getItem('schoolAdmin'))
      
      // For super admin, use selected school filter; for school admin, use their school
      const schoolParam = adminData?.role === 'super_admin' && selectedSchool !== 'All' 
        ? `?school=${selectedSchool}` 
        : ''
      
      const response = await axios.get(`/api/dashboard/stats${schoolParam}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      
      setStats(response.data.stats)
      setEvents(response.data.events)
    } catch (error) {
      console.error('Error loading dashboard:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('dashboardToken')
    localStorage.removeItem('schoolAdmin')
    router.push('/dashboard/login')
  }

  if (loading || !admin) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                GJTS {admin.role === 'super_admin' ? (selectedSchool === 'All' ? 'All Schools' : selectedSchool) : admin.school}
              </h1>
              <p className="text-gray-600">School Dashboard</p>
            </div>
            <div className="flex items-center space-x-4">
              {admin.role === 'super_admin' && (
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
              <Link href="/dashboard/notifications" className="relative">
                <button className="p-3 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors relative">
                  <FaBell className="text-xl text-gray-700" />
                  {unreadNotifications > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                      {unreadNotifications > 9 ? '9+' : unreadNotifications}
                    </span>
                  )}
                </button>
              </Link>
              <div className="text-right">
                <p className="font-semibold text-gray-900">{admin.fullName}</p>
                <p className="text-sm text-gray-600">{admin.role === 'super_admin' ? 'Super Admin' : 'School Admin'}</p>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
              >
                <FaSignOutAlt />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Navigation Tabs */}
        <div className="bg-white rounded-lg shadow-sm mb-6">
          <div className="flex space-x-1 p-2">
            {[
              { id: 'overview', label: 'Overview', icon: FaChartLine },
              { id: 'events', label: 'Events', icon: FaCalendarAlt },
              { id: 'funds', label: 'Funds', icon: FaChartLine, link: '/dashboard/funds' },
              { id: 'grants', label: 'Grants', icon: FaChartLine, link: '/dashboard/grants' },
              { id: 'alumni', label: 'Alumni', icon: FaUsers, link: '/dashboard/alumni' },
              { id: 'content', label: 'Content', icon: FaEdit, link: '/dashboard/content' },
              { id: 'announcements', label: 'Messages', icon: FaBell, link: '/dashboard/announcements' },
              ...(admin?.role === 'super_admin' ? [
                { id: 'pages', label: 'Website Pages', icon: FaEdit, link: '/dashboard/pages' },
                { id: 'settings', label: 'Settings', icon: FaCog, link: '/dashboard/settings' }
              ] : []),
            ].map(tab => {
              if (tab.link) {
                return (
                  <Link key={tab.id} href={tab.link}>
                    <button className="flex items-center space-x-2 px-6 py-3 rounded-lg transition-colors text-gray-600 hover:bg-gray-100">
                      <tab.icon />
                      <span>{tab.label}</span>
                    </button>
                  </Link>
                )
              }
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 px-6 py-3 rounded-lg transition-colors ${
                    activeTab === tab.id
                      ? 'bg-primary-600 text-white'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <tab.icon />
                  <span>{tab.label}</span>
                </button>
              )
            })}
          </div>
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              {[
                { label: 'Total Events', value: stats.totalEvents, icon: FaCalendarAlt, color: 'blue' },
                { label: 'Upcoming Events', value: stats.upcomingEvents, icon: FaCalendarAlt, color: 'green' },
                { label: 'Total Alumni', value: stats.totalAlumni, icon: FaUsers, color: 'purple' },
                { label: 'Total Donations', value: stats.totalFunds, icon: FaChartLine, color: 'orange' },
              ].map((stat, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white rounded-xl shadow-lg p-6"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-600 text-sm">{stat.label}</p>
                      <p className="text-3xl font-bold text-gray-900 mt-2">{stat.value}</p>
                    </div>
                    <div className={`w-12 h-12 bg-${stat.color}-100 rounded-lg flex items-center justify-center`}>
                      <stat.icon className={`text-2xl text-${stat.color}-600`} />
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Additional Stats Row */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              {[
                { label: 'Total Fund Amount', value: `₹${stats.totalFundAmount.toLocaleString()}`, icon: FaChartLine, color: 'green' },
                { label: 'Total Grants', value: stats.totalGrants, icon: FaChartLine, color: 'blue' },
                { label: 'Active Grants', value: stats.activeGrants, icon: FaChartLine, color: 'purple' },
                { label: 'Emails Sent', value: stats.emailsSent, icon: FaEnvelope, color: 'orange' },
              ].map((stat, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.4 + index * 0.1 }}
                  className="bg-white rounded-xl shadow-lg p-6"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-600 text-sm">{stat.label}</p>
                      <p className="text-3xl font-bold text-gray-900 mt-2">{stat.value}</p>
                    </div>
                    <div className={`w-12 h-12 bg-${stat.color}-100 rounded-lg flex items-center justify-center`}>
                      <stat.icon className={`text-2xl text-${stat.color}-600`} />
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Recent Events */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Recent Events</h2>
                <button
                  onClick={() => setActiveTab('events')}
                  className="btn-primary"
                >
                  <FaPlus className="inline mr-2" />
                  Create Event
                </button>
              </div>

              {events.length === 0 ? (
                <div className="text-center py-12">
                  <FaCalendarAlt className="text-6xl text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-600">No events yet. Create your first event!</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {events.slice(0, 5).map(event => (
                    <div key={event._id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-bold text-lg text-gray-900">{event.title}</h3>
                          <p className="text-gray-600 text-sm mt-1">{event.description}</p>
                          <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                            <span>📅 {new Date(event.date).toLocaleDateString()}</span>
                            <span>🕐 {event.time}</span>
                            <span>📍 {event.venue}</span>
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          <button className="p-2 text-blue-600 hover:bg-blue-50 rounded">
                            <FaEdit />
                          </button>
                          <button className="p-2 text-red-600 hover:bg-red-50 rounded">
                            <FaTrash />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        )}

        {/* Events Tab */}
        {activeTab === 'events' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Event Management</h2>
                <div className="flex space-x-3">
                  <button
                    onClick={() => router.push('/dashboard/events')}
                    className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center space-x-2"
                  >
                    <FaCalendarAlt />
                    <span>Manage Events</span>
                  </button>
                  <button
                    onClick={() => router.push('/dashboard/events/create')}
                    className="btn-primary"
                  >
                    <FaPlus className="inline mr-2" />
                    Create New Event
                  </button>
                </div>
              </div>
              <p className="text-gray-600">View and manage all school events from the Events Management page.</p>
            </div>
          </motion.div>
        )}

        {/* Other tabs content... */}
        {activeTab !== 'overview' && activeTab !== 'events' && (
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
            </h2>
            <p className="text-gray-600">This section is under development.</p>
          </div>
        )}
      </div>
    </div>
  )
}
