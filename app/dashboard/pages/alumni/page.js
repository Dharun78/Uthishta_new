'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { FaArrowLeft, FaSave, FaEdit, FaTimes, FaCheck, FaPlus, FaTrash } from 'react-icons/fa'
import axios from 'axios'
import Link from 'next/link'

export default function AlumniPageEditor() {
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
      const response = await axios.get('/api/dashboard/pages?page=alumni')
      
      if (response.data.success && response.data.content?.sections) {
        setContent(response.data.content.sections)
      } else {
        setContent({
          registrationInfo: 'Join our growing alumni network and stay connected',
          benefits: ['Networking opportunities', 'Career guidance', 'Exclusive events', 'Mentorship programs']
        })
      }
    } catch (error) {
      console.error('Error loading content:', error)
      setMessage({ type: 'error', text: 'Failed to load content' })
      setContent({
        registrationInfo: 'Join our growing alumni network and stay connected',
        benefits: ['Networking opportunities', 'Career guidance', 'Exclusive events', 'Mentorship programs']
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
        page: 'alumni',
        sections: content
      }, {
        headers: { Authorization: `Bearer ${token}` }
      })
      setMessage({ type: 'success', text: '✅ Alumni page updated successfully!' })
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
    if (section === 'registrationInfo') {
      setTempData(content.registrationInfo)
    } else {
      setTempData([...content.benefits])
    }
  }

  const saveEdit = () => {
    if (editingSection === 'registrationInfo') {
      setContent({ ...content, registrationInfo: tempData })
    } else {
      setContent({ ...content, benefits: tempData })
    }
    setEditingSection(null)
    setTempData(null)
  }

  const addBenefit = () => {
    setTempData([...tempData, ''])
  }

  const removeBenefit = (index) => {
    setTempData(tempData.filter((_, i) => i !== index))
  }

  const updateBenefit = (index, value) => {
    const newBenefits = [...tempData]
    newBenefits[index] = value
    setTempData(newBenefits)
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
              <h1 className="text-2xl font-bold">✏️ Edit Alumni Page</h1>
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
        {/* Registration Info */}
        <div className="card group relative">
          <button onClick={() => startEdit('registrationInfo')} className="absolute top-4 right-4 bg-blue-500 text-white px-3 py-1 rounded opacity-0 group-hover:opacity-100">
            <FaEdit className="inline mr-1" /> Edit
          </button>
          <h2 className="text-2xl font-bold mb-4">Registration Information</h2>
          {editingSection === 'registrationInfo' ? (
            <div className="border-4 border-yellow-400 p-4 rounded">
              <div className="flex justify-end space-x-2 mb-4">
                <button onClick={saveEdit} className="bg-green-500 text-white px-3 py-1 rounded"><FaCheck /> Save</button>
                <button onClick={() => setEditingSection(null)} className="bg-gray-500 text-white px-3 py-1 rounded"><FaTimes /> Cancel</button>
              </div>
              <textarea value={tempData} onChange={(e) => setTempData(e.target.value)} className="w-full px-3 py-2 border rounded" rows={3} />
            </div>
          ) : (
            <p className="text-gray-700">{content.registrationInfo}</p>
          )}
        </div>

        {/* Benefits */}
        <div className="card">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold">Alumni Benefits</h2>
            {editingSection !== 'benefits' && (
              <button onClick={() => startEdit('benefits')} className="bg-blue-500 text-white px-3 py-1 rounded">
                <FaEdit className="inline mr-1" /> Edit
              </button>
            )}
          </div>
          
          {editingSection === 'benefits' ? (
            <div className="border-4 border-yellow-400 p-4 rounded">
              <div className="flex justify-between items-center mb-4">
                <button onClick={addBenefit} className="bg-green-500 text-white px-3 py-1 rounded"><FaPlus /> Add Benefit</button>
                <div className="space-x-2">
                  <button onClick={saveEdit} className="bg-green-500 text-white px-3 py-1 rounded"><FaCheck /> Save</button>
                  <button onClick={() => setEditingSection(null)} className="bg-gray-500 text-white px-3 py-1 rounded"><FaTimes /> Cancel</button>
                </div>
              </div>
              <div className="space-y-3">
                {tempData.map((benefit, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <input type="text" value={benefit} onChange={(e) => updateBenefit(index, e.target.value)} className="flex-1 px-3 py-2 border rounded" />
                    <button onClick={() => removeBenefit(index)} className="bg-red-500 text-white px-2 py-2 rounded"><FaTrash /></button>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <ul className="space-y-2">
              {content.benefits.map((benefit, index) => (
                <li key={index} className="flex items-center">
                  <span className="w-2 h-2 bg-primary-600 rounded-full mr-3"></span>
                  {benefit}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  )
}
