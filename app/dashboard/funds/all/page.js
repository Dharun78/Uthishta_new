'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { FaArrowLeft, FaCalendar, FaRupeeSign, FaFilter, FaEdit, FaTrash } from 'react-icons/fa'
import axios from 'axios'
import Link from 'next/link'

export default function AllDonationsPage() {
  const router = useRouter()
  const [donations, setDonations] = useState([])
  const [loading, setLoading] = useState(true)
  const [admin, setAdmin] = useState(null)
  const [selectedSchool, setSelectedSchool] = useState('All')
  const [filterPurpose, setFilterPurpose] = useState('all')
  const [editingDonation, setEditingDonation] = useState(null)
  const [editFormData, setEditFormData] = useState({})
  const [message, setMessage] = useState({ type: '', text: '' })
  
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
      loadDonations()
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

  const loadDonations = async () => {
    try {
      const token = localStorage.getItem('dashboardToken')
      const schoolParam = admin?.role === 'super_admin' && selectedSchool !== 'All' 
        ? `?school=${selectedSchool}` 
        : ''
      
      const response = await axios.get(`/api/dashboard/funds${schoolParam}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      
      setDonations(response.data.recentDonations || [])
    } catch (error) {
      console.error('Error loading donations:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredDonations = filterPurpose === 'all' 
    ? donations 
    : donations.filter(d => d.purpose === filterPurpose)

  const purposeColors = {
    general: 'blue',
    infrastructure: 'green',
    scholarship: 'purple',
    equipment: 'orange',
    event: 'pink'
  }

  const handleEdit = (donation) => {
    setEditingDonation(donation)
    setEditFormData({
      alumniName: donation.alumniName,
      alumniEmail: donation.alumniEmail,
      amount: donation.amount,
      purpose: donation.purpose,
      paymentMethod: donation.paymentMethod || 'cash',
      receiptNumber: donation.receiptNumber || '',
      notes: donation.notes || ''
    })
  }

  const handleUpdate = async (e) => {
    e.preventDefault()
    setMessage({ type: '', text: '' })
    
    try {
      const token = localStorage.getItem('dashboardToken')
      await axios.put(`/api/dashboard/funds/${editingDonation._id}`, editFormData, {
        headers: { Authorization: `Bearer ${token}` }
      })
      
      setMessage({ type: 'success', text: 'Donation updated successfully!' })
      setEditingDonation(null)
      loadDonations()
      
      setTimeout(() => setMessage({ type: '', text: '' }), 3000)
    } catch (error) {
      console.error('Update error:', error)
      setMessage({ 
        type: 'error', 
        text: error.response?.data?.error || 'Failed to update donation' 
      })
    }
  }

  const handleDelete = async (donationId) => {
    if (!confirm('Are you sure you want to delete this donation? This action cannot be undone.')) {
      return
    }
    
    setMessage({ type: '', text: '' })
    
    try {
      const token = localStorage.getItem('dashboardToken')
      await axios.delete(`/api/dashboard/funds/${donationId}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      
      setMessage({ type: 'success', text: 'Donation deleted successfully!' })
      loadDonations()
      
      setTimeout(() => setMessage({ type: '', text: '' }), 3000)
    } catch (error) {
      console.error('Delete error:', error)
      setMessage({ 
        type: 'error', 
        text: error.response?.data?.error || 'Failed to delete donation' 
      })
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading donations...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="mb-6">
          <Link href="/dashboard/funds" className="inline-flex items-center text-primary-600 hover:text-primary-700 mb-4">
            <FaArrowLeft className="mr-2" />
            Back to Funds
          </Link>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">All Donations</h1>
              <p className="text-gray-600">Complete donation history</p>
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
              <select
                value={filterPurpose}
                onChange={(e) => setFilterPurpose(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="all">All Purposes</option>
                <option value="general">General</option>
                <option value="infrastructure">Infrastructure</option>
                <option value="scholarship">Scholarship</option>
                <option value="equipment">Equipment</option>
                <option value="event">Event</option>
              </select>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          {message.text && (
            <div className={`mb-4 p-3 rounded ${
              message.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
            }`}>
              {message.text}
            </div>
          )}
          
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-900">
              {filteredDonations.length} Donations
            </h2>
            <div className="text-sm text-gray-600">
              Total: ₹{filteredDonations.reduce((sum, d) => sum + d.amount, 0).toLocaleString('en-IN')}
            </div>
          </div>

          {filteredDonations.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <FaRupeeSign className="text-6xl mx-auto mb-4 opacity-50" />
              <p>No donations found</p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredDonations.map((donation, index) => (
                <motion.div
                  key={donation._id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="font-semibold text-gray-900 text-lg">
                        {donation.alumniName}
                      </div>
                      <div className="text-sm text-gray-600 mt-1">
                        {donation.alumniEmail}
                      </div>
                      {donation.school && (
                        <div className="text-sm text-gray-600 mt-1">
                          GJTS {donation.school}
                        </div>
                      )}
                      <div className="flex items-center space-x-3 mt-2 text-xs text-gray-500">
                        <span className={`px-2 py-1 rounded bg-${purposeColors[donation.purpose]}-100 text-${purposeColors[donation.purpose]}-700`}>
                          {donation.purpose}
                        </span>
                        <span>
                          <FaCalendar className="inline mr-1" />
                          {new Date(donation.createdAt).toLocaleDateString()}
                        </span>
                        {donation.receiptNumber && (
                          <span>Receipt: {donation.receiptNumber}</span>
                        )}
                      </div>
                      {donation.notes && (
                        <div className="text-sm text-gray-600 mt-2 italic">
                          Note: {donation.notes}
                        </div>
                      )}
                    </div>
                    <div className="text-right ml-4">
                      <div className="text-2xl font-bold text-green-600">
                        ₹{donation.amount.toLocaleString('en-IN')}
                      </div>
                      {donation.paymentMethod && (
                        <div className="text-xs text-gray-500 mt-1 capitalize">
                          via {donation.paymentMethod.replace('-', ' ')}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center space-x-2 mt-3">
                    <button
                      onClick={() => handleEdit(donation)}
                      className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm flex items-center space-x-1"
                    >
                      <FaEdit />
                      <span>Edit</span>
                    </button>
                    <button
                      onClick={() => handleDelete(donation._id)}
                      className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 text-sm flex items-center space-x-1"
                    >
                      <FaTrash />
                      <span>Delete</span>
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Edit Donation Modal */}
      <AnimatePresence>
        {editingDonation && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            onClick={() => setEditingDonation(null)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-white rounded-xl p-6 max-w-lg w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Edit Donation</h2>
              
              <form onSubmit={handleUpdate} className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Alumni Name *</label>
                  <input
                    type="text"
                    required
                    value={editFormData.alumniName}
                    onChange={(e) => setEditFormData({...editFormData, alumniName: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Alumni Email *</label>
                  <input
                    type="email"
                    required
                    value={editFormData.alumniEmail}
                    onChange={(e) => setEditFormData({...editFormData, alumniEmail: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Amount (₹) *</label>
                    <input
                      type="number"
                      required
                      value={editFormData.amount}
                      onChange={(e) => setEditFormData({...editFormData, amount: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Purpose *</label>
                    <select
                      required
                      value={editFormData.purpose}
                      onChange={(e) => setEditFormData({...editFormData, purpose: e.target.value})}
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
                      value={editFormData.paymentMethod}
                      onChange={(e) => setEditFormData({...editFormData, paymentMethod: e.target.value})}
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
                      value={editFormData.receiptNumber}
                      onChange={(e) => setEditFormData({...editFormData, receiptNumber: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Notes</label>
                  <textarea
                    rows={2}
                    value={editFormData.notes}
                    onChange={(e) => setEditFormData({...editFormData, notes: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>

                <div className="flex space-x-3 pt-4">
                  <button type="submit" className="btn-primary flex-1">
                    Update Donation
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditingDonation(null)}
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
