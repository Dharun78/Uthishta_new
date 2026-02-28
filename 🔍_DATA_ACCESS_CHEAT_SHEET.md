# 🔍 MongoDB Atlas Data Access - Cheat Sheet

## 🚀 Fastest Way to View Your Data (30 Seconds)

1. Go to: **https://cloud.mongodb.com/**
2. Login with your account
3. Click **"Database"** (left sidebar)
4. Click **"Browse Collections"** button
5. Click **"gjts_karnataka"** database
6. Click any collection to view data

**Done! You're viewing your data!** ✅

---

## 📊 Your 5 Collections

```
gjts_karnataka/
├── schooladmins (7)    ← Admin login accounts
├── alumnis (120)       ← Alumni information
├── alumnifunds (36)    ← Donations with AI analysis
├── events (36)         ← School events
└── grants (5)          ← Available grants with AI
```

---

## 🎯 Quick Filters (Copy & Paste)

### Alumni Filters
```javascript
// All Ballari alumni
{ "school": "Ballari" }

// 2018 graduates
{ "graduationYear": 2018 }

// Software engineers
{ "currentOccupation": "Software Engineer" }

// TCS employees
{ "company": "TCS" }

// Bangalore residents
{ "location": "Bangalore" }
```

### Donation Filters
```javascript
// Ballari donations
{ "school": "Ballari" }

// Large donations (>₹10,000)
{ "amount": { "$gt": 10000 } }

// Infrastructure donations
{ "purpose": "infrastructure" }

// High engagement donors (>80)
{ "aiAnalysis.engagementScore": { "$gt": 80 } }
```

### Event Filters
```javascript
// Ballari events
{ "school": "Ballari" }

// Upcoming events
{ "status": "upcoming" }

// Alumni meets
{ "category": "alumni-meet" }
```

### Grant Filters
```javascript
// Government grants
{ "providerType": "government" }

// Technology grants
{ "category": "technology" }

// High eligibility (>90%)
{ "aiEligibilityScore": { "$gt": 90 } }

// Should apply
{ "aiRecommendation.shouldApply": true }
```

---

## 🖥️ Atlas Web Dashboard Navigation

```
Login → Database → Browse Collections → gjts_karnataka → [Collection]
```

**URL**: https://cloud.mongodb.com/

**What you can do:**
- ✅ View all documents
- ✅ Filter data
- ✅ Edit documents
- ✅ Delete documents
- ✅ Export data (JSON/CSV)
- ✅ Import data

---

## 💻 MongoDB Compass (Desktop App)

### Download
https://www.mongodb.com/try/download/compass

### Connection String
```
mongodb+srv://gjts_admin:YOUR_PASSWORD@gjts-karnataka.xxxxx.mongodb.net/gjts_karnataka
```

### Features
- ✅ Visual query builder
- ✅ Schema analysis
- ✅ Performance insights
- ✅ Aggregation pipeline
- ✅ Import/Export

---

## ⌨️ Command Line Queries (mongosh)

### Connect
```bash
mongosh "mongodb+srv://gjts_admin:PASSWORD@cluster.mongodb.net/gjts_karnataka"
```

### Basic Commands
```javascript
// Show collections
show collections

// Count documents
db.alumnis.countDocuments()        // 120
db.alumnifunds.countDocuments()    // 36
db.events.countDocuments()         // 36
db.grants.countDocuments()         // 5

// View all alumni
db.alumnis.find()

// View Ballari alumni
db.alumnis.find({ school: "Ballari" })

// View first 5 alumni
db.alumnis.find().limit(5)

// Count by school
db.alumnis.countDocuments({ school: "Ballari" })  // 20
```

---

## 📥 Export Data

### From Atlas Web
```
Browse Collections → Select Collection → Export Collection → Choose Format
```

### From Command Line
```bash
# Export as JSON
mongoexport --uri="CONNECTION_STRING" --collection=alumnis --out=alumnis.json

# Export as CSV
mongoexport --uri="CONNECTION_STRING" --collection=alumnis --type=csv --fields=name,email,school --out=alumnis.csv
```

---

## 📤 Import Data

### From Atlas Web
```
Browse Collections → Add Data → Import File → Choose File
```

### From Command Line
```bash
# Import JSON
mongoimport --uri="CONNECTION_STRING" --collection=alumnis --file=alumnis.json

# Import CSV
mongoimport --uri="CONNECTION_STRING" --collection=alumnis --type=csv --headerline --file=alumnis.csv
```

---

## 🔢 Useful Aggregations

### Total Donations by School
```javascript
db.alumnifunds.aggregate([
  { $group: {
    _id: "$school",
    total: { $sum: "$amount" },
    count: { $sum: 1 }
  }}
])
```

### Alumni Count by School
```javascript
db.alumnis.aggregate([
  { $group: {
    _id: "$school",
    count: { $sum: 1 }
  }}
])
```

