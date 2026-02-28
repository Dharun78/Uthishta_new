# 🚀 Quick Start: CMS and Grants System

## ⚡ 3-Minute Setup

### Step 1: Ensure MongoDB is Running
1. Go to MongoDB Atlas: https://cloud.mongodb.com
2. Login with your credentials
3. Check if cluster is running (green status)
4. If paused, click "Resume" button

### Step 2: Seed the Grants Database
```bash
cd gjts-karnataka-website
npm start
```

Then in another terminal:
```bash
cd gjts-karnataka-website/scripts
node verify-and-seed-grants.js
```

This will:
- Connect to MongoDB
- Clear old grants (if any)
- Insert 10 real government grants
- Show summary of grants by category

### Step 3: Test the System

#### Test CMS (School Admin):
1. Go to: http://localhost:3000/dashboard/login
2. Login as Hubballi admin:
   - Username: `hubballi`
   - Password: `hubballi123`
3. Click "Content" tab
4. Edit your school's information
5. Add a facility, achievement, or course
6. Click "Save Changes"
7. ✅ Success message should appear

#### Test CMS (Super Admin):
1. Logout and login as super admin:
   - Username: `super`
   - Password: `super123`
2. Click "Content" tab
3. Select different schools from dropdown
4. Edit any school's content
5. Click "Settings" tab
6. Edit general site settings
7. Add an announcement
8. Click "Save Changes"
9. ✅ Success message should appear

#### Test Grants System:
1. Login as any school admin (e.g., Hubballi)
2. Click "Grants" tab
3. In the chat, type: "Search for grants"
4. ✅ AI should respond with 10 grants
5. Click on any grant to see details
6. Type: "Check eligibility"
7. ✅ AI should show eligibility analysis

---

## 🎯 What You Can Do Now

### School Admins Can:
- ✅ Edit their school's description, vision, mission
- ✅ Add/remove/edit facilities
- ✅ Add/remove/edit achievements with years
- ✅ Add/remove/edit courses with duration
- ✅ Update contact information
- ✅ Add social media links
- ✅ Upload banner image URL
- ✅ Search for government grants
- ✅ Check grant eligibility
- ✅ View grant details and recommendations

### Super Admin Can:
- ✅ Everything school admins can do
- ✅ Edit ANY school's content (select from dropdown)
- ✅ Edit general site settings
- ✅ Manage site-wide announcements
- ✅ Update global contact information
- ✅ Control social media links
- ✅ View grants for all schools or specific school

---

## 📊 Grant Categories Available

1. **Education** (3 grants)
   - PM-SETU: ₹50L - ₹2Cr
   - NEP 2020: ₹40L - ₹1.8Cr
   - Industry-Academia: ₹20L - ₹70L

2. **Infrastructure** (4 grants)
   - Karnataka School: ₹30L - ₹1.5Cr
   - Swachh Vidyalaya: ₹15L - ₹50L
   - Green Campus: ₹18L - ₹60L
   - Khelo India: ₹22L - ₹90L

3. **Technology** (2 grants)
   - AICTE MODROBS: ₹20L - ₹1Cr
   - Digital India: ₹25L - ₹80L

4. **Skill Development** (1 grant)
   - Skill India: ₹35L - ₹1.2Cr

**Total Funding Available**: ₹1.83 Cr to ₹11.20 Cr

---

## 💬 AI Grant Agent Commands

Try these in the Grants page chat:

### Search Commands:
- "Search for grants"
- "Find education grants"
- "Show technology grants"
- "Look for infrastructure grants"
- "Find all available grants"

### Eligibility Commands:
- "Check eligibility"
- "Am I eligible?"
- "Can I apply for this grant?"
- "What are my chances?"

### General Commands:
- "Help"
- "What can you do?"
- "Show me options"

---

## 🔧 Troubleshooting

### Grants Not Showing?
1. Check MongoDB is running
2. Run seeding script: `node scripts/verify-and-seed-grants.js`
3. Refresh the page
4. Check browser console for errors

### Can't Save Content?
1. Check you're logged in
2. Verify you have permission (school admin can only edit their school)
3. Check all required fields are filled
4. Check browser console for errors

### AI Agent Not Responding?
1. Check MongoDB connection
2. Verify grants are seeded
3. Check browser console for API errors
4. Try refreshing the page

### Settings Page Not Accessible?
1. Verify you're logged in as super admin
2. Username must be `super`
3. School admins cannot access Settings page

---

## 📝 Quick Reference

### Login Credentials:
```
Super Admin:
- Username: super
- Password: super123

School Admins:
- Username: [schoolname] (e.g., hubballi)
- Password: [schoolname]123 (e.g., hubballi123)

Schools: Ballari, Bhadravati, Hubballi, Bagalkot, Kalburgi, Mangalore
```

### Important URLs:
```
Dashboard Login: http://localhost:3000/dashboard/login
Main Dashboard: http://localhost:3000/dashboard
Content Management: http://localhost:3000/dashboard/content
General Settings: http://localhost:3000/dashboard/settings
Grants System: http://localhost:3000/dashboard/grants
Alumni Management: http://localhost:3000/dashboard/alumni
Funds Tracking: http://localhost:3000/dashboard/funds
```

### API Endpoints:
```
GET/PUT /api/dashboard/content - School content
GET/PUT /api/dashboard/settings - General settings
GET /api/dashboard/grants - List grants
POST /api/dashboard/grants/agent - AI grant agent
```

---

## ✅ Verification Checklist

After setup, verify these work:

### CMS:
- [ ] School admin can login
- [ ] Content page loads
- [ ] Can edit description
- [ ] Can add facility
- [ ] Can add achievement
- [ ] Can add course
- [ ] Save button works
- [ ] Success message appears
- [ ] Super admin can select schools
- [ ] Settings page works (super admin)

### Grants:
- [ ] Grants page loads
- [ ] AI chat interface appears
- [ ] Can send messages
- [ ] "Search for grants" works
- [ ] 10 grants appear
- [ ] Can click on grants
- [ ] Grant details modal opens
- [ ] Eligibility check works
- [ ] School filter works (super admin)

---

## 🎉 You're All Set!

The CMS and Grants system is now fully functional. You can:

1. **Manage Content** - Edit school information, add facilities, achievements, courses
2. **Control Settings** - Update site-wide settings and announcements (super admin)
3. **Discover Grants** - Search for 10 real government grants worth ₹1.83 Cr to ₹11.20 Cr
4. **Check Eligibility** - Get AI-powered eligibility analysis for each grant
5. **Track Applications** - View grant details, deadlines, and requirements

---

## 📞 Need Help?

If you encounter any issues:

1. Check MongoDB Atlas is running
2. Verify grants are seeded
3. Check browser console for errors
4. Verify login credentials
5. Ensure you have proper permissions

---

**Happy Managing! 🚀**

*Last Updated: February 27, 2026*
