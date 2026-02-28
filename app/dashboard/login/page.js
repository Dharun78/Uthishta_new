'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { FaLock, FaUser, FaSchool } from 'react-icons/fa'
import axios from 'axios'

export default function DashboardLogin() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    school: ''
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const schools = [
    { value: 'All', label: 'All Schools' },
    { value: 'Ballari', label: 'Ballari' },
    { value: 'Bhadravati', label: 'Bhadravati' },
    { value: 'Hubballi', label: 'Hubballi' },
    { value: 'Bagalkot', label: 'Bagalkot' },
    { value: 'Kalburgi', label: 'Kalburgi' },
    { value: 'Mangalore', label: 'Mangalore' }
  ]

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const response = await axios.post('/api/dashboard/login', formData)
      
      // Store token and school info
      localStorage.setItem('dashboardToken', response.data.token)
      localStorage.setItem('schoolAdmin', JSON.stringify(response.data.admin))
      
      // Redirect to dashboard
      router.push('/dashboard')
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-500 via-primary-600 to-primary-700 py-12 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full"
      >
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
            <FaSchool className="text-4xl text-primary-600" />
          </div>
          <h1 className="text-4xl font-bold text-white mb-2">School Dashboard</h1>
          <p className="text-primary-100">GJTS Karnataka - Vendor Portal</p>
        </div>

        <div className="bg-white rounded-2xl shadow-2xl p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Login to Dashboard</h2>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-gray-700 font-semibold mb-2">
                <FaSchool className="inline mr-2" />
                Select School
              </label>
              <select
                name="school"
                value={formData.school}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="">Choose your school</option>
                {schools.map(school => (
                  <option key={school.value} value={school.value}>
                    {school.value === 'All' ? school.label : `GJTS ${school.label}`}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-gray-700 font-semibold mb-2">
                <FaUser className="inline mr-2" />
                Username
              </label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                placeholder="Enter your username"
              />
            </div>

            <div>
              <label className="block text-gray-700 font-semibold mb-2">
                <FaLock className="inline mr-2" />
                Password
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                placeholder="Enter your password"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Logging in...' : 'Login to Dashboard'}
            </button>
          </form>

          <div className="mt-6 text-center text-sm text-gray-600">
            <p>Need access? Contact your school administrator</p>
          </div>
        </div>

        <div className="mt-6 text-center text-white text-sm">
          <p>© 2026 GJTS Karnataka. All rights reserved.</p>
        </div>
      </motion.div>
    </div>
  )
}
