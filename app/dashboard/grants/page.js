'use client'
import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { FaSearch, FaCheckCircle, FaRobot, FaPaperPlane, FaSpinner, FaArrowLeft, FaFilter } from 'react-icons/fa'
import axios from 'axios'
import Link from 'next/link'

export default function GrantsPage() {
  const router = useRouter()
  const [admin, setAdmin] = useState(null)
  const [selectedSchool, setSelectedSchool] = useState('All')
  const [mounted, setMounted] = useState(false)
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: 'Hello! I\'m your AI Grant Discovery Agent. I can help you:\n\n1. 🔍 Find grants available for your school\n2. ✅ Choose the best grants through guided questions\n3. 📝 Guide you through the application process\n\nI can also answer general questions about GJTS schools, admissions, courses, and more!\n\nTry asking:\n• "What grants are available?"\n• "Help me choose a grant"\n• "How do I apply for grants?"\n• "Tell me about GJTS schools"\n• "What courses are offered?"\n\nWhat would you like to know?',
      timestamp: new Date()
    }
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [grants, setGrants] = useState([])
  const [selectedGrant, setSelectedGrant] = useState(null)
  const [chatContext, setChatContext] = useState({})
  const messagesEndRef = useRef(null)

  useEffect(() => {
    setMounted(true)
  }, [])
  
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
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    if (admin) {
      loadGrants()
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

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const loadGrants = async () => {
    try {
      const token = localStorage.getItem('dashboardToken')
      
      // For super admin, use selected school filter; for school admin, use their school
      const schoolParam = admin?.role === 'super_admin' && selectedSchool !== 'All' 
        ? `?school=${selectedSchool}` 
        : ''
      
      const response = await axios.get(`/api/dashboard/grants${schoolParam}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      setGrants(response.data.grants || [])
    } catch (error) {
      console.error('Error loading grants:', error)
    }
  }

  const handleSend = async () => {
    if (!input.trim() || loading) return

    const userMessage = {
      role: 'user',
      content: input,
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    const currentInput = input
    setInput('')
    setLoading(true)

    try {
      // Send message with context to chatbot
      const response = await axios.post('/api/chatbot', {
        message: currentInput,
        context: chatContext
      })

      const data = response.data

      // Update context if provided
      if (data.context) {
        setChatContext(data.context)
      }

      const assistantMessage = {
        role: 'assistant',
        content: data.message,
        grants: data.grants,
        type: data.type,
        timestamp: new Date()
      }

      setMessages(prev => [...prev, assistantMessage])

      // Update grants list if new grants found
      if (data.grants && data.grants.length > 0) {
        setGrants(prev => {
          // Merge new grants with existing, avoiding duplicates
          const existingIds = new Set(prev.map(g => g._id || g.name))
          const newGrants = data.grants.filter(g => !existingIds.has(g._id || g.name))
          return [...newGrants, ...prev]
        })
      }
    } catch (error) {
      console.error('Chatbot error:', error)
      const errorMessage = {
        role: 'assistant',
        content: 'Sorry, I encountered an error. Please try again or rephrase your question.',
        timestamp: new Date()
      }
      setMessages(prev => [...prev, errorMessage])
      // Reset context on error
      setChatContext({})
    } finally {
      setLoading(false)
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
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
              <FaRobot className="inline mr-3 text-primary-600" />
              AI Grant Discovery Agent
            </h1>
            <p className="text-gray-600">
              Intelligent assistant to find and evaluate grants for your school
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

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Chat Interface */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-lg flex flex-col" style={{ height: '70vh' }}>
              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {messages.map((msg, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[80%] rounded-lg p-4 ${
                        msg.role === 'user'
                          ? 'bg-primary-600 text-white'
                          : 'bg-gray-100 text-gray-900'
                      }`}
                    >
                      {msg.role === 'assistant' && (
                        <div className="flex items-center mb-2">
                          <FaRobot className="mr-2" />
                          <span className="font-semibold text-sm">AI Agent</span>
                        </div>
                      )}
                      <div className="whitespace-pre-wrap">{msg.content}</div>
                      
                      {/* Display grants if any */}
                      {msg.grants && msg.grants.length > 0 && (
                        <div className="mt-4 space-y-2">
                          {msg.grants.map((grant, idx) => (
                            <div
                              key={idx}
                              className="bg-white text-gray-900 p-3 rounded border border-gray-200 cursor-pointer hover:border-primary-500"
                              onClick={() => setSelectedGrant(grant)}
                            >
                              <div className="font-semibold">{grant.title}</div>
                              <div className="text-sm text-gray-600">{grant.grantProvider}</div>
                              <div className="text-sm text-primary-600 mt-1">
                                {grant.perSchoolAmount ? (
                                  <>Per School: {grant.perSchoolAmount}</>
                                ) : grant.amount?.min && grant.amount?.max ? (
                                  <>₹{grant.amount.min.toLocaleString('en-IN')} - ₹{grant.amount.max.toLocaleString('en-IN')}</>
                                ) : (
                                  'Amount varies'
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Display eligibility if any */}
                      {msg.eligibility && (
                        <div className="mt-4 bg-white text-gray-900 p-3 rounded">
                          <div className="font-semibold mb-2">Eligibility Analysis:</div>
                          <div className="text-sm">
                            Score: {msg.eligibility.score}/100
                            <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                              <div
                                className="bg-green-500 h-2 rounded-full"
                                style={{ width: `${msg.eligibility.score}%` }}
                              ></div>
                            </div>
                          </div>
                          <div className="text-sm mt-2">
                            {msg.eligibility.recommendation}
                          </div>
                        </div>
                      )}

                      <div className="text-xs opacity-70 mt-2">
                        {mounted && msg.timestamp.toLocaleTimeString()}
                      </div>
                    </div>
                  </motion.div>
                ))}

                {loading && (
                  <div className="flex justify-start">
                    <div className="bg-gray-100 rounded-lg p-4">
                      <FaSpinner className="animate-spin text-primary-600" />
                    </div>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>

              {/* Input */}
              <div className="border-t p-4">
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Ask me to search for grants or check eligibility..."
                    className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                  <button
                    onClick={handleSend}
                    disabled={loading || !input.trim()}
                    className="btn-primary disabled:opacity-50"
                  >
                    <FaPaperPlane />
                  </button>
                </div>
                <div className="mt-2 text-xs text-gray-500">
                  Try: "Help me choose a grant" • "What grants are available?" • "How do I apply for grants?"
                </div>
              </div>
            </div>
          </div>

          {/* Grants List */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-lg p-6" style={{ height: '70vh', overflowY: 'auto' }}>
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                Discovered Grants ({grants.length})
              </h2>

              {grants.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                  <FaSearch className="text-4xl mx-auto mb-2 opacity-50" />
                  <p>No grants discovered yet</p>
                  <p className="text-sm mt-2">Ask the AI agent to search for grants</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {grants.map((grant, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className={`p-4 border rounded-lg cursor-pointer transition-all ${
                        selectedGrant === grant
                          ? 'border-primary-500 bg-primary-50'
                          : 'border-gray-200 hover:border-primary-300'
                      }`}
                      onClick={() => setSelectedGrant(grant)}
                    >
                      <div className="font-semibold text-gray-900 mb-1">{grant.title || grant.name}</div>
                      <div className="text-sm text-gray-600 mb-2">{grant.grantProvider || grant.provider}</div>
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-primary-600">
                          {grant.providerType || grant.category}
                        </span>
                        {grant.aiEligibilityScore && (
                          <span className="bg-green-100 text-green-700 px-2 py-1 rounded">
                            {grant.aiEligibilityScore}% match
                          </span>
                        )}
                        {grant.matchScore && (
                          <span className="bg-green-100 text-green-700 px-2 py-1 rounded">
                            {grant.matchScore}% match
                          </span>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Grant Details Modal */}
        <AnimatePresence>
          {selectedGrant && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
              onClick={() => setSelectedGrant(null)}
            >
              <motion.div
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 20 }}
                className="bg-white rounded-xl p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
              >
                <h2 className="text-2xl font-bold text-gray-900 mb-4">{selectedGrant.title || selectedGrant.name}</h2>
                
                <div className="space-y-4">
                  <div>
                    <div className="text-sm font-semibold text-gray-700">Provider</div>
                    <div className="text-gray-900">{selectedGrant.grantProvider || selectedGrant.provider}</div>
                  </div>

                  <div>
                    <div className="text-sm font-semibold text-gray-700">Description</div>
                    <div className="text-gray-900">{selectedGrant.description}</div>
                  </div>

                  <div>
                    <div className="text-sm font-semibold text-gray-700">Grant Amount</div>
                    <div className="text-gray-900">
                      {selectedGrant.perSchoolAmount && (
                        <div className="mb-2">
                          <span className="font-semibold">Per School:</span> {selectedGrant.perSchoolAmount}
                        </div>
                      )}
                      {selectedGrant.totalAmount && (
                        <div className="text-sm text-gray-600">
                          <span className="font-semibold">Total Scheme Budget:</span> {selectedGrant.totalAmount}
                        </div>
                      )}
                      {!selectedGrant.perSchoolAmount && !selectedGrant.totalAmount && selectedGrant.amount?.min && selectedGrant.amount?.max && (
                        <div>₹{selectedGrant.amount.min.toLocaleString('en-IN')} - ₹{selectedGrant.amount.max.toLocaleString('en-IN')}</div>
                      )}
                      {!selectedGrant.perSchoolAmount && !selectedGrant.totalAmount && !selectedGrant.amount?.min && (
                        <div>Amount varies</div>
                      )}
                    </div>
                  </div>

                  {(selectedGrant.applicationDeadline || selectedGrant.deadline) && (
                    <div>
                      <div className="text-sm font-semibold text-gray-700">Deadline</div>
                      <div className="text-gray-900">
                        {mounted ? (
                          selectedGrant.applicationDeadline 
                            ? new Date(selectedGrant.applicationDeadline).toLocaleDateString()
                            : selectedGrant.deadline
                        ) : 'Loading...'}
                      </div>
                    </div>
                  )}

                  {selectedGrant.aiRecommendation && (
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <div className="text-sm font-semibold text-gray-700 mb-2">
                        🤖 AI Recommendation
                      </div>
                      <div className="text-gray-900 mb-2">{selectedGrant.aiRecommendation.reasoning}</div>
                      <div className="grid grid-cols-2 gap-3 mt-3">
                        <div className="bg-white p-2 rounded">
                          <div className="text-xs text-gray-600">Success Probability</div>
                          <div className="text-lg font-bold text-green-600">
                            {selectedGrant.aiRecommendation.successProbability}%
                          </div>
                        </div>
                        <div className="bg-white p-2 rounded">
                          <div className="text-xs text-gray-600">Estimated Effort</div>
                          <div className="text-sm font-semibold text-gray-900">
                            {selectedGrant.aiRecommendation.estimatedEffort}
                          </div>
                        </div>
                      </div>
                      {selectedGrant.aiRecommendation.requiredDocuments && (
                        <div className="mt-3">
                          <div className="text-xs font-semibold text-gray-700 mb-1">Required Documents:</div>
                          <ul className="text-sm text-gray-700 space-y-1">
                            {selectedGrant.aiRecommendation.requiredDocuments.map((doc, idx) => (
                              <li key={idx} className="flex items-start">
                                <span className="text-primary-600 mr-2">•</span>
                                {doc}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  )}

                  {(selectedGrant.grantUrl || selectedGrant.applicationUrl) && (
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <div className="text-sm font-semibold text-gray-700 mb-2">🔗 Official Links</div>
                      <div className="space-y-2">
                        {selectedGrant.grantUrl && (
                          <div>
                            <div className="text-xs text-gray-600">Grant Information:</div>
                            <a
                              href={selectedGrant.grantUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-sm text-primary-600 hover:text-primary-700 underline break-all"
                            >
                              {selectedGrant.grantUrl}
                            </a>
                          </div>
                        )}
                        {selectedGrant.applicationUrl && (
                          <div>
                            <div className="text-xs text-gray-600">Application Portal:</div>
                            <a
                              href={selectedGrant.applicationUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-sm text-primary-600 hover:text-primary-700 underline break-all"
                            >
                              {selectedGrant.applicationUrl}
                            </a>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {(selectedGrant.eligibility || selectedGrant.eligibilityCriteria) && (
                    <div>
                      <div className="text-sm font-semibold text-gray-700 mb-2">✅ Eligibility Criteria</div>
                      <div className="space-y-2">
                        {selectedGrant.eligibilityCriteria ? (
                          selectedGrant.eligibilityCriteria.map((criteria, idx) => (
                            <div key={idx} className="flex items-start space-x-2">
                              <span className={`text-lg ${criteria.met ? 'text-green-500' : 'text-yellow-500'}`}>
                                {criteria.met ? '✓' : '⚠'}
                              </span>
                              <div className="flex-1">
                                <div className="text-sm text-gray-900">{criteria.criterion}</div>
                                {criteria.notes && (
                                  <div className="text-xs text-gray-600 mt-1">{criteria.notes}</div>
                                )}
                              </div>
                            </div>
                          ))
                        ) : selectedGrant.eligibility ? (
                          Array.isArray(selectedGrant.eligibility) ? (
                            selectedGrant.eligibility.map((item, idx) => (
                              <div key={idx} className="flex items-start space-x-2">
                                <span className="text-primary-600">•</span>
                                <div className="text-sm text-gray-900">{item}</div>
                              </div>
                            ))
                          ) : (
                            <div className="text-sm text-gray-900">{selectedGrant.eligibility}</div>
                          )
                        ) : null}
                      </div>
                    </div>
                  )}
                </div>

                <div className="mt-6 flex space-x-3">
                  {selectedGrant.applicationUrl ? (
                    <a
                      href={selectedGrant.applicationUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-primary flex-1 text-center"
                    >
                      Apply on Government Portal →
                    </a>
                  ) : selectedGrant.grantUrl ? (
                    <a
                      href={selectedGrant.grantUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-primary flex-1 text-center"
                    >
                      Visit Grant Website →
                    </a>
                  ) : (
                    <button className="btn-primary flex-1" disabled>
                      Application Link Not Available
                    </button>
                  )}
                  <button
                    onClick={() => setSelectedGrant(null)}
                    className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50"
                  >
                    Close
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
