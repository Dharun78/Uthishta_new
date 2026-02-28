# 🎯 GJTS Karnataka Website - Quick Start

## Your Website is Ready! Follow These 3 Steps:

---

## Step 1: Install MongoDB (If Not Installed)

### Check if MongoDB is Installed
Open PowerShell and run:
```powershell
Get-Service MongoDB
```

### If MongoDB is NOT Installed:
1. Download MongoDB Community Server from:
   https://www.mongodb.com/try/download/community

2. Install with default settings

3. MongoDB will start automatically as a Windows service

---

## Step 2: Seed the Database

Open a terminal in the `gjts-karnataka-website` folder and run:

```bash
node scripts/seed-database.js
```

**You should see:**
```
✅ Connected to MongoDB
🗑️  Cleared existing data
📝 Seeding Admins...
✅ Created 7 admin accounts
👥 Seeding Alumni...
✅ Created 120 alumni records
💰 Seeding Alumni Funds...
✅ Created 36 fund records
📅 Seeding Events...
✅ Created 36 events
🎯 Seeding Grants...
✅ Created 5 grants
🎉 DATABASE SEEDING COMPLETED!
```

---

## Step 3: Access Your Website

The development server is already running!

### Public Pages (No Login Required)
- **Homepage**: http://localhost:3000
- **About**: http://localhost:3000/about
- **Schools**: http://localhost:3000/schools
- **Admissions**: http://localhost:3000/admissions
- **Alumni**: http://localhost:3000/alumni

### Admin Dashboard (Login Required)
- **Login Page**: http://localhost:3000/dashboard/login

---

## 🔐 Login Credentials

### Super Admin (Can Access All Schools)
```
Username: superadmin
Password: super123
```

### School Admins (Can Access Own School Only)
```
Ballari:    admin_ballari    / ballari123
Bhadravati: admin_bhadravati / bhadravati123
Hubballi:   admin_hubballi   / hubballi123
Bagalkot:   admin_bagalkot   / bagalkot123
Kalburgi:   admin_kalburgi   / kalburgi123
Mangalore:  admin_mangalore  / mangalore123
```

---

## 🎨 What You Can Do

### After Logging In:

1. **Dashboard Home**
   - View statistics
   - See recent events
   - Quick actions

2. **Fund Management** (Click "Funds" tab)
   - View total funds raised
   - See donor statistics
   - Get AI insights and recommendations
   - Track monthly trends
   - View top donors

3. **Grant Discovery** (Click "Grants" tab)
   - Chat with AI agent
   - Search for grants
   - Check eligibility
   - View grant details
   - Get AI recommendations

4. **Event Management**
   - Create new events
   - View upcoming events
   - Manage registrations

---

## 🤖 Try the AI Features

### AI Fund Manager
1. Login to dashboard
2. Click "Funds" tab
3. See AI-generated insights about donations
4. View donor patterns and engagement scores

### AI Grant Discovery Agent
1. Login to dashboard
2. Click "Grants" tab
3. Try these commands:
   - "Search for technology grants"
   - "Find infrastructure grants"
   - "Check eligibility"
   - "Show education grants"

---

## ⚠️ Troubleshooting

### Problem: MongoDB Connection Error

**Solution:**
```powershell
# Check if MongoDB is running
Get-Service MongoDB

# If not running, start it:
net start MongoDB
```

### Problem: No Data in Dashboard

**Solution:**
```bash
# Re-seed the database
node scripts/seed-database.js
```

### Problem: Login Not Working

**Solution:**
1. Make sure database is seeded
2. Clear browser cache (Ctrl+Shift+Delete)
3. Try logging in again

### Problem: Grants Chatbot Error

**Solution:**
1. Ensure database is seeded with grants
2. Logout and login again
3. Try a simple query like "search for grants"

---

## 📊 What's in the Database

After seeding, you'll have:

- **7 Admin Accounts** (1 Super Admin + 6 School Admins)
- **120 Alumni Records** (20 per school)
- **~36 Donations** (with AI analysis)
- **36 Events** (6 per school)
- **5 Grants** (government and corporate)

**Total: ~200 documents**

---

## 🚀 Next Steps

1. ✅ **Explore the Dashboard**
   - Login as Super Admin
   - Check fund management
   - Try the grants chatbot

2. ✅ **Test School-Specific Access**
   - Logout
   - Login as a school admin (e.g., admin_ballari)
   - Notice you only see Ballari data

3. ✅ **Customize Content**
   - Update school information
   - Add real alumni data
   - Create actual events

4. ✅ **Deploy to Production**
   - See `AWS_DEPLOYMENT_GUIDE.md`
   - Configure production environment
   - Set up MongoDB Atlas

---

## 📁 Important Files

- `✅_SYSTEM_STATUS.md` - Complete system documentation
- `AWS_DEPLOYMENT_GUIDE.md` - Deployment instructions
- `.env` - Environment configuration
- `scripts/seed-database.js` - Database seeding script

---

## 🎉 You're All Set!

Your website is fully functional with:
- ✅ Premium UI/UX with animations
- ✅ Secure authentication
- ✅ AI-powered features
- ✅ MongoDB backend
- ✅ Sample data for testing
- ✅ Production-ready

**Start exploring!** 🚀

---

## 💡 Quick Commands

```bash
# Seed database
node scripts/seed-database.js

# Check database status
node scripts/check-database.js

# Start development server (if not running)
npm run dev

# Build for production
npm run build
```

---

## 📞 Need Help?

1. Check `✅_SYSTEM_STATUS.md` for detailed documentation
2. Review troubleshooting section above
3. Ensure MongoDB is running
4. Make sure database is seeded

---

Built with ❤️ for GJTS Karnataka
