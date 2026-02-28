'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  FaRupeeSign, FaChartLine, FaUsers, FaTrophy, 
  FaLightbulb, FaDownload, FaCalendar, FaArrowLeft, FaFilter 
} from 'react-icons/fa'
import axios from 'axios'
import Link from 'next/link'

export default function FundsPage() {
  const router = useRouter()
  const [stats, setStats] = useState(null)
  const [donations, setDonations] = useState([])
  const [loading, setLoading] = useState(true)
  const [admin, setAdmin] = useState(null)
  const [selectedSchool, setSelectedSchool] = useState('All')
  const [showFundForm, setShowFundForm] = useState(false)
  const [fundFormData, setFundFormData] = useState({
    alumniName: '',
    alumniEmail: '',
    amount: '',
    purpose: 'general',
    paymentMethod: 'cash',
    receiptNumber: '',
    notes: '',
    school: ''
  })
  const [formMessage, setFormMessage] = useState({ type: '', text: '' })
  
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
  }, [])

  useEffect(() => {
    if (admin) {
      loadFundData()
    }
  }, [admin, selectedSchool])

  const checkAuth = () => {
    const adminData = localStorage.getItem('schoolAdmin')
    if (!adminData) {
      router.push('/dashboard/login')
      return
    }
    setAdmin(JSON.parse(adminData))
  }

  const loadFundData = async () => {
    try {
      const token = localStorage.getItem('dashboardToken')
      
      // For super admin, use selected school filter; for school admin, use their school
      const schoolParam = admin?.role === 'super_admin' && selectedSchool !== 'All' 
        ? `?school=${selectedSchool}` 
        : ''
      
      const response = await axios.get(`/api/dashboard/funds${schoolParam}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      
      setStats(response.data.stats)
      setDonations(response.data.recentDonations)
    } catch (error) {
      console.error('Error loading fund data:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading fund data...</p>
        </div>
      </div>
    )
  }

  const purposeColors = {
    general: 'blue',
    infrastructure: 'green',
    scholarship: 'purple',
    equipment: 'orange',
    event: 'pink'
  }

  const handleExport = () => {
    // Convert donations data to CSV
    const headers = ['Alumni Name', 'Email', 'School', 'Amount (₹)', 'Purpose', 'Date', 'Receipt Number']
    const csvData = donations.map(d => [
      d.alumniName,
      d.alumniEmail,
      d.school,
      d.amount,
      d.purpose,
      new Date(d.createdAt).toLocaleDateString(),
      d.receiptNumber || 'N/A'
    ])
    
    const csvContent = [
      headers.join(','),
      ...csvData.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n')
    
    // Create download link
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    const url = URL.createObjectURL(blob)
    link.setAttribute('href', url)
    link.setAttribute('download', `donations_${selectedSchool}_${new Date().toISOString().split('T')[0]}.csv`)
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const handleFundSubmit = async (e) => {
    e.preventDefault()
    setFormMessage({ type: '', text: '' })
    
    try {
      const token = localStorage.getItem('dashboardToken')
      const adminData = JSON.parse(localStorage.getItem('schoolAdmin'))
      
      // Determine which school to use
      let schoolToUse = adminData.school
      if (adminData.role === 'super_admin') {
        schoolToUse = fundFormData.school
        if (!schoolToUse) {
          setFormMessage({ type: 'error', text: 'Please select a school' })
          return
        }
      }
      
      await axios.post('/api/dashboard/funds/manual', {
        ...fundFormData,
        school: schoolToUse
      }, {
        headers: { Authorization: `Bearer ${token}` }
      })
      
      setFormMessage({ type: 'success', text: 'Fund recorded successfully!' })
      setShowFundForm(false)
      setFundFormData({
        alumniName: '',
        alumniEmail: '',
        amount: '',
        purpose: 'general',
        paymentMethod: 'cash',
        receiptNumber: '',
        notes: '',
        school: ''
      })
      
      // Reload fund data
      loadFundData()
      
      setTimeout(() => setFormMessage({ type: '', text: '' }), 3000)
    } catch (error) {
      console.error('Fund recording error:', error)
      setFormMessage({ 
        type: 'error', 
        text: error.response?.data?.error || 'Failed to record fund. Please try again.' 
      })
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <Link href="/dashboard" className="inline-flex items-center text-primary-600 hover:text-primary-700 mb-4">
              <FaArrowLeft className="mr-2" />
              Back to Dashboard
            </Link>
            <h1 className="text-3xl font-bold text-gray-900">
              <FaRupeeSign className="inline mr-3 text-primary-600" />
              AI-Powered Fund Management
            </h1>
            <p className="text-gray-600">
              Intelligent tracking and analysis of alumni donations
            </p>
          </div>
          <div className="flex items-center space-x-4">
            {admin?.role === 'super_admin' && (
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
            {admin && (
              <div className="text-right">
                <div className="text-sm text-gray-600">Logged in as</div>
                <div className="font-semibold text-gray-900">{admin.fullName}</div>
                <div className="text-xs text-gray-500">{admin.role === 'super_admin' ? 'Super Admin' : 'School Admin'}</div>
              </div>
            )}
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg p-6 text-white"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm">Total Funds</p>
                <p className="text-3xl font-bold mt-2">
                  ₹{stats?.totalFunds?.toLocaleString('en-IN') || 0}
                </p>
              </div>
              <FaRupeeSign className="text-4xl text-blue-200" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl shadow-lg p-6 text-white"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100 text-sm">Total Donors</p>
                <p className="text-3xl font-bold mt-2">{stats?.donorCount || 0}</p>
              </div>
              <FaUsers className="text-4xl text-green-200" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl shadow-lg p-6 text-white"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100 text-sm">Avg Donation</p>
                <p className="text-3xl font-bold mt-2">
                  ₹{Math.round(stats?.averageDonation || 0).toLocaleString('en-IN')}
                </p>
              </div>
              <FaChartLine className="text-4xl text-purple-200" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl shadow-lg p-6 text-white"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-orange-100 text-sm">AI Insights</p>
                <p className="text-3xl font-bold mt-2">{stats?.insights?.length || 0}</p>
              </div>
              <FaLightbulb className="text-4xl text-orange-200" />
            </div>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* AI Insights */}
            {stats?.insights && stats.insights.length > 0 && (
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                  <FaLightbulb className="mr-2 text-yellow-500" />
                  AI Insights & Recommendations
                </h2>
                <div className="space-y-3">
                  {stats.insights.map((insight, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className={`p-4 rounded-lg border-l-4 ${
                        insight.type === 'positive' ? 'bg-green-50 border-green-500' :
                        insight.type === 'warning' ? 'bg-yellow-50 border-yellow-500' :
                        insight.type === 'milestone' ? 'bg-purple-50 border-purple-500' :
                        'bg-blue-50 border-blue-500'
                      }`}
                    >
                      <div className="font-semibold text-gray-900">{insight.message}</div>
                      <div className="text-sm text-gray-600 mt-1">
                        💡 Action: {insight.action}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {/* Monthly Trend Chart */}
            {stats?.monthlyTrend && (
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">
                  Monthly Donation Trend
                </h2>
                <div className="space-y-2">
                  {stats.monthlyTrend.map((month, index) => (
                    <div key={index} className="flex items-center">
                      <div className="w-24 text-sm text-gray-600">{month.month}</div>
                      <div className="flex-1">
                        <div className="bg-gray-200 rounded-full h-8 relative overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ 
                              width: `${(month.amount / Math.max(...stats.monthlyTrend.map(m => m.amount))) * 100}%` 
                            }}
                            transition={{ delay: index * 0.1, duration: 0.5 }}
                            className="bg-gradient-to-r from-primary-500 to-primary-600 h-full flex items-center justify-end pr-2"
                          >
                            <span className="text-white text-xs font-semibold">
                              ₹{month.amount.toLocaleString('en-IN')}
                            </span>
                          </motion.div>
                        </div>
                      </div>
                      <div className="w-16 text-right text-sm text-gray-600 ml-2">
                        {month.count} donations
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Recent Donations */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                Recent Donations
              </h2>
              <div className="space-y-3">
                {donations.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    No donations recorded yet
                  </div>
                ) : (
                  donations.map((donation, index) => (
                    <motion.div
                      key={donation._id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="font-semibold text-gray-900">
                            {donation.alumniName}
                          </div>
                          <div className="text-sm text-gray-600 mt-1">
                            {donation.alumniEmail}
                          </div>
                          <div className="flex items-center space-x-3 mt-2 text-xs text-gray-500">
                            <span className={`px-2 py-1 rounded bg-${purposeColors[donation.purpose]}-100 text-${purposeColors[donation.purpose]}-700`}>
                              {donation.purpose}
                            </span>
                            <span>
                              <FaCalendar className="inline mr-1" />
                              {new Date(donation.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-bold text-green-600">
                            ₹{donation.amount.toLocaleString('en-IN')}
                          </div>
                          {donation.aiAnalysis && (
                            <div className="text-xs text-gray-500 mt-1">
                              Score: {donation.aiAnalysis.engagementScore}/100
                            </div>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Purpose Breakdown */}
            {stats?.byPurpose && (
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">
                  Funds by Purpose
                </h2>
                <div className="space-y-3">
                  {Object.entries(stats.byPurpose).map(([purpose, amount], index) => (
                    <div key={purpose}>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="capitalize text-gray-700">{purpose}</span>
                        <span className="font-semibold text-gray-900">
                          ₹{amount.toLocaleString('en-IN')}
                        </span>
                      </div>
                      <div className="bg-gray-200 rounded-full h-2">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${(amount / stats.totalFunds) * 100}%` }}
                          transition={{ delay: index * 0.1 }}
                          className={`bg-${purposeColors[purpose]}-500 h-2 rounded-full`}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Top Donors */}
            {stats?.topDonors && stats.topDonors.length > 0 && (
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                  <FaTrophy className="mr-2 text-yellow-500" />
                  Top Donors
                </h2>
                <div className="space-y-3">
                  {stats.topDonors.slice(0, 5).map((donor, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold ${
                          index === 0 ? 'bg-yellow-500' :
                          index === 1 ? 'bg-gray-400' :
                          index === 2 ? 'bg-orange-600' :
                          'bg-gray-300'
                        }`}>
                          {index + 1}
                        </div>
                        <div className="ml-3">
                          <div className="font-semibold text-gray-900 text-sm">
                            {donor.name}
                          </div>
                        </div>
                      </div>
                      <div className="text-sm font-bold text-green-600">
                        ₹{donor.amount.toLocaleString('en-IN')}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Actions</h2>
              
              {formMessage.text && (
                <div className={`mb-4 p-3 rounded ${
                  formMessage.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                }`}>
                  {formMessage.text}
                </div>
              )}
              
              <div className="space-y-3">
                <button 
                  onClick={() => setShowFundForm(true)}
                  className="w-full btn-primary"
                >
                  + Record Fund Received
                </button>
                <button 
                  onClick={handleExport}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center justify-center"
                >
                  <FaDownload className="mr-2" />
                  Download CSV Report
                </button>
                <button 
                  onClick={() => router.push('/dashboard/funds/all')}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  View All Donations
                </button>
                <button 
                  onClick={() => window.print()}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Generate PDF Report
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Record Fund Modal */}
      <AnimatePresence>
        {showFundForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            onClick={() => setShowFundForm(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-white rounded-xl p-6 max-w-lg w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Record Fund Received</h2>
              
              {admin?.role === 'super_admin' && (
                <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <p className="text-sm text-blue-800">
                    <strong>Note:</strong> Please select the school for this donation below.
                  </p>
                </div>
              )}
              
              <form onSubmit={handleFundSubmit} className="space-y-4">
                {admin?.role === 'super_admin' && (
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">School *</label>
                    <select
                      required
                      value={fundFormData.school || selectedSchool}
                      onChange={(e) => setFundFormData({...fundFormData, school: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    >
                      <option value="">Select School</option>
                      <option value="Ballari">Ballari</option>
                      <option value="Bhadravati">Bhadravati</option>
                      <option value="Hubballi">Hubballi</option>
                      <option value="Bagalkot">Bagalkot</option>
                      <option value="Kalburgi">Kalburgi</option>
                      <option value="Mangalore">Mangalore</option>
                    </select>
                  </div>
                )}

                {admin?.role !== 'super_admin' && (
                  <div className="mb-4 p-3 bg-gray-50 border border-gray-200 rounded-lg">
                    <p className="text-sm text-gray-700">
                      <strong>School:</strong> GJTS {admin?.school}
                    </p>
                  </div>
                )}

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Alumni Name *</label>
                  <input
                    type="text"
                    required
                    value={fundFormData.alumniName}
                    onChange={(e) => setFundFormData({...fundFormData, alumniName: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="Full name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Alumni Email *</label>
                  <input
                    type="email"
                    required
                    value={fundFormData.alumniEmail}
                    onChange={(e) => setFundFormData({...fundFormData, alumniEmail: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="email@example.com"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Amount (₹) *</label>
                    <input
                      type="number"
                      required
                      value={fundFormData.amount}
                      onChange={(e) => setFundFormData({...fundFormData, amount: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                      placeholder="10000"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Purpose *</label>
                    <select
                      required
                      value={fundFormData.purpose}
                      onChange={(e) => setFundFormData({...fundFormData, purpose: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    >
                      <option value="general">General</option>
                      <option value="infrastructure">Infrastructure</option>
                      <option value="scholarship">Scholarship</option>
                      <option value="equipment">Equipment</option>
                      <option value="event">Event</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Payment Method *</label>
                    <select
                      required
                      value={fundFormData.paymentMethod}
                      onChange={(e) => setFundFormData({...fundFormData, paymentMethod: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    >
                      <option value="cash">Cash</option>
                      <option value="upi">UPI</option>
                      <option value="card">Card</option>
                      <option value="bank-transfer">Bank Transfer</option>
                      <option value="cheque">Cheque</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Receipt Number</label>
                    <input
                      type="text"
                      value={fundFormData.receiptNumber}
                      onChange={(e) => setFundFormData({...fundFormData, receiptNumber: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                      placeholder="Auto-generated if empty"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Notes</label>
                  <textarea
                    rows={2}
                    value={fundFormData.notes}
                    onChange={(e) => setFundFormData({...fundFormData, notes: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="Additional notes..."
                  />
                </div>

                <div className="flex space-x-3 pt-4">
                  <button type="submit" className="btn-primary flex-1">
                    Record Fund
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowFundForm(false)}
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
