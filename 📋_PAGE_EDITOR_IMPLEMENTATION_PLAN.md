# 📋 Page Editor Implementation Plan

## Goal
Create page editors that look EXACTLY like the school content editor - showing the actual page content with hover-to-edit buttons for inline editing.

## UI Pattern (from School Content Editor)
1. **Fixed Header** with back button, page title, and "Save All Changes" button
2. **Success/Error Messages** at top
3. **Page Content Replica** - Shows exactly what the public page looks like
4. **Hover-to-Edit Buttons** - Edit buttons appear on hover over each section
5. **Inline Editing** - Click edit → section highlights with blue border → edit in place → save/cancel
6. **Database Integration** - Load from MongoDB, save changes back

## Pages to Implement

### 1. Home Page Editor
**Sections to Edit**:
- Hero Section
  - Main title
  - Subtitle
  - CTA button text
- Stats Section (4 stats)
  - Icon (dropdown)
  - Value
  - Label
- CTA Section
  - Title
  - Description
  - Button text

### 2. About Page Editor
**Sections to Edit**:
- Mission statement
- Vision statement
- History paragraph
- Core values (list)

### 3. Admissions Page Editor
**Sections to Edit**:
- Eligibility criteria
  - Education requirement
  - Age requirement
- Important Dates
  - Application start
  - Application end
  - Entrance test date
  - Results date

### 4. Contact Page Editor
**Sections to Edit**:
- Main Office
  - Address
  - Phone
  - Email
  - Office hours
- Social Media Links
  - Facebook URL
  - Twitter URL
  - Instagram URL
  - LinkedIn URL

### 5. Alumni Page Editor
**Sections to Edit**:
- Registration info paragraph
- Benefits list (add/remove items)

## Implementation Steps

### Step 1: Update API to Handle Default Content
The API should return default content if no database entry exists, so editors always have something to display.

### Step 2: Create Each Page Editor
For each page:
1. Load content from API (with defaults)
2. Display content exactly like public page
3. Add hover-to-edit buttons on each section
4. Implement inline editing with blue border highlight
5. Save/Cancel buttons for each section
6. "Save All" button at top to persist to database

### Step 3: Update Public Pages
Update public pages to load from database first, fallback to hardcoded content.

## Code Structure Pattern

```javascript
'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { FaArrowLeft, FaSave, FaEdit, FaTimes, FaCheck } from 'react-icons/fa'
import axios from 'axios'
import Link from 'next/link'

export default function PageNameEditor() {
  const router = useRouter()
  const [admin, setAdmin] = useState(null)
  const [content, setContent] = useState(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState({ type: '', text: '' })
  const [editingSection, setEditingSection] = useState(null)
  const [tempData, setTempData] = useState(null)

  // Auth check
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

  // Load content
  useEffect(() => {
    if (admin) loadContent()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [admin])

  const loadContent = async () => {
    try {
      setLoading(true)
      const token = localStorage.getItem('dashboardToken')
      const response = await axios.get('/api/dashboard/pages?page=pagename', {
        headers: { Authorization: `Bearer ${token}` }
      })
      setContent(response.data.content.sections)
    } catch (error) {
      console.error('Error loading content:', error)
      setMessage({ type: 'error', text: 'Failed to load content' })
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    try {
      setSaving(true)
      const token = localStorage.getItem('dashboardToken')
      await axios.put('/api/dashboard/pages', {
        page: 'pagename',
        sections: content
      }, {
        headers: { Authorization: `Bearer ${token}` }
      })
      setMessage({ type: 'success', text: '✅ Page updated successfully!' })
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

  const cancelEdit = () => {
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
      {/* Fixed Header */}
      <div className="bg-white shadow-md sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/dashboard/pages" className="text-primary-600">
                <FaArrowLeft />
              </Link>
              <h1 className="text-2xl font-bold">✏️ Edit Page Name</h1>
            </div>
            <button onClick={handleSave} disabled={saving} className="btn-primary">
              <FaSave className="inline mr-2" />
              {saving ? 'Saving...' : 'Save All Changes'}
            </button>
          </div>
          {message.text && (
            <div className={`mt-3 p-3 rounded-lg ${message.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
              {message.text}
            </div>
          )}
        </div>
      </div>

      {/* Page Content with Edit Buttons */}
      <div className="container mx-auto px-4 py-12">
        {/* Each section with hover-to-edit */}
        <div className="relative group">
          {editingSection === 'sectionName' ? (
            // Edit Mode
            <div className="border-4 border-blue-500 rounded-lg p-6 bg-blue-50">
              <div className="flex justify-end space-x-2 mb-4">
                <button onClick={saveEdit} className="bg-green-500 text-white px-3 py-1 rounded">
                  <FaCheck /> Save
                </button>
                <button onClick={cancelEdit} className="bg-gray-500 text-white px-3 py-1 rounded">
                  <FaTimes /> Cancel
                </button>
              </div>
              {/* Edit inputs */}
            </div>
          ) : (
            // View Mode
            <div>
              <button
                onClick={() => startEdit('sectionName')}
                className="absolute top-4 right-4 bg-blue-500 text-white px-3 py-1 rounded opacity-0 group-hover:opacity-100"
              >
                <FaEdit /> Edit
              </button>
              {/* Display content */}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
```

## Key Features
1. ✅ Looks exactly like public page
2. ✅ Hover shows edit buttons
3. ✅ Click edit → blue border highlight
4. ✅ Edit in place with inputs
5. ✅ Save/Cancel per section
6. ✅ Save All at top
7. ✅ Success/error messages
8. ✅ Loading states
9. ✅ Super Admin only access
10. ✅ Database integration

## Timeline
- Home Page Editor: 30 minutes
- About Page Editor: 20 minutes
- Admissions Page Editor: Already done (just needs UI update)
- Contact Page Editor: Already done (just needs UI update)
- Alumni Page Editor: Already done (just needs UI update)

Total: ~2 hours for complete implementation
