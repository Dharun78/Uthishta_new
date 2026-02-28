# GJTS Karnataka Website - Quick Start Guide

## 🚀 Get Running in 5 Minutes

### Prerequisites Checklist
- [ ] Node.js v18+ installed
- [ ] MongoDB installed and running
- [ ] Git installed
- [ ] Code editor (VS Code recommended)

### Step-by-Step Setup

#### 1. Install Dependencies (2 minutes)

```bash
# Navigate to project
cd gjts-karnataka-website

# Install main dependencies
npm install

# Install MCP server dependencies
cd mcp-server
npm install
cd ..
```

#### 2. Configure Environment (1 minute)

```bash
# Copy environment template
cp .env.example .env

# Edit .env file (optional for local development)
# Default values work for local testing
```

#### 3. Start MongoDB (30 seconds)

```bash
# Windows
net start MongoDB

# Linux/Mac
sudo systemctl start mongod

# Or use MongoDB Compass GUI
```

#### 4. Start the Application (1 minute)

**Terminal 1 - Backend Server:**
```bash
npm run server
```
Expected output:
```
Server running on port 5000
Connected to MongoDB
```

**Terminal 2 - Frontend:**
```bash
npm run dev
```
Expected output:
```
Ready on http://localhost:3000
```

**Terminal 3 - MCP Server (Optional - auto-starts in Kiro):**
```bash
node mcp-server/index.js
```
Expected output:
```
Starting GJTS Karnataka AI MCP Server...
Loading Tiny LLM (Phi-3 Mini)...
AI components initialized successfully
MCP Server running on stdio
```

#### 5. Open in Browser (30 seconds)

Visit: **http://localhost:3000**

You should see:
- ✅ Homepage with hero section
- ✅ Six school cards
- ✅ Floating chatbot icon (bottom-right)
- ✅ Smooth animations

## 🧪 Test the Features

### Test 1: Basic Navigation
1. Click through: Home → About → Schools → Admissions → Alumni
2. All pages should load smoothly with animations

### Test 2: Chatbot (Rule-Based)
1. Click chatbot icon (bottom-right)
2. Type: "What schools are available?"
3. Should get list of 6 schools

### Test 3: Alumni Registration
1. Go to Alumni page
2. Fill out the form
3. Submit
4. Check MongoDB for new entry

### Test 4: MCP Tools (in Kiro)

If using Kiro IDE:

```javascript
// Test student profile analysis
analyze_student_profile({
  name: "Test Student",
  age: 14,
  interests: ["electronics", "programming"],
  location: "Hubballi",
  previousGrades: [75, 78, 82]
})

// Test admission prediction
predict_admission({
  academicScore: 75,
  attendanceRate: 88,
  extracurriculars: 2,
  familyIncome: "low"
})

// Test contextual chat
chat_with_context({
  message: "What courses does GJTS Mangalore offer?"
})
```

## 📁 Project Structure Overview

```
gjts-karnataka-website/
│
├── app/                          # Next.js pages
│   ├── page.js                  # Homepage ✨
│   ├── about/page.js            # About page
│   ├── schools/page.js          # Schools listing
│   ├── admissions/page.js       # Admissions info
│   ├── alumni/page.js           # Alumni registration
│   └── api/
│       └── chatbot/route.js     # Chatbot API
│
├── components/                   # React components
│   ├── Navbar.js                # Navigation
│   ├── Footer.js                # Footer
│   ├── ChatBot.js               # AI chatbot widget 🤖
│   └── SchoolCard.js            # School cards
│
├── mcp-server/                   # 🚀 AI Innovation Hub
│   ├── index.js                 # MCP server
│   ├── ai/
│   │   ├── tiny-llm.js         # Phi-3 Mini LLM
│   │   ├── explainable-ai.js   # XAI engine
│   │   ├── agent.js            # AI Agent
│   │   ├── rag-system.js       # RAG system
│   │   ├── sentiment.js        # Sentiment analysis
│   │   └── predictive.js       # Predictive models
│   └── INTEGRATION_GUIDE.md
│
├── server/                       # Backend
│   ├── index.js                 # Express server
│   └── models/
│       └── Alumni.js            # Alumni model
│
├── data/
│   └── schools-data.json        # School information
│
├── .kiro/settings/
│   └── mcp.json                 # MCP configuration
│
└── Documentation/
    ├── README.md                # Overview
    ├── SETUP.md                 # Detailed setup
    ├── PROJECT_OVERVIEW.md      # Complete docs
    ├── AI_INNOVATION_SUMMARY.md # AI features
    └── QUICK_START.md           # This file
```

## 🎯 Key Features to Explore

### 1. Premium UI/UX
- Smooth Framer Motion animations
- Responsive design (try mobile view)
- Gradient backgrounds
- Hover effects on cards

