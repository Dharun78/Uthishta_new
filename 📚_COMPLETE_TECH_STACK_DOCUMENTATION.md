# 📚 Complete Tech Stack Documentation

## GJTS Karnataka Website - Technical Overview

---

## 🎯 Project Overview

**Project Name:** GJTS Karnataka Website
**Type:** Full-Stack Web Application
**Purpose:** School Management System with CMS, Alumni Management, Grants Tracking, and AI-Powered Features

---

## 🏗️ Architecture

### Architecture Type: **Full-Stack Monolithic with Serverless Functions**

```
┌─────────────────────────────────────────────────────────┐
│                    CLIENT SIDE                          │
│  ┌──────────────────────────────────────────────────┐  │
│  │  Next.js Frontend (React Components)             │  │
│  │  - Public Pages (Home, About, Admissions, etc.)  │  │
│  │  - Admin Dashboard (Protected Routes)            │  │
│  │  - CMS Interface (Inline Editing)                │  │
│  └──────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────┘
                          ↕ HTTP/HTTPS
┌─────────────────────────────────────────────────────────┐
│                    SERVER SIDE                          │
│  ┌──────────────────────────────────────────────────┐  │
│  │  Next.js API Routes (Serverless Functions)       │  │
│  │  - Authentication APIs                            │  │
│  │  - CRUD Operations                                │  │
│  │  - AI Chatbot Integration                         │  │
│  └──────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────┘
                          ↕ MongoDB Driver
┌─────────────────────────────────────────────────────────┐
│                    DATABASE                             │
│  ┌──────────────────────────────────────────────────┐  │
│  │  MongoDB Atlas (Cloud Database)                   │  │
│  │  - Schools, Events, Alumni, Grants, Funds        │  │
│  │  - Announcements, Pages Content                   │  │
│  └──────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────┘
```

---

## 💻 Frontend Technologies

### 1. **Next.js 14.2.35**
**Role:** React Framework
**Why Used:**
- Server-Side Rendering (SSR) for better SEO
- Static Site Generation (SSG) for fast page loads
- API Routes for backend functionality
- File-based routing system
- Image optimization
- Built-in CSS support

**Key Features Used:**
- App Router (new routing system)
- Server Components
- Client Components ('use client')
- Dynamic routes ([id])
- API routes in `/app/api`

**Example:**
```javascript
// app/page.js - Home page with SSR
export default function Home() {
  return <div>Home Page</div>
}

// app/dashboard/events/[id]/page.js - Dynamic route
export default function EventDetails({ params }) {
  const { id } = params
  // Fetch event by ID
}
```

---

### 2. **React 18**
**Role:** UI Library
**Why Used:**
- Component-based architecture
- Virtual DOM for performance
- Hooks for state management
- Large ecosystem

**Hooks Used:**
- `useState` - Local state management
- `useEffect` - Side effects (API calls, subscriptions)
- `useRouter` - Navigation (Next.js)
- `useParams` - Route parameters (Next.js)

**Example:**
```javascript
const [events, setEvents] = useState([])
const [loading, setLoading] = useState(true)

useEffect(() => {
  loadEvents()
}, [])
```

---

### 3. **Tailwind CSS 3.4**
**Role:** CSS Framework
**Why Used:**
- Utility-first approach
- Rapid development
- Responsive design
- Customizable
- Small bundle size

**Configuration:**
```javascript
// tailwind.config.js
module.exports = {
  content: ['./app/**/*.{js,jsx}', './components/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        primary: { /* custom colors */ }
      }
    }
  }
}
```

**Example Usage:**
```jsx
<div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-2xl transition-shadow">
  <h2 className="text-2xl font-bold text-gray-900 mb-4">Title</h2>
</div>
```

---

### 4. **Framer Motion 11**
**Role:** Animation Library
**Why Used:**
- Smooth animations
- Gesture support
- Layout animations
- Easy to use

**Example:**
```javascript
<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.5 }}
>
  Content
</motion.div>
```

---

### 5. **React Icons**
**Role:** Icon Library
**Why Used:**
- Large icon collection
- Tree-shakeable
- Easy to use
- Consistent styling

**Icons Used:**
- Font Awesome (Fa*)
- Material Design (Md*)

**Example:**
```javascript
import { FaCalendarAlt, FaEdit, FaTrash } from 'react-icons/fa'

<FaCalendarAlt className="text-primary-600 text-xl" />
```

