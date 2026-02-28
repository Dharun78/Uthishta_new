# 🚀 GJTS Karnataka Website - Localhost Guide

## ✅ Your Website is Now Running!

### 🌐 Access the Website

**Frontend (Website):**
- URL: **http://localhost:3000**
- Status: ✅ Running

**Backend (API Server):**
- URL: **http://localhost:5000**
- Status: ⚠️ Not started yet (optional)

**MCP Server (AI Features):**
- Status: ⚠️ Not started yet (optional)

---

## 📱 What You Can Do Now

### 1. Open the Website
Open your browser and go to: **http://localhost:3000**

You should see:
- ✨ Beautiful homepage with animations
- 🏫 Six school cards (Ballari, Bhadravati, Hubballi, Bagalkot, Kalburgi, Mangalore)
- 💬 Floating chatbot icon (bottom-right)
- 📱 Fully responsive design

### 2. Explore the Pages

**Navigation Menu:**
- **Home** - Main landing page with school overview
- **About** - Mission, vision, and partnership info
- **Schools** - Detailed information about all 6 schools
- **Admissions** - Admission process and requirements
- **Alumni** - Alumni registration form
- **Contact** - Contact information

### 3. Test the Chatbot

1. Click the floating chat icon (bottom-right corner)
2. Try these questions:
   - "What schools are available?"
   - "Tell me about admissions"
   - "What courses do you offer?"
   - "How do I apply?"

### 4. Try Alumni Registration

1. Go to **Alumni** page
2. Fill out the registration form
3. Submit (Note: Backend server needed for database storage)

---

## 🔧 Starting Additional Services

### Start Backend Server (For Alumni Registration)

**Option 1: Using Batch File**
```bash
# Double-click this file:
START_BACKEND.bat
```

**Option 2: Using Command Line**
```bash
cd gjts-karnataka-website
npm run server
```

Backend will run on: **http://localhost:5000**

**Note:** You need MongoDB installed and running for the backend to work.

### Start MongoDB (If Installed)

**Windows:**
```bash
net start MongoDB
```

**Or use MongoDB Compass** (GUI application)

### Start MCP Server (For Advanced AI Features)

```bash
cd gjts-karnataka-website/mcp-server
npm install
npm start
```

---

## 🎨 Customization Tips

### 1. Change Colors

Edit `tailwind.config.js`:
```javascript
colors: {
  primary: {
    500: '#0ea5e9',  // Change this to your color
    600: '#0284c7',
  },
}
```

### 2. Add School Images

Place images in `public/images/`:
- `ballari.jpg`
- `bhadravati.jpg`
- `hubballi.jpg`
- `bagalkot.jpg`
- `kalburgi.jpg`
- `mangalore.jpg`

### 3. Update School Information

Edit `data/schools-data.json` to update:
- School details
- Courses offered
- Contact information
- Facilities

### 4. Customize Content

Edit page files in `app/` folder:
- `app/page.js` - Homepage
- `app/about/page.js` - About page
- `app/schools/page.js` - Schools page
- etc.

---

## 🐛 Troubleshooting

### Issue: Port 3000 Already in Use

**Solution:**
```bash
# Kill the process using port 3000
npx kill-port 3000

# Or use a different port
PORT=3001 npm run dev
```

### Issue: Page Not Loading

**Check:**
1. Is the terminal showing "Ready in X.Xs"?
2. Any error messages in the terminal?
3. Try refreshing the browser (Ctrl+F5)

### Issue: Styles Not Showing

**Solution:**
```bash
# Clear Next.js cache
rm -rf .next
npm run dev
```

### Issue: Chatbot Not Responding

**Check:**
1. Open browser console (F12)
2. Look for any errors
3. The basic chatbot works without backend
4. For AI features, MCP server is needed

---

## 📊 What's Working vs What Needs Setup

### ✅ Working Now (No Additional Setup)
- Homepage with animations
- All navigation pages
- School information display
- Basic chatbot (rule-based)
- Responsive design
- All UI/UX features

### ⚙️ Needs Backend Server
- Alumni registration (database storage)
- Alumni data retrieval
- Statistics dashboard

### 🤖 Needs MCP Server
- AI-powered student counseling
- Admission prediction with XAI
- Career path prediction
- Sentiment analysis
- RAG-powered contextual chat
- Personalized study plans

### 🗄️ Needs MongoDB
- Alumni data storage
- User authentication (future)
- Analytics data (future)

---

## 🚀 Quick Commands Reference

### Start Website
```bash
npm run dev
```
Access at: http://localhost:3000

### Start Backend
```bash
npm run server
```
Access at: http://localhost:5000

### Start MCP Server
```bash
cd mcp-server
npm start
```

### Install Dependencies
```bash
npm install
```

### Build for Production
```bash
npm run build
npm start
```

---

## 📱 Testing on Mobile

### Option 1: Same Network
1. Find your computer's IP address:
   ```bash
   ipconfig
   ```
2. Look for "IPv4 Address" (e.g., 192.168.1.100)
3. On mobile, visit: `http://192.168.1.100:3000`

### Option 2: Use ngrok (Expose to Internet)
```bash
# Install ngrok
npm install -g ngrok

# Expose localhost
ngrok http 3000
```

---

## 🎯 Next Steps

### Immediate
1. ✅ Explore all pages
2. ✅ Test chatbot
3. ✅ Try on mobile
4. ✅ Customize colors/content

### Short Term
1. Add school images
2. Update school data
3. Set up MongoDB
4. Start backend server
5. Test alumni registration

### Advanced
1. Set up MCP server
2. Test AI features
3. Configure email notifications
4. Add analytics
5. Deploy to production

---

## 📞 Need Help?

### Documentation
- `README.md` - Project overview
- `QUICK_START.md` - 5-minute setup
- `SETUP.md` - Detailed setup
- `AI_INNOVATION_SUMMARY.md` - AI features

### Common Questions

**Q: Can I use this without MongoDB?**
A: Yes! The website works fully without MongoDB. You only need it for alumni registration storage.

**Q: Do I need the MCP server?**
A: No, it's optional. The basic chatbot works without it. MCP provides advanced AI features.

**Q: How do I stop the server?**
A: Press `Ctrl+C` in the terminal where it's running.

**Q: Can I edit files while server is running?**
A: Yes! Next.js has hot reload - changes appear automatically.

---

## 🎉 Enjoy Your Website!

Your GJTS Karnataka website is now running locally with:
- ✨ Premium UI/UX
- 🏫 Complete school information
- 💬 AI chatbot
- 📱 Mobile responsive design
- 🚀 Ready for customization

**Access it now at: http://localhost:3000**

---

## 📄 File Structure Quick Reference

```
gjts-karnataka-website/
├── app/                    # Website pages
│   ├── page.js            # Homepage
│   ├── about/             # About page
│   ├── schools/           # Schools page
│   ├── admissions/        # Admissions page
│   └── alumni/            # Alumni page
├── components/            # Reusable components
├── data/                  # School data
├── mcp-server/           # AI features
├── server/               # Backend API
└── public/               # Static files (images)
```

---

**Built with ❤️ for Karnataka's future engineers**