### 2. AI Chatbot
- Click floating icon
- Ask about schools, admissions, courses
- See real-time responses

### 3. Alumni System
- Complete registration form
- Data stored in MongoDB
- School-specific tracking

### 4. MCP AI Tools (Advanced)
- Student profile analysis
- Admission prediction with XAI
- School recommendations
- Career path prediction
- Sentiment analysis
- Study plan generation

## 🔧 Common Issues & Solutions

### Issue 1: MongoDB Connection Error
```
Error: connect ECONNREFUSED 127.0.0.1:27017
```
**Solution**: Start MongoDB
```bash
# Windows
net start MongoDB

# Linux/Mac
sudo systemctl start mongod
```

### Issue 2: Port Already in Use
```
Error: Port 3000 is already in use
```
**Solution**: Kill the process or use different port
```bash
# Find and kill process
npx kill-port 3000

# Or use different port
PORT=3001 npm run dev
```

### Issue 3: MCP Server Not Loading
```
Error: Cannot find module '@modelcontextprotocol/sdk'
```
**Solution**: Install MCP dependencies
```bash
cd mcp-server
npm install
```

### Issue 4: Tiny LLM Loading Slow
**Expected**: First load downloads model (~2GB)
**Solution**: Be patient, subsequent loads are fast
**Alternative**: Use fallback mode (automatic)

## 📊 What's Working vs What Needs Setup

### ✅ Works Out of the Box
- Homepage with animations
- All navigation pages
- School information display
- Basic chatbot (rule-based)
- Alumni registration form
- Responsive design
- MCP server structure

### ⚙️ Needs Configuration
- MongoDB connection (local setup)
- School images (add to /public/images/)
- Email notifications (SMTP config)
- OpenAI API (optional, for advanced chatbot)
- Production deployment

### 🚀 Advanced Features (Optional)
- Tiny LLM (auto-downloads on first use)
- MCP tools (requires Kiro IDE)
- Predictive models (works with sample data)
- XAI visualizations (ready to use)

## 🎓 Next Steps

### For Development
1. ✅ Get basic site running (you're here!)
2. 📸 Add school images to `/public/images/`
3. 🎨 Customize colors in `tailwind.config.js`
4. 📝 Update school data in `data/schools-data.json`
5. 🤖 Test MCP tools in Kiro
6. 🚀 Deploy to production

### For Testing
1. Test all pages and navigation
2. Try chatbot with various questions
3. Submit alumni registration
4. Test on mobile devices
5. Check accessibility (keyboard navigation)
6. Test MCP tools (if using Kiro)

### For Production
1. Set up production MongoDB (MongoDB Atlas)
2. Configure environment variables
3. Add real school images
4. Set up email service
5. Deploy frontend (Vercel)
6. Deploy backend (Railway/Heroku)
7. Configure domain and SSL

## 📚 Learning Path

### Day 1: Basics
- Explore the website
- Understand project structure
- Test basic features

### Day 2: AI Features
- Read `AI_INNOVATION_SUMMARY.md`
- Test MCP tools
- Understand AI flow

### Day 3: Customization
- Update school data
- Customize styling
- Add images

### Day 4: Advanced
- Integrate with real data
- Configure email
- Set up analytics

### Day 5: Deployment
- Deploy to production
- Configure domain
- Monitor performance

## 🆘 Getting Help

### Documentation
- `README.md` - Project overview
- `SETUP.md` - Detailed setup
- `PROJECT_OVERVIEW.md` - Complete documentation
- `AI_INNOVATION_SUMMARY.md` - AI features explained
- `mcp-server/INTEGRATION_GUIDE.md` - MCP integration

### Support Channels
- Email: tech@gjtskarnataka.edu.in
- Check console logs for errors
- Review error messages carefully
- Search documentation

### Debug Mode

Enable detailed logging:

```bash
# Frontend
DEBUG=* npm run dev

# Backend
NODE_ENV=development npm run server

# MCP Server
DEBUG=mcp:* node mcp-server/index.js
```

## ✅ Success Checklist

Before considering setup complete:

- [ ] All dependencies installed
- [ ] MongoDB running
- [ ] Frontend loads at localhost:3000
- [ ] Backend running on port 5000
- [ ] All pages accessible
- [ ] Chatbot responds
- [ ] Alumni form submits
- [ ] No console errors
- [ ] Responsive on mobile
- [ ] MCP server initializes (if using Kiro)

## 🎉 You're Ready!

If all checks pass, you have successfully set up the GJTS Karnataka website with integrated AI!

**Next**: Explore the AI features in `AI_INNOVATION_SUMMARY.md`

---

**Questions?** Check the documentation or contact support.

**Happy Coding! 🚀**
