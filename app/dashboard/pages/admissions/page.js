'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { FaArrowLeft, FaSave, FaEdit, FaTimes, FaCheck } from 'react-icons/fa'
import axios from 'axios'
import Link from 'next/link'

export default function AdmissionsPageEditor() {
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
      const response = await axios.get('/api/dashboard/pages?page=admissions')
      
      if (response.data.success && response.data.content?.sections) {
        setContent(response.data.content.sections)
      } else {
        setContent({
          eligibility: { education: 'Completed 7th standard', age: '13-15 years' },
          dates: {
            applicationStart: 'March 1, 2026',
            applicationEnd: 'May 31, 2026',
            entranceTest: 'June 15, 2026',
            resultsAnnouncement: 'June 30, 2026'
          }
        })
      }
    } catch (error) {
      console.error('Error loading content:', error)
      setMessage({ type: 'error', text: 'Failed to load content' })
      setContent({
        eligibility: { education: 'Completed 7th standard', age: '13-15 years' },
        dates: {
          applicationStart: 'March 1, 2026',
          applicationEnd: 'May 31, 2026',
          entranceTest: 'June 15, 2026',
          resultsAnnouncement: 'June 30, 2026'
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
        page: 'admissions',
        sections: content
      }, {
        headers: { Authorization: `Bearer ${token}` }
      })
      setMessage({ type: 'success', text: '✅ Admissions page updated successfully!' })
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
              <h1 className="text-2xl font-bold">✏️ Edit Admissions Page</h1>
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
        <div className="card group relative">
          <button onClick={() => startEdit('eligibility')} className="absolute top-4 right-4 bg-blue-500 text-white px-3 py-1 rounded opacity-0 group-hover:opacity-100">
            <FaEdit className="inline mr-1" /> Edit
          </button>
          <h2 className="text-2xl font-bold mb-4">Eligibility</h2>
          {editingSection === 'eligibility' ? (
            <div className="border-4 border-yellow-400 p-4 rounded">
              <div className="flex justify-end space-x-2 mb-4">
                <button onClick={saveEdit} className="bg-green-500 text-white px-3 py-1 rounded"><FaCheck /> Save</button>
                <button onClick={() => setEditingSection(null)} className="bg-gray-500 text-white px-3 py-1 rounded"><FaTimes /> Cancel</button>
              </div>
              <div className="space-y-3">
                <input type="text" value={tempData.education} onChange={(e) => setTempData({...tempData, education: e.target.value})} className="w-full px-3 py-2 border rounded" placeholder="Education" />
                <input type="text" value={tempData.age} onChange={(e) => setTempData({...tempData, age: e.target.value})} className="w-full px-3 py-2 border rounded" placeholder="Age" />
              </div>
            </div>
          ) : (
            <div>
              <p>Education: {content.eligibility.education}</p>
              <p>Age: {content.eligibility.age}</p>
            </div>
          )}
        </div>

        <div className="card group relative">
          <button onClick={() => startEdit('dates')} className="absolute top-4 right-4 bg-blue-500 text-white px-3 py-1 rounded opacity-0 group-hover:opacity-100">
            <FaEdit className="inline mr-1" /> Edit
          </button>
          <h2 className="text-2xl font-bold mb-4">Important Dates</h2>
          {editingSection === 'dates' ? (
            <div className="border-4 border-yellow-400 p-4 rounded">
              <div className="flex justify-end space-x-2 mb-4">
                <button onClick={saveEdit} className="bg-green-500 text-white px-3 py-1 rounded"><FaCheck /> Save</button>
                <button onClick={() => setEditingSection(null)} className="bg-gray-500 text-white px-3 py-1 rounded"><FaTimes /> Cancel</button>
              </div>
              <div className="space-y-3">
                <input type="text" value={tempData.applicationStart} onChange={(e) => setTempData({...tempData, applicationStart: e.target.value})} className="w-full px-3 py-2 border rounded" placeholder="Application Start" />
                <input type="text" value={tempData.applicationEnd} onChange={(e) => setTempData({...tempData, applicationEnd: e.target.value})} className="w-full px-3 py-2 border rounded" placeholder="Application End" />
                <input type="text" value={tempData.entranceTest} onChange={(e) => setTempData({...tempData, entranceTest: e.target.value})} className="w-full px-3 py-2 border rounded" placeholder="Entrance Test" />
                <input type="text" value={tempData.resultsAnnouncement} onChange={(e) => setTempData({...tempData, resultsAnnouncement: e.target.value})} className="w-full px-3 py-2 border rounded" placeholder="Results" />
              </div>
            </div>
          ) : (
            <div>
              <p>Application Start: {content.dates.applicationStart}</p>
              <p>Application End: {content.dates.applicationEnd}</p>
              <p>Entrance Test: {content.dates.entranceTest}</p>
              <p>Results: {content.dates.resultsAnnouncement}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
