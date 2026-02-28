# 🎴 Quick Reference Card

## 🔐 Login Credentials

```
SUPER ADMIN:
Username: super
Password: super123

SCHOOL ADMINS:
ballari    / ballari123
bhadravati / bhadravati123
hubballi   / hubballi123
bagalkot   / bagalkot123
kalburgi   / kalburgi123
mangalore  / mangalore123
```

## 🌐 Important URLs

```
Dashboard Login:  /dashboard/login
Main Dashboard:   /dashboard
Content Editor:   /dashboard/content
General Settings: /dashboard/settings
Grants System:    /dashboard/grants
Alumni Manager:   /dashboard/alumni
Funds Tracker:    /dashboard/funds
```

## 💬 AI Grant Agent Commands

```
SEARCH:
"Search for grants"
"Find education grants"
"Show technology grants"

ELIGIBILITY:
"Check eligibility"
"Am I eligible?"
"What are my chances?"
```

## 📊 Available Grants

```
1. PM-SETU              ₹50L-₹2Cr    92%  Education
2. Karnataka Infra      ₹30L-₹1.5Cr  88%  Infrastructure
3. AICTE MODROBS        ₹20L-₹1Cr    75%  Technology
4. NEP 2020             ₹40L-₹1.8Cr  90%  Education
5. Skill India          ₹35L-₹1.2Cr  86%  Skill Dev
6. Digital India        ₹25L-₹80L    84%  Technology
7. Swachh Vidyalaya     ₹15L-₹50L    80%  Infrastructure
8. Industry-Academia    ₹20L-₹70L    87%  Education
9. Green Campus         ₹18L-₹60L    78%  Infrastructure
10. Khelo India         ₹22L-₹90L    70%  Infrastructure

TOTAL: ₹1.83 Cr to ₹11.20 Cr
```

## 🎯 CMS Features

```
SCHOOL ADMINS CAN EDIT:
✅ Description, Vision, Mission
✅ Facilities (add/remove)
✅ Achievements (add/remove)
✅ Courses (add/remove)
✅ Contact Information
✅ Social Media Links
✅ Banner Image

SUPER ADMIN CAN ALSO:
✅ Edit ANY school (select from dropdown)
✅ Access General Settings
✅ Manage Announcements
✅ Update Site-wide Info
```

## 🔧 Troubleshooting

```
GRANTS NOT SHOWING?
→ Run: node scripts/verify-and-seed-grants.js

CAN'T SAVE CONTENT?
→ Check you're logged in
→ Verify permissions

SETTINGS NOT ACCESSIBLE?
→ Must be super admin (username: super)

AI AGENT NOT RESPONDING?
→ Check MongoDB connection
→ Verify grants are seeded
```

## 📈 System Stats

```
Schools:     6
Admins:      7 (1 super + 6 school)
Alumni:      300
Donations:   104 (₹55.7L)
Grants:      10 (₹1.83Cr-₹11.2Cr)
Events:      Unlimited
```

## 🚀 Quick Start

```bash
# 1. Start server
npm start

# 2. Seed grants
cd scripts
node verify-and-seed-grants.js

# 3. Login
http://localhost:3000/dashboard/login

# 4. Test grants
Go to Grants → Type "Search for grants"

# 5. Test CMS
Go to Content → Edit info → Save
```

## ✅ Feature Checklist

```
✅ Authentication & Authorization
✅ Dashboard with Statistics
✅ Events Management
✅ Funds Tracking (Export CSV)
✅ Grants Discovery (AI Agent)
✅ Alumni Management (Export CSV)
✅ Content Management (NEW)
✅ General Settings (NEW)
✅ Role-Based Permissions
✅ School Filtering
✅ Email Notifications
✅ Chatbot
✅ Public Pages
```

## 📞 Quick Help

```
MONGODB PAUSED?
→ Go to MongoDB Atlas
→ Click "Resume" on cluster

FORGOT PASSWORD?
→ Check 🔑_LOGIN_CREDENTIALS.md

NEED FULL DOCS?
→ Read 🎯_FINAL_STATUS_REPORT.md

WANT QUICK START?
→ Read 🚀_QUICK_START_CMS_AND_GRANTS.md
```

---

**Print this card for quick reference!** 📋
