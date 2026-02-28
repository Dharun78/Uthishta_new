'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { FaArrowLeft, FaSave, FaPlus, FaTrash, FaGlobe } from 'react-icons/fa'
import axios from 'axios'
import Link from 'next/link'

export default function GeneralSettingsPage() {
  const router = useRouter()
  const [admin, setAdmin] = useState(null)
  const [settings, setSettings] = useState(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState({ type: '', text: '' })

  useEffect(() => {
    checkAuth()
    loadSettings()
  }, [])

  const checkAuth = () => {
    const adminData = localStorage.getItem('schoolAdmin')
    if (!adminData) {
      router.push('/dashboard/login')
      return
    }
    const parsedAdmin = JSON.parse(adminData)
    
    // Only super admin can access this page
    if (parsedAdmin.role !== 'super_admin') {
      router.push('/dashboard')
      return
    }
    
    setAdmin(parsedAdmin)
  }

  const loadSettings = async () => {
    try {
      setLoading(true)
      const token = localStorage.getItem('dashboardToken')
      
      const response = await axios.get('/api/dashboard/settings', {
        headers: { Authorization: `Bearer ${token}` }
      })
      
      setSettings(response.data.settings)
    } catch (error) {
      console.error('Error loading settings:', error)
      setMessage({ type: 'error', text: error.response?.data?.error || 'Failed to load settings' })
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    try {
      setSaving(true)
      setMessage({ type: '', text: '' })
      
      const token = localStorage.getItem('dashboardToken')
      
      const response = await axios.put('/api/dashboard/settings', settings, {
        headers: { Authorization: `Bearer ${token}` }
      })
      
      setMessage({ type: 'success', text: 'Settings saved successfully!' })
      setSettings(response.data.settings)
      
      // Clear message after 3 seconds
      setTimeout(() => setMessage({ type: '', text: '' }), 3000)
    } catch (error) {
      console.error('Error saving settings:', error)
      setMessage({ type: 'error', text: error.response?.data?.error || 'Failed to save settings' })
    } finally {
      setSaving(false)
    }
  }

  const addAnnouncement = () => {
    setSettings({
      ...settings,
      announcements: [
        ...(settings.announcements || []),
        {
          title: '',
          content: '',
          priority: 'medium',
          active: true,
          createdAt: new Date()
        }
      ]
    })
  }

  const removeAnnouncement = (index) => {
    const newAnnouncements = settings.announcements.filter((_, i) => i !== index)
    setSettings({ ...settings, announcements: newAnnouncements })
  }

  const updateAnnouncement = (index, field, value) => {
    const newAnnouncements = [...settings.announcements]
    newAnnouncements[index][field] = value
    setSettings({ ...settings, announcements: newAnnouncements })
  }

  if (loading || !admin || !settings) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading settings...</p>
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
                <FaGlobe className="inline mr-3" />
                General Settings
              </h1>
              <p className="text-gray-600">Manage site-wide settings and information</p>
            </div>
            
            <button
              onClick={handleSave}
              disabled={saving}
              className="btn-primary disabled:opacity-50"
            >
              <FaSave className="inline mr-2" />
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
          
          {message.text && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`mt-4 p-4 rounded-lg ${
                message.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
              }`}
            >
              {message.text}
            </motion.div>
          )}
        </div>

        <div className="space-y-6">
          {/* Site Information */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Site Information</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Site Name</label>
                <input
                  type="text"
                  value={settings.siteName || ''}
                  onChange={(e) => setSettings({ ...settings, siteName: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="GJTS Karnataka"
                />
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Site Description</label>
                <textarea
                  value={settings.siteDescription || ''}
                  onChange={(e) => setSettings({ ...settings, siteDescription: e.target.value })}
                  rows={2}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="Brief description of the website"
                />
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">About Us</label>
                <textarea
                  value={settings.aboutUs || ''}
                  onChange={(e) => setSettings({ ...settings, aboutUs: e.target.value })}
                  rows={6}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="Detailed information about GJTS Karnataka..."
                />
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Contact Information</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Contact Email</label>
                <input
                  type="email"
                  value={settings.contactEmail || ''}
                  onChange={(e) => setSettings({ ...settings, contactEmail: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="info@gjtskarnataka.edu.in"
                />
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Contact Phone</label>
                <input
                  type="tel"
                  value={settings.contactPhone || ''}
                  onChange={(e) => setSettings({ ...settings, contactPhone: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="+91-XXX-XXX-XXXX"
                />
              </div>
              
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-gray-700 mb-2">Office Address</label>
                <textarea
                  value={settings.officeAddress || ''}
                  onChange={(e) => setSettings({ ...settings, officeAddress: e.target.value })}
                  rows={2}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="Enter office address..."
                />
              </div>
              
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-gray-700 mb-2">Office Hours</label>
                <input
                  type="text"
                  value={settings.officeHours || ''}
                  onChange={(e) => setSettings({ ...settings, officeHours: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="Monday - Friday: 9:00 AM - 5:00 PM"
                />
              </div>
            </div>
          </div>

          {/* Social Media */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Social Media</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {['facebook', 'twitter', 'instagram', 'linkedin', 'youtube'].map(platform => (
                <div key={platform}>
                  <label className="block text-sm font-semibold text-gray-700 mb-2 capitalize">{platform}</label>
                  <input
                    type="url"
                    value={settings.socialMedia?.[platform] || ''}
                    onChange={(e) => setSettings({ 
                      ...settings, 
                      socialMedia: { ...settings.socialMedia, [platform]: e.target.value }
                    })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder={`https://${platform}.com/gjtskarnataka`}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Announcements */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-gray-900">Announcements</h2>
              <button onClick={addAnnouncement} className="btn-primary">
                <FaPlus className="inline mr-2" />
                Add Announcement
              </button>
            </div>
            
            <div className="space-y-4">
              {settings.announcements?.map((announcement, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-semibold text-gray-900">Announcement {index + 1}</h3>
                    <button
                      onClick={() => removeAnnouncement(index)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <FaTrash />
                    </button>
                  </div>
                  
                  <div className="space-y-2">
                    <input
                      type="text"
                      value={announcement.title}
                      onChange={(e) => updateAnnouncement(index, 'title', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                      placeholder="Announcement title"
                    />
                    <textarea
                      value={announcement.content}
                      onChange={(e) => updateAnnouncement(index, 'content', e.target.value)}
                      rows={3}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                      placeholder="Announcement content"
                    />
                    
                    <div className="flex items-center space-x-4">
                      <div className="flex-1">
                        <label className="block text-sm font-semibold text-gray-700 mb-1">Priority</label>
                        <select
                          value={announcement.priority}
                          onChange={(e) => updateAnnouncement(index, 'priority', e.target.value)}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                        >
                          <option value="low">Low</option>
                          <option value="medium">Medium</option>
                          <option value="high">High</option>
                        </select>
                      </div>
                      
                      <div className="flex items-center">
                        <label className="flex items-center space-x-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={announcement.active}
                            onChange={(e) => updateAnnouncement(index, 'active', e.target.checked)}
                            className="w-5 h-5 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                          />
                          <span className="text-sm font-semibold text-gray-700">Active</span>
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              
              {(!settings.announcements || settings.announcements.length === 0) && (
                <p className="text-gray-500 text-center py-4">No announcements yet. Click "Add Announcement" to get started.</p>
              )}
            </div>
          </div>

          {/* Save Button */}
          <div className="flex justify-end">
            <button
              onClick={handleSave}
              disabled={saving}
              className="btn-primary disabled:opacity-50 text-lg px-8 py-3"
            >
              <FaSave className="inline mr-2" />
              {saving ? 'Saving...' : 'Save All Changes'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