---

### 6. **Axios**
**Role:** HTTP Client
**Why Used:**
- Promise-based
- Request/response interceptors
- Automatic JSON transformation
- Better error handling than fetch

**Example:**
```javascript
const response = await axios.get('/api/dashboard/events', {
  headers: { Authorization: `Bearer ${token}` }
})
```

---

## 🔧 Backend Technologies

### 1. **Next.js API Routes**
**Role:** Backend API
**Why Used:**
- Serverless functions
- Same codebase as frontend
- Easy deployment
- Automatic scaling

**Structure:**
```
app/api/
├── dashboard/
│   ├── events/
│   │   ├── route.js (GET, POST)
│   │   └── [id]/
│   │       └── route.js (GET, PUT, DELETE)
│   ├── alumni/
│   ├── grants/
│   └── funds/
└── chatbot/
    └── route.js
```

**Example API Route:**
```javascript
// app/api/dashboard/events/route.js
export async function GET(request) {
  // Handle GET request
  return NextResponse.json({ events })
}

export async function POST(request) {
  // Handle POST request
  const data = await request.json()
  return NextResponse.json({ success: true })
}
```

---

### 2. **MongoDB with Mongoose**
**Role:** Database & ODM
**Why Used:**
- NoSQL flexibility
- Schema validation
- Easy to scale
- Cloud-ready (Atlas)

**Connection:**
```javascript
// lib/mongodb.js
import mongoose from 'mongoose'

const connectDB = async () => {
  if (mongoose.connections[0].readyState) return
  await mongoose.connect(process.env.MONGODB_URI)
}
```

**Models:**
```javascript
// lib/models/Event.js
const eventSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  date: Date,
  school: String,
  createdAt: { type: Date, default: Date.now }
})

export default mongoose.models.Event || mongoose.model('Event', eventSchema)
```

---

### 3. **JWT (JSON Web Tokens)**
**Role:** Authentication
**Why Used:**
- Stateless authentication
- Secure token-based auth
- Easy to implement
- Works with serverless

**Implementation:**
```javascript
import jwt from 'jsonwebtoken'

// Generate token
const token = jwt.sign(
  { username, role, school },
  process.env.JWT_SECRET,
  { expiresIn: '7d' }
)

// Verify token
const decoded = jwt.verify(token, process.env.JWT_SECRET)
```

---

### 4. **Nodemailer**
**Role:** Email Service
**Why Used:**
- Send emails from Node.js
- SMTP support
- Template support
- Attachment support

**Configuration:**
```javascript
import nodemailer from 'nodemailer'

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
})
```

---

## 🗄️ Database Schema

### Collections:

#### 1. **Admins**
```javascript
{
  username: String,
  password: String (hashed),
  email: String,
  fullName: String,
  role: String, // 'super_admin' or 'school_admin'
  school: String,
  createdAt: Date
}
```

#### 2. **Events**
```javascript
{
  title: String,
  description: String,
  eventType: String,
  date: Date,
  time: String,
  venue: String,
  school: String,
  targetAudience: [String],
  registrationRequired: Boolean,
  registrationLink: String,
  maxParticipants: Number,
  createdBy: String,
  createdAt: Date
}
```

#### 3. **Alumni**
```javascript
{
  name: String,
  email: String,
  phone: String,
  graduationYear: Number,
  school: String,
  currentOccupation: String,
  company: String,
  location: String,
  willingToMentor: Boolean,
  registeredAt: Date
}
```

#### 4. **Grants**
```javascript
{
  name: String,
  description: String,
  amount: String,
  eligibility: [String],
  deadline: String,
  category: String,
  provider: String,
  applicationUrl: String,
  status: String, // 'active' or 'inactive'
  createdAt: Date
}
```

#### 5. **Funds**
```javascript
{
  donorName: String,
  amount: Number,
  school: String,
  purpose: String,
  paymentMethod: String,
  date: Date,
  notes: String,
  recordedBy: String,
  recordedAt: Date
}
```

