# 🚀 GJTS Karnataka - Quick Reference Card

## ✅ STATUS: RUNNING

```
Website: http://localhost:3000 ✅
Status: Compiled Successfully
Modules: 1311 loaded
```

## 🔗 Quick Links

| What | URL |
|------|-----|
| **Homepage** | http://localhost:3000 |
| **About** | http://localhost:3000/about |
| **Schools** | http://localhost:3000/schools |
| **Admissions** | http://localhost:3000/admissions |
| **Alumni** | http://localhost:3000/alumni |

## ⌨️ Quick Commands

```bash
# Stop server
Ctrl+C

# Restart server
npm run dev

# Start backend (optional)
npm run server

# Install dependencies
npm install

# Build for production
npm run build
```

## 📁 Quick File Locations

```
Homepage:     app/page.js
About:        app/about/page.js
Schools:      app/schools/page.js
Admissions:   app/admissions/page.js
Alumni:       app/alumni/page.js
Chatbot:      components/ChatBot.js
School Data:  data/schools-data.json
Colors:       tailwind.config.js
```

## 🎨 Quick Customization

### Change Primary Color
```javascript
// tailwind.config.js
primary: {
  500: '#0ea5e9',  // Change this
}
```

### Update School Info
```json
// data/schools-data.json
{
  "schools": [
    {
      "name": "GJTS Ballari",
      "students": 150,
      // ... edit here
    }
  ]
}
```

### Add School Images
```
Place in: public/images/
- ballari.jpg
- bhadravati.jpg
- hubballi.jpg
- bagalkot.jpg
- kalburgi.jpg
- mangalore.jpg
```

## 💬 Chatbot Test Questions

```
"What schools are available?"
"Tell me about admissions"
"What courses do you offer?"
"How do I apply?"
"What facilities are available?"
```

## 🐛 Quick Fixes

### Port in Use
```bash
npx kill-port 3000
npm run dev
```

### Clear Cache
```bash
rm -rf .next
npm run dev
```

### Reinstall Dependencies
```bash
rm -rf node_modules
npm install
```

## 📊 What's Working

✅ All pages and navigation
✅ Chatbot (rule-based)
✅ Animations and UI
✅ Responsive design
✅ School information
✅ Alumni form (UI)

## 📚 Documentation Files

- `🚀_START_HERE.md` - Start here!
- `✅_WEBSITE_READY.txt` - Success message
- `STATUS.md` - Current status
- `LOCALHOST_GUIDE.md` - Complete guide
- `QUICK_START.md` - 5-minute setup
- `AI_INNOVATION_SUMMARY.md` - AI features

## 🆘 Need Help?

1. Check `LOCALHOST_GUIDE.md`
2. Review error messages in terminal
3. Check browser console (F12)
4. Restart the server

## 🎯 Next Steps

1. ✅ Website is running
2. Open http://localhost:3000
3. Explore all pages
4. Test chatbot
5. Customize as needed

---

**Last Updated**: Just now
**Status**: ✅ Running Successfully
**URL**: http://localhost:3000