### Average Donation Amount
```javascript
db.alumnifunds.aggregate([
  { $group: {
    _id: null,
    avgAmount: { $avg: "$amount" }
  }}
])
```

### Events by Category
```javascript
db.events.aggregate([
  { $group: {
    _id: "$category",
    count: { $sum: 1 }
  }}
])
```

---

## 🎨 Sample Documents

### Admin Account
```json
{
  "username": "admin_ballari",
  "school": "Ballari",
  "role": "school_admin",
  "fullName": "Ballari Admin"
}
```

### Alumni Record
```json
{
  "name": "Rajesh Kumar",
  "email": "rajesh@example.com",
  "school": "Ballari",
  "graduationYear": 2018,
  "course": "Electronics",
  "company": "TCS"
}
```

### Donation Record
```json
{
  "alumniName": "Rajesh Kumar",
  "school": "Ballari",
  "amount": 10000,
  "purpose": "infrastructure",
  "aiAnalysis": {
    "engagementScore": 75,
    "donorPattern": "occasional"
  }
}
```

### Event Record
```json
{
  "title": "Alumni Meet 2026 - Ballari",
  "school": "Ballari",
  "date": "2026-04-15",
  "category": "alumni-meet",
  "status": "upcoming"
}
```

### Grant Record
```json
{
  "title": "Digital India Initiative 2026",
  "grantProvider": "Ministry of Electronics",
  "aiEligibilityScore": 95,
  "aiRecommendation": {
    "shouldApply": true,
    "successProbability": 95
  }
}
```

---

## 🔐 Connection String Format

```
mongodb+srv://[username]:[password]@[cluster].mongodb.net/[database]?retryWrites=true&w=majority
```

**Your connection string:**
```
mongodb+srv://gjts_admin:YOUR_PASSWORD@gjts-karnataka.xxxxx.mongodb.net/gjts_karnataka?retryWrites=true&w=majority
```

**Get it from:**
Atlas Dashboard → Database → Connect → Connect your application

---

## 📊 Data Statistics

| Collection | Documents | Size | Purpose |
|------------|-----------|------|---------|
| schooladmins | 7 | ~7 KB | Admin accounts |
| alumnis | 120 | ~120 KB | Alumni info |
| alumnifunds | 36 | ~54 KB | Donations |
| events | 36 | ~54 KB | Events |
| grants | 5 | ~20 KB | Grants |
| **TOTAL** | **204** | **~255 KB** | **All data** |

**Free Tier**: 512 MB (524,288 KB)  
**Usage**: 0.05%  
**Remaining**: 99.95%

---

## 🎯 Common Tasks

### View All Alumni from One School
```
1. Browse Collections → alumnis
2. Filter: { "school": "Ballari" }
3. Click Apply
```

### Find Large Donations
```
1. Browse Collections → alumnifunds
2. Filter: { "amount": { "$gt": 10000 } }
3. Click Apply
```

### Check Upcoming Events
```
1. Browse Collections → events
2. Filter: { "status": "upcoming" }
3. Click Apply
```

### Find High-Eligibility Grants
```
1. Browse Collections → grants
2. Filter: { "aiEligibilityScore": { "$gt": 90 } }
3. Click Apply
```

---

## 🚨 Important Notes

### Security
- ⚠️ Don't share your connection string
- ⚠️ Don't commit .env file to Git
- ⚠️ Use strong passwords
- ⚠️ Restrict IP access in production

### Data Safety
- ⚠️ Be careful when editing documents
- ⚠️ Be careful when deleting documents
- ⚠️ Test queries before running on production
- ⚠️ Keep backups before major changes

### Performance
- ✅ Use filters to limit results
- ✅ Create indexes for frequent queries
- ✅ Use projections to select only needed fields
- ✅ Limit results with .limit()

---

## 📚 Full Documentation

For detailed guides, read:
- **👁️_HOW_TO_VIEW_DATA_IN_ATLAS.md** - Complete viewing guide
- **🌐_MONGODB_ATLAS_GUIDE.md** - Atlas setup guide
- **📊_DATA_STORAGE_SUMMARY.md** - Data details

---

## ⚡ Quick Links

- **Atlas Dashboard**: https://cloud.mongodb.com/
- **Compass Download**: https://www.mongodb.com/try/download/compass
- **mongosh Download**: https://www.mongodb.com/try/download/shell
- **Atlas Docs**: https://docs.atlas.mongodb.com/

---

## ✅ Quick Checklist

To view your data right now:

- [ ] Go to https://cloud.mongodb.com/
- [ ] Login
- [ ] Click "Database"
- [ ] Click "Browse Collections"
- [ ] Click "gjts_karnataka"
- [ ] Click any collection
- [ ] View your data!

**Time needed: 30 seconds** ⚡

---

Built with ❤️ for GJTS Karnataka  
**Quick Reference**: Fast, Easy, Powerful 🔍