#### 6. **Announcements**
```javascript
{
  title: String,
  message: String,
  sender: {
    username: String,
    fullName: String,
    school: String,
    role: String
  },
  recipients: String, // 'all_admins', 'specific_school', etc.
  targetSchool: String,
  priority: String, // 'urgent', 'high', 'normal', 'low'
  status: String, // 'active', 'archived'
  readBy: [{
    username: String,
    readAt: Date
  }],
  replies: [{
    sender: Object,
    message: String,
    createdAt: Date
  }],
  createdAt: Date
}
```

#### 7. **SchoolContent**
```javascript
{
  school: String,
  description: String,
  vision: String,
  mission: String,
  facilities: [{
    name: String,
    description: String
  }],
  achievements: [{
    title: String,
    description: String,
    year: Number
  }],
  courses: [{
    name: String,
    duration: String,
    description: String
  }],
  contactInfo: {
    email: String,
    phone: String,
    address: String,
    website: String
  },
  updatedBy: String,
  updatedAt: Date
}
```

#### 8. **Pages**
```javascript
{
  page: String, // 'home', 'about', 'admissions', etc.
  sections: Object, // Dynamic content sections
  updatedBy: String,
  updatedAt: Date
}
```

---

## 🔐 Security Features

### 1. **Authentication**
- JWT-based authentication
- Password hashing with bcrypt
- Token expiration (7 days)
- Protected API routes

### 2. **Authorization**
- Role-based access control (RBAC)
- Super Admin vs School Admin permissions
- Route-level protection
- API endpoint authorization

### 3. **Data Validation**
- Mongoose schema validation
- Frontend form validation
- Required field checks
- Data type validation

### 4. **Security Headers**
- HTTPS enforcement
- CORS configuration
- Content Security Policy
- XSS protection

---

## 🤖 AI Features

### 1. **AI-Powered Grants Chatbot**
**Technology:** Custom AI logic with pattern matching
**Purpose:** Help schools find relevant grants

**How It Works:**
1. Asks 5 questions about school needs
2. Collects responses (infrastructure, digital, lab, etc.)
3. Matches responses with grant categories
4. Scores grants based on relevance (0-100%)
5. Returns top matching grants

**Algorithm:**
```javascript
// Scoring algorithm
const score = (grant, responses) => {
  let matchScore = 0
  
  // Check category match
  if (responses.includes(grant.category)) {
    matchScore += 40
  }
  
  // Check eligibility match
  grant.eligibility.forEach(criteria => {
    if (responses.some(r => criteria.includes(r))) {
      matchScore += 20
    }
  })
  
  return Math.min(matchScore, 100)
}
```

### 2. **AI Email Nudge System**
**Purpose:** Send personalized event notifications to alumni

**Features:**
- Automatic email generation
- Personalized content
- Event-based triggers
- Batch email sending

---

## 📱 Features Breakdown

### Public Features:
1. **Home Page** - School showcase with stats
2. **About Page** - School information
3. **Admissions Page** - Application process
4. **Contact Page** - Contact information
5. **Alumni Registration** - Public alumni signup

### Admin Dashboard Features:

#### 1. **Event Management**
- Create, edit, delete events
- View event details
- Send email notifications
- Filter by school

#### 2. **Alumni Management**
- Add, edit, delete alumni
- View alumni profiles
- Export alumni data
- Filter and search

#### 3. **Grants & Funds**
- AI chatbot for grant discovery
- Manual grant addition
- Fund recording
- View all donations
- Edit/delete funds

#### 4. **Content Management System (CMS)**
- Inline editing
- Page-specific editors
- School-specific content
- Real-time preview

#### 5. **Announcements & Messaging**
- Send announcements
- Reply to messages
- Archive/unarchive
- Permanent delete
- Priority levels

#### 6. **Statistics Dashboard**
- Total events, alumni, funds
- Grant statistics
- School-specific data
- Visual charts

---

## 🎨 UI/UX Features

### 1. **Responsive Design**
- Mobile-first approach
- Tablet optimization
- Desktop layouts
- Breakpoints: sm, md, lg, xl

### 2. **Animations**
- Page transitions
- Hover effects
- Loading states
- Modal animations

### 3. **Interactive Elements**
- Inline editing
- Drag and drop (future)
- Real-time updates
- Toast notifications

### 4. **Accessibility**
- Semantic HTML
- ARIA labels
- Keyboard navigation
- Screen reader support

---

## 📦 Dependencies

