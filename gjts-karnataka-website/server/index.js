const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const Alumni = require('./models/Alumni')

const app = express()
const PORT = process.env.PORT || 5000

// Middleware
app.use(cors())
app.use(express.json())

// MongoDB Connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/gjts-karnataka'

mongoose.connect(MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err))

// Routes

// Alumni Registration
app.post('/api/alumni/register', async (req, res) => {
  try {
    const alumni = new Alumni(req.body)
    await alumni.save()
    res.status(201).json({ 
      message: 'Alumni registered successfully',
      alumni: {
        name: alumni.name,
        email: alumni.email,
        school: alumni.school
      }
    })
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ error: 'Email already registered' })
    }
    res.status(500).json({ error: 'Registration failed', details: error.message })
  }
})

// Get all alumni (with pagination)
app.get('/api/alumni', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1
    const limit = parseInt(req.query.limit) || 10
    const school = req.query.school

    const query = school ? { school } : {}
    
    const alumni = await Alumni.find(query)
      .select('-__v')
      .sort({ registeredAt: -1 })
      .limit(limit)
      .skip((page - 1) * limit)

    const total = await Alumni.countDocuments(query)

    res.json({
      alumni,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalAlumni: total
    })
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch alumni' })
  }
})

// Get alumni by school
app.get('/api/alumni/school/:school', async (req, res) => {
  try {
    const alumni = await Alumni.find({ school: req.params.school })
      .select('-__v')
      .sort({ graduationYear: -1 })
    
    res.json({ alumni, count: alumni.length })
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch alumni' })
  }
})

// Get alumni statistics
app.get('/api/alumni/stats', async (req, res) => {
  try {
    const stats = await Alumni.aggregate([
      {
        $group: {
          _id: '$school',
          count: { $sum: 1 },
          avgGraduationYear: { $avg: '$graduationYear' }
        }
      },
      {
        $sort: { count: -1 }
      }
    ])

    const total = await Alumni.countDocuments()

    res.json({ stats, total })
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch statistics' })
  }
})

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'Server is running' })
})

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
