@echo off
cd /d "%~dp0"
(
echo 'use client'
echo import { useState, useEffect } from 'react'
echo import { useRouter } from 'next/navigation'
echo import { motion } from 'framer-motion'
echo import { FaArrowLeft, FaSave, FaEdit, FaTimes, FaCheck } from 'react-icons/fa'
echo import axios from 'axios'
echo import Link from 'next/link'
echo.
echo export default function AboutPageEditor^(^) {
echo   const router = useRouter^(^)
echo   const [admin, setAdmin] = useState^(null^)
echo   const [content, setContent] = useState^(null^)
echo   const [loading, setLoading] = useState^(true^)
echo   const [saving, setSaving] = useState^(false^)
echo   const [message, setMessage] = useState^({ type: '', text: '' }^)
echo   const [editingSection, setEditingSection] = useState^(null^)
echo   const [tempData, setTempData] = useState^(null^)
echo.
echo   useEffect^(^(^) =^> {
echo     const adminData = localStorage.getItem^('schoolAdmin'^)
echo     if ^(!adminData^) {
echo       router.push^('/dashboard/login'^)
echo       return
echo     }
echo     const parsedAdmin = JSON.parse^(adminData^)
echo     if ^(parsedAdmin.role !== 'super_admin'^) {
echo       alert^('Only Super Admin can edit website pages'^)
echo       router.push^('/dashboard'^)
echo       return
echo     }
echo     setAdmin^(parsedAdmin^)
echo   }, [router]^)
echo.
echo   useEffect^(^(^) =^> {
echo     if ^(admin^) loadContent^(^)
echo     // eslint-disable-next-line react-hooks/exhaustive-deps
echo   }, [admin]^)
echo.
echo   const loadContent = async ^(^) =^> {
echo     try {
echo       setLoading^(true^)
echo       const response = await axios.get^('/api/dashboard/pages?page=about'^)
echo       if ^(response.data.success ^&^& response.data.content?.sections^) {
echo         setContent^(response.data.content.sections^)
echo       } else {
echo         setContent^({
echo           mission: 'To provide quality education and holistic development to students from rural Karnataka.',
echo           vision: 'To be a leading institution that empowers students to become responsible citizens and future leaders.',
echo           history: 'Established in 1985, GJTS Karnataka has been serving the educational needs of rural communities for over 35 years.',
echo           values: 'Excellence, Integrity, Innovation, Inclusivity, and Community Service.'
echo         }^)
echo       }
echo     } catch ^(error^) {
echo       console.error^('Error loading content:', error^)
echo       setMessage^({ type: 'error', text: 'Failed to load content' }^)
echo       setContent^({
echo         mission: 'To provide quality education and holistic development to students from rural Karnataka.',
echo         vision: 'To be a leading institution that empowers students to become responsible citizens and future leaders.',
echo         history: 'Established in 1985, GJTS Karnataka has been serving the educational needs of rural communities for over 35 years.',
echo         values: 'Excellence, Integrity, Innovation, Inclusivity, and Community Service.'
echo       }^)
echo     } finally {
echo       setLoading^(false^)
echo     }
echo   }
echo.
echo   const handleSave = async ^(^) =^> {
echo     try {
echo       setSaving^(true^)
echo       const token = localStorage.getItem^('dashboardToken'^)
echo       await axios.put^('/api/dashboard/pages', {
echo         page: 'about',
echo         sections: content
echo       }, {
echo         headers: { Authorization: `Bearer ${token}` }
echo       }^)
echo       setMessage^({ type: 'success', text: '✅ About page updated successfully!' }^)
echo       window.scrollTo^({ top: 0, behavior: 'smooth' }^)
echo       setTimeout^(^(^) =^> setMessage^({ type: '', text: '' }^), 5000^)
echo     } catch ^(error^) {
echo       setMessage^({ type: 'error', text: `❌ ${error.response?.data?.error ^|^| 'Failed to save'}` }^)
echo     } finally {
echo       setSaving^(false^)
echo     }
echo   }
echo.
echo   const startEdit = ^(section^) =^> {
echo     setEditingSection^(section^)
echo     setTempData^(content[section]^)
echo   }
echo.
echo   const saveEdit = ^(^) =^> {
echo     setContent^({ ...content, [editingSection]: tempData }^)
echo     setEditingSection^(null^)
echo     setTempData^(null^)
echo   }
echo.
echo   if ^(loading ^|^| !admin ^|^| !content^) {
echo     return ^(
echo       ^<div className="min-h-screen flex items-center justify-center bg-gray-50"^>
echo         ^<div className="animate-spin rounded-full h-16 w-16 border-b-4 border-primary-600"^>^</div^>
echo       ^</div^>
echo     ^)
echo   }
echo.
echo   return ^(
echo     ^<div className="min-h-screen bg-gray-50"^>
echo       ^<div className="bg-white shadow-md sticky top-0 z-50"^>
echo         ^<div className="container mx-auto px-4 py-4"^>
echo           ^<div className="flex items-center justify-between"^>
echo             ^<div className="flex items-center space-x-4"^>
echo               ^<Link href="/dashboard/pages" className="text-primary-600"^>^<FaArrowLeft /^>^</Link^>
echo               ^<h1 className="text-2xl font-bold"^>✏️ Edit About Page^</h1^>
echo             ^</div^>
echo             ^<button onClick={handleSave} disabled={saving} className="btn-primary"^>
echo               ^<FaSave className="inline mr-2" /^>{saving ? 'Saving...' : 'Save All'}
echo             ^</button^>
echo           ^</div^>
echo           {message.text ^&^& ^(
echo             ^<div className={`mt-3 p-3 rounded-lg ${message.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}^>
echo               {message.text}
echo             ^</div^>
echo           ^)}
echo         ^</div^>
echo       ^</div^>
echo       ^<div className="container mx-auto px-4 py-12 space-y-8"^>
echo         ^<div className="card group relative"^>
echo           ^<button onClick={^(^) =^> startEdit^('mission'^)} className="absolute top-4 right-4 bg-blue-500 text-white px-3 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity"^>
echo             ^<FaEdit className="inline mr-1" /^> Edit
echo           ^</button^>
echo           ^<h2 className="text-2xl font-bold mb-4"^>Our Mission^</h2^>
echo           {editingSection === 'mission' ? ^(
echo             ^<div className="border-4 border-blue-400 p-4 rounded"^>
echo               ^<div className="flex justify-end space-x-2 mb-4"^>
echo                 ^<button onClick={saveEdit} className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"^>
echo                   ^<FaCheck className="inline mr-1" /^> Save
echo                 ^</button^>
echo                 ^<button onClick={^(^) =^> setEditingSection^(null^)} className="bg-gray-500 text-white px-3 py-1 rounded hover:bg-gray-600"^>
echo                   ^<FaTimes className="inline mr-1" /^> Cancel
echo                 ^</button^>
echo               ^</div^>
echo               ^<textarea value={tempData} onChange={^(e^) =^> setTempData^(e.target.value^)} className="w-full px-3 py-2 border rounded" rows="4" placeholder="Enter mission statement" /^>
echo             ^</div^>
echo           ^) : ^(
echo             ^<p className="text-gray-700"^>{content.mission}^</p^>
echo           ^)}
echo         ^</div^>
echo         ^<div className="card group relative"^>
echo           ^<button onClick={^(^) =^> startEdit^('vision'^)} className="absolute top-4 right-4 bg-blue-500 text-white px-3 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity"^>
echo             ^<FaEdit className="inline mr-1" /^> Edit
echo           ^</button^>
echo           ^<h2 className="text-2xl font-bold mb-4"^>Our Vision^</h2^>
echo           {editingSection === 'vision' ? ^(
echo             ^<div className="border-4 border-blue-400 p-4 rounded"^>
echo               ^<div className="flex justify-end space-x-2 mb-4"^>
echo                 ^<button onClick={saveEdit} className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"^>
echo                   ^<FaCheck className="inline mr-1" /^> Save
echo                 ^</button^>
echo                 ^<button onClick={^(^) =^> setEditingSection^(null^)} className="bg-gray-500 text-white px-3 py-1 rounded hover:bg-gray-600"^>
echo                   ^<FaTimes className="inline mr-1" /^> Cancel
echo                 ^</button^>
echo               ^</div^>
echo               ^<textarea value={tempData} onChange={^(e^) =^> setTempData^(e.target.value^)} className="w-full px-3 py-2 border rounded" rows="4" placeholder="Enter vision statement" /^>
echo             ^</div^>
echo           ^) : ^(
echo             ^<p className="text-gray-700"^>{content.vision}^</p^>
echo           ^)}
echo         ^</div^>
echo         ^<div className="card group relative"^>
echo           ^<button onClick={^(^) =^> startEdit^('history'^)} className="absolute top-4 right-4 bg-blue-500 text-white px-3 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity"^>
echo             ^<FaEdit className="inline mr-1" /^> Edit
echo           ^</button^>
echo           ^<h2 className="text-2xl font-bold mb-4"^>Our History^</h2^>
echo           {editingSection === 'history' ? ^(
echo             ^<div className="border-4 border-blue-400 p-4 rounded"^>
echo               ^<div className="flex justify-end space-x-2 mb-4"^>
echo                 ^<button onClick={saveEdit} className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"^>
echo                   ^<FaCheck className="inline mr-1" /^> Save
echo                 ^</button^>
echo                 ^<button onClick={^(^) =^> setEditingSection^(null^)} className="bg-gray-500 text-white px-3 py-1 rounded hover:bg-gray-600"^>
echo                   ^<FaTimes className="inline mr-1" /^> Cancel
echo                 ^</button^>
echo               ^</div^>
echo               ^<textarea value={tempData} onChange={^(e^) =^> setTempData^(e.target.value^)} className="w-full px-3 py-2 border rounded" rows="4" placeholder="Enter history" /^>
echo             ^</div^>
echo           ^) : ^(
echo             ^<p className="text-gray-700"^>{content.history}^</p^>
echo           ^)}
echo         ^</div^>
echo         ^<div className="card group relative"^>
echo           ^<button onClick={^(^) =^> startEdit^('values'^)} className="absolute top-4 right-4 bg-blue-500 text-white px-3 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity"^>
echo             ^<FaEdit className="inline mr-1" /^> Edit
echo           ^</button^>
echo           ^<h2 className="text-2xl font-bold mb-4"^>Our Values^</h2^>
echo           {editingSection === 'values' ? ^(
echo             ^<div className="border-4 border-blue-400 p-4 rounded"^>
echo               ^<div className="flex justify-end space-x-2 mb-4"^>
echo                 ^<button onClick={saveEdit} className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"^>
echo                   ^<FaCheck className="inline mr-1" /^> Save
echo                 ^</button^>
echo                 ^<button onClick={^(^) =^> setEditingSection^(null^)} className="bg-gray-500 text-white px-3 py-1 rounded hover:bg-gray-600"^>
echo                   ^<FaTimes className="inline mr-1" /^> Cancel
echo                 ^</button^>
echo               ^</div^>
echo               ^<textarea value={tempData} onChange={^(e^) =^> setTempData^(e.target.value^)} className="w-full px-3 py-2 border rounded" rows="4" placeholder="Enter values" /^>
echo             ^</div^>
echo           ^) : ^(
echo             ^<p className="text-gray-700"^>{content.values}^</p^>
echo           ^)}
echo         ^</div^>
echo       ^</div^>
echo     ^</div^>
echo   ^)
echo }
) > "app\dashboard\pages\about\page.js"
echo About page created successfully!
