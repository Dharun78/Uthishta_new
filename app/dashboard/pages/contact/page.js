'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { FaArrowLeft, FaSave, FaEdit, FaTimes, FaCheck } from 'react-icons/fa'
import axios from 'axios'
import Link from 'next/link'

export default function ContactPageEditor() {
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
      const response = await axios.get('/api/dashboard/pages?page=contact')
      
      if (response.data.success && response.data.content?.sections) {
        setContent(response.data.content.sections)
      } else {
        setContent({
          mainOffice: {
            address: 'Department of Technical Education, Government of Karnataka, Bangalore',
            phone: '+91-80-XXXX-XXXX',
            email: 'info@gjtskarnataka.edu.in',
            hours: 'Monday - Friday: 9:00 AM - 5:00 PM'
          },
          socialMedia: {
            facebook: 'https://facebook.com/gjtskarnataka',
            twitter: 'https://twitter.com/gjtskarnataka',
            instagram: 'https://instagram.com/gjtskarnataka',
            linkedin: 'https://linkedin.com/company/gjtskarnataka'
          }
        })
      }
    } catch (error) {
      console.error('Error loading content:', error)
      setMessage({ type: 'error', text: 'Failed to load content' })
      setContent({
        mainOffice: {
          address: 'Department of Technical Education, Government of Karnataka, Bangalore',
          phone: '+91-80-XXXX-XXXX',
          email: 'info@gjtskarnataka.edu.in',
          hours: 'Monday - Friday: 9:00 AM - 5:00 PM'
        },
        socialMedia: {
          facebook: 'https://facebook.com/gjtskarnataka',
          twitter: 'https://twitter.com/gjtskarnataka',
          instagram: 'https://instagram.com/gjtskarnataka',
          linkedin: 'https://linkedin.com/company/gjtskarnataka'
        }
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
        page: 'contact',
        sections: content
      }, {
        headers: { Authorization: `Bearer ${token}` }
      })
      setMessage({ type: 'success', text: '✅ Contact page updated successfully!' })
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
    setTempData(JSON.parse(JSON.stringify(content[section])))
  }

  const saveEdit = () => {
    setContent({ ...content, [editingSection]: tempData })
    setEditingSection(null)
    setTempData(null)
  }

  if (loading || !admin || !content) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-primary-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-md sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/dashboard/pages" className="text-primary-600"><FaArrowLeft /></Link>
              <h1 className="text-2xl font-bold">✏️ Edit Contact Page</h1>
            </div>
            <button onClick={handleSave} disabled={saving} className="btn-primary">
              <FaSave className="inline mr-2" />{saving ? 'Saving...' : 'Save All'}
            </button>
          </div>
          {message.text && (
            <div className={`mt-3 p-3 rounded-lg ${message.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
              {message.text}
            </div>
          )}
        </div>
      </div>

      <div className="container mx-auto px-4 py-12 space-y-8">
        {/* Main Office */}
        <div className="card group relative">
          <button onClick={() => startEdit('mainOffice')} className="absolute top-4 right-4 bg-blue-500 text-white px-3 py-1 rounded opacity-0 group-hover:opacity-100">
            <FaEdit className="inline mr-1" /> Edit
          </button>
          <h2 className="text-2xl font-bold mb-4">Main Office</h2>
          {editingSection === 'mainOffice' ? (
            <div className="border-4 border-yellow-400 p-4 rounded">
              <div className="flex justify-end space-x-2 mb-4">
                <button onClick={saveEdit} className="bg-green-500 text-white px-3 py-1 rounded"><FaCheck /> Save</button>
                <button onClick={() => setEditingSection(null)} className="bg-gray-500 text-white px-3 py-1 rounded"><FaTimes /> Cancel</button>
              </div>
              <div className="space-y-3">
                <textarea value={tempData.address} onChange={(e) => setTempData({...tempData, address: e.target.value})} className="w-full px-3 py-2 border rounded" rows={3} placeholder="Address" />
                <input type="text" value={tempData.phone} onChange={(e) => setTempData({...tempData, phone: e.target.value})} className="w-full px-3 py-2 border rounded" placeholder="Phone" />
                <input type="email" value={tempData.email} onChange={(e) => setTempData({...tempData, email: e.target.value})} className="w-full px-3 py-2 border rounded" placeholder="Email" />
                <input type="text" value={tempData.hours} onChange={(e) => setTempData({...tempData, hours: e.target.value})} className="w-full px-3 py-2 border rounded" placeholder="Hours" />
              </div>
            </div>
          ) : (
            <div>
              <p><strong>Address:</strong> {content.mainOffice.address}</p>
              <p><strong>Phone:</strong> {content.mainOffice.phone}</p>
              <p><strong>Email:</strong> {content.mainOffice.email}</p>
              <p><strong>Hours:</strong> {content.mainOffice.hours}</p>
            </div>
          )}
        </div>

        {/* Social Media */}
        <div className="card group relative">
          <button onClick={() => startEdit('socialMedia')} className="absolute top-4 right-4 bg-blue-500 text-white px-3 py-1 rounded opacity-0 group-hover:opacity-100">
            <FaEdit className="inline mr-1" /> Edit
          </button>
          <h2 className="text-2xl font-bold mb-4">Social Media</h2>
          {editingSection === 'socialMedia' ? (
            <div className="border-4 border-yellow-400 p-4 rounded">
              <div className="flex justify-end space-x-2 mb-4">
                <button onClick={saveEdit} className="bg-green-500 text-white px-3 py-1 rounded"><FaCheck /> Save</button>
                <button onClick={() => setEditingSection(null)} className="bg-gray-500 text-white px-3 py-1 rounded"><FaTimes /> Cancel</button>
              </div>
              <div className="space-y-3">
                <input type="url" value={tempData.facebook} onChange={(e) => setTempData({...tempData, facebook: e.target.value})} className="w-full px-3 py-2 border rounded" placeholder="Facebook URL" />
                <input type="url" value={tempData.twitter} onChange={(e) => setTempData({...tempData, twitter: e.target.value})} className="w-full px-3 py-2 border rounded" placeholder="Twitter URL" />
                <input type="url" value={tempData.instagram} onChange={(e) => setTempData({...tempData, instagram: e.target.value})} className="w-full px-3 py-2 border rounded" placeholder="Instagram URL" />
                <input type="url" value={tempData.linkedin} onChange={(e) => setTempData({...tempData, linkedin: e.target.value})} className="w-full px-3 py-2 border rounded" placeholder="LinkedIn URL" />
              </div>
            </div>
          ) : (
            <div>
              <p><strong>Facebook:</strong> {content.socialMedia.facebook}</p>
              <p><strong>Twitter:</strong> {content.socialMedia.twitter}</p>
              <p><strong>Instagram:</strong> {content.socialMedia.instagram}</p>
              <p><strong>LinkedIn:</strong> {content.socialMedia.linkedin}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