### Production Dependencies:
```json
{
  "next": "14.2.35",
  "react": "^18",
  "react-dom": "^18",
  "mongoose": "^8.0.0",
  "jsonwebtoken": "^9.0.0",
  "bcryptjs": "^2.4.3",
  "axios": "^1.6.0",
  "framer-motion": "^11.0.0",
  "react-icons": "^5.0.0",
  "nodemailer": "^6.9.0"
}
```

### Development Dependencies:
```json
{
  "tailwindcss": "^3.4.0",
  "postcss": "^8",
  "autoprefixer": "^10.0.1",
  "eslint": "^8",
  "eslint-config-next": "14.2.35"
}
```

---

## 🔄 Data Flow

### Example: Creating an Event

```
1. User fills event form in dashboard
   ↓
2. Frontend validates form data
   ↓
3. Axios sends POST request to /api/dashboard/events
   ↓
4. API route verifies JWT token
   ↓
5. API checks user permissions
   ↓
6. Mongoose creates event in MongoDB
   ↓
7. API returns success response
   ↓
8. Frontend shows success message
   ↓
9. Frontend refreshes events list
   ↓
10. User sees new event
```

---

## 🚀 Performance Optimizations

### 1. **Next.js Optimizations**
- Automatic code splitting
- Image optimization
- Font optimization
- Static page generation

### 2. **Database Optimizations**
- Indexed fields
- Lean queries
- Pagination
- Selective field projection

### 3. **Frontend Optimizations**
- Lazy loading
- Component memoization
- Debounced search
- Optimistic UI updates

### 4. **Caching**
- Browser caching
- API response caching
- Static asset caching
- CDN caching

---

## 🧪 Testing Strategy

### Types of Testing:
1. **Manual Testing** - User flow testing
2. **Browser Testing** - Cross-browser compatibility
3. **Responsive Testing** - Mobile, tablet, desktop
4. **API Testing** - Postman/Thunder Client
5. **Database Testing** - MongoDB Compass

---

## 📊 Monitoring & Analytics

### Potential Integrations:
1. **Google Analytics** - User behavior tracking
2. **Sentry** - Error tracking
3. **LogRocket** - Session replay
4. **Vercel Analytics** - Performance monitoring

---

## 🔮 Future Enhancements

### Planned Features:
1. **Real-time Chat** - WebSocket integration
2. **File Uploads** - Cloudinary/AWS S3
3. **Advanced Analytics** - Charts and graphs
4. **Mobile App** - React Native
5. **Payment Gateway** - Razorpay/Stripe
6. **Multi-language** - i18n support
7. **PWA** - Progressive Web App
8. **Push Notifications** - Web push

---

## 📝 Development Workflow

### 1. **Local Development**
```bash
npm run dev  # Start development server
```

### 2. **Building**
```bash
npm run build  # Create production build
```

### 3. **Production**
```bash
npm start  # Start production server
```

### 4. **Linting**
```bash
npm run lint  # Check code quality
```

---

## 🎓 Learning Resources

### For Understanding This Project:
1. **Next.js:** https://nextjs.org/docs
2. **React:** https://react.dev
3. **MongoDB:** https://www.mongodb.com/docs
4. **Tailwind CSS:** https://tailwindcss.com/docs
5. **JWT:** https://jwt.io/introduction

---

## 📞 Technical Support

### Common Issues:
1. **MongoDB Connection** - Check connection string
2. **JWT Errors** - Verify secret key
3. **Build Errors** - Clear .next folder
4. **Port Conflicts** - Kill existing processes

---

## ✅ Project Statistics

- **Total Files:** 100+
- **Lines of Code:** ~15,000+
- **Components:** 50+
- **API Routes:** 30+
- **Database Models:** 8
- **Pages:** 20+

---

## 🎯 Key Takeaways

### What Makes This Project Special:
1. ✅ **Full-Stack** - Frontend + Backend in one codebase
2. ✅ **Modern Stack** - Latest technologies
3. ✅ **Scalable** - Can handle growth
4. ✅ **Secure** - Authentication & authorization
5. ✅ **AI-Powered** - Intelligent grant matching
6. ✅ **CMS** - Content management built-in
7. ✅ **Responsive** - Works on all devices
8. ✅ **Production-Ready** - Can be deployed immediately

---

**Last Updated:** February 2026
**Version:** 1.0.0
**Prepared For:** GJTS Karnataka Website Technical Documentation
