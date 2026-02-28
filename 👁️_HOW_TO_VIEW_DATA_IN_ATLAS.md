# 👁️ How to Access & View Data in MongoDB Atlas

## 3 Ways to Access Your Data

1. **MongoDB Atlas Web Dashboard** (Easiest - Visual Interface)
2. **MongoDB Compass** (Desktop App - Advanced)
3. **Command Line** (mongosh - For Developers)

---

## Method 1: MongoDB Atlas Web Dashboard (Recommended)

### Step 1: Login to MongoDB Atlas

1. Go to: https://cloud.mongodb.com/
2. Login with your account credentials
3. You'll see your dashboard

**Screenshot locations:**
```
┌─────────────────────────────────────┐
│  MongoDB Atlas                      │
│  ┌─────────────────────────────┐   │
│  │ Organizations               │   │
│  │ Projects                    │   │
│  │ ├─ gjts-karnataka          │   │
│  │    └─ Clusters             │   │
│  │       └─ gjts-karnataka    │   │
│  └─────────────────────────────┘   │
└─────────────────────────────────────┘
```

---

### Step 2: Navigate to Your Cluster

1. Click on **"Database"** in the left sidebar
2. You'll see your cluster: **gjts-karnataka**
3. Click the **"Browse Collections"** button

```
┌─────────────────────────────────────────────┐
│  Database Deployments                       │
│  ┌───────────────────────────────────────┐ │
│  │ gjts-karnataka                        │ │
│  │ M0 Sandbox • Mumbai                   │ │
│  │                                       │ │
│  │ [Connect] [Browse Collections] [...]  │ │
│  └───────────────────────────────────────┘ │
└─────────────────────────────────────────────┘
```

---

### Step 3: View Your Database

After clicking "Browse Collections", you'll see:

```
┌─────────────────────────────────────────────────────┐
│  Collections                                        │
│  ┌─────────────────────────────────────────────┐   │
│  │ Databases                                   │   │
│  │ ├─ admin                                    │   │
│  │ ├─ local                                    │   │
│  │ └─ gjts_karnataka ◄── YOUR DATABASE        │   │
│  │    ├─ schooladmins (7)                      │   │
│  │    ├─ alumnis (120)                         │   │
│  │    ├─ alumnifunds (36)                      │   │
│  │    ├─ events (36)                           │   │
│  │    └─ grants (5)                            │   │
│  └─────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────┘
```

---

### Step 4: View Collection Data

Click on any collection to see its documents:

#### Example: Viewing Alumni Data

1. Click **"alumnis"** collection
2. You'll see all 120 alumni records

```
┌──────────────────────────────────────────────────────────┐
│  gjts_karnataka > alumnis                                │
│  ┌────────────────────────────────────────────────────┐  │
│  │ Document 1 of 120                                  │  │
│  │ {                                                  │  │
│  │   "_id": ObjectId("..."),                         │  │
│  │   "name": "Ballari Alumni 1",                     │  │
│  │   "email": "alumni1@ballari.com",                 │  │
│  │   "phone": "+91-9123456789",                      │  │
│  │   "school": "Ballari",                            │  │
│  │   "graduationYear": 2018,                         │  │
│  │   "course": "Electronics",                        │  │
│  │   "currentOccupation": "Software Engineer",       │  │
│  │   "company": "TCS",                               │  │
│  │   "location": "Bangalore",                        │  │
│  │   "isActive": true,                               │  │
│  │   "createdAt": "2025-08-15T..."                   │  │
│  │ }                                                  │  │
│  └────────────────────────────────────────────────────┘  │
│  [Previous] [Next] [Edit] [Delete] [Clone]              │
└──────────────────────────────────────────────────────────┘
```

---

### Step 5: Navigate Through Documents

Use the navigation buttons:
- **Next** - View next document
- **Previous** - View previous document
- **Edit** - Modify document (be careful!)
- **Delete** - Remove document (be careful!)
- **Clone** - Duplicate document

---

### Step 6: Filter & Search Data

You can filter data using MongoDB queries:

#### Example: Find all alumni from Ballari
```javascript
{ "school": "Ballari" }
```

#### Example: Find alumni who graduated in 2018
```javascript
{ "graduationYear": 2018 }
```

#### Example: Find software engineers
```javascript
{ "currentOccupation": "Software Engineer" }
```

**How to use filters:**
1. Click the **"Filter"** button at the top
2. Enter your query in JSON format
3. Click **"Apply"**

```
┌──────────────────────────────────────────────┐
│  Filter                                      │
│  ┌────────────────────────────────────────┐ │
│  │ { "school": "Ballari" }                │ │
│  └────────────────────────────────────────┘ │
│  [Apply] [Clear]                             │
└──────────────────────────────────────────────┘
```

---

## Viewing Each Collection

### 1. SchoolAdmin Collection (7 documents)

**What you'll see:**
```json
{
  "_id": ObjectId("..."),
  "username": "superadmin",
  "email": "superadmin@gjts-karnataka.edu.in",
  "password": "$2a$10$...", // Encrypted
  "school": "All",
  "schoolId": "GJTS-SUPER-000",
  "role": "super_admin",
  "fullName": "Super Administrator",
  "phone": "+91-9876543210",
  "isActive": true,
  "permissions": {
    "canEditAllSchools": true,
    "canEditOwnSchool": true,
    "canViewReports": true,
    "canManageFunds": true,
    "canManageGrants": true,
    "canManageEvents": true,
    "canManageAlumni": true
  },
  "createdAt": "2026-02-26T..."
}
```

**Useful filters:**
- All super admins: `{ "role": "super_admin" }`
- All school admins: `{ "role": "school_admin" }`
- Ballari admin: `{ "school": "Ballari" }`

---

### 2. Alumni Collection (120 documents)

**What you'll see:**
```json
{
  "_id": ObjectId("..."),
  "name": "Rajesh Kumar",
  "email": "rajesh@example.com",
  "phone": "+91-9123456789",
  "school": "Ballari",
  "graduationYear": 2018,
  "course": "Electronics",
  "currentOccupation": "Software Engineer",
  "company": "TCS",
  "location": "Bangalore",
  "linkedIn": "https://linkedin.com/in/rajesh",
  "isActive": true,
  "createdAt": "2025-08-15T..."
}
```

**Useful filters:**
- Ballari alumni: `{ "school": "Ballari" }`
- 2018 graduates: `{ "graduationYear": 2018 }`
- Software engineers: `{ "currentOccupation": "Software Engineer" }`
- TCS employees: `{ "company": "TCS" }`
- Bangalore residents: `{ "location": "Bangalore" }`

---

### 3. AlumniFund Collection (36 documents)

**What you'll see:**
```json
{
  "_id": ObjectId("..."),
  "alumniId": ObjectId("..."),
  "alumniName": "Rajesh Kumar",
  "alumniEmail": "rajesh@example.com",
  "school": "Ballari",
  "amount": 10000,
  "currency": "INR",
  "donationType": "one-time",
  "purpose": "infrastructure",
  "paymentMethod": "upi",
  "transactionId": "TXN1234567890",
  "status": "completed",
  "receiptNumber": "GJTS-BAL-2026-0001",
  "taxDeductible": true,
  "notes": "Thank you for your contribution!",
  "aiAnalysis": {
    "donorPattern": "occasional",
    "engagementScore": 75,
    "recommendations": [
      "Send thank you email",
      "Share impact report"
    ]
  },
  "createdAt": "2025-12-10T...",
  "updatedAt": "2025-12-10T..."
}
```

**Useful filters:**
- Ballari donations: `{ "school": "Ballari" }`
- Large donations (>₹10,000): `{ "amount": { "$gt": 10000 } }`
- Infrastructure donations: `{ "purpose": "infrastructure" }`
- Completed donations: `{ "status": "completed" }`
- High engagement donors: `{ "aiAnalysis.engagementScore": { "$gt": 80 } }`

---

### 4. Event Collection (36 documents)

**What you'll see:**
```json
{
  "_id": ObjectId("..."),
  "title": "Alumni Meet 2026 - Ballari",
  "description": "Annual alumni gathering and networking event",
  "school": "Ballari",
  "date": "2026-04-15T10:00:00.000Z",
  "time": "10:00 AM",
  "venue": "Ballari Campus",
  "category": "alumni-meet",
  "targetAudience": ["students", "alumni", "faculty"],
  "maxAttendees": 150,
  "registeredCount": 25,
  "status": "upcoming",
  "organizer": "Ballari Admin",
  "contactEmail": "admin@gjts-ballari.edu.in",
  "contactPhone": "+91-9876543210",
  "imageUrl": "/images/events/alumni-meet.jpg",
  "createdBy": "admin_ballari",
  "createdAt": "2026-02-26T...",
  "updatedAt": "2026-02-26T..."
}
```

**Useful filters:**
- Ballari events: `{ "school": "Ballari" }`
- Upcoming events: `{ "status": "upcoming" }`
- Alumni meets: `{ "category": "alumni-meet" }`
- Events in April: `{ "date": { "$gte": "2026-04-01", "$lt": "2026-05-01" } }`

---

### 5. Grant Collection (5 documents)

**What you'll see:**
```json
{
  "_id": ObjectId("..."),
  "title": "Digital India Initiative - School Technology Grant 2026",
  "description": "Government grant for upgrading school technology...",
  "grantProvider": "Ministry of Electronics and IT",
  "providerType": "government",
  "amount": {
    "min": 500000,
    "max": 2000000,
    "currency": "INR"
  },
  "eligibilityCriteria": [
    { "criterion": "Government-recognized institution", "met": true },
    { "criterion": "Technical/vocational focus", "met": true },
    { "criterion": "Student strength > 100", "met": true }
  ],
  "applicationDeadline": "2026-06-30T...",
  "grantUrl": "https://digitalindia.gov.in/grants",
  "applicationUrl": "https://digitalindia.gov.in/apply",
  "category": "technology",
  "targetBeneficiaries": ["government schools", "technical schools"],
  "aiEligibilityScore": 95,
  "aiRecommendation": {
    "shouldApply": true,
    "reasoning": "Excellent match! You meet 3/3 criteria...",
    "successProbability": 95,
    "requiredDocuments": [
      "School registration",
      "Financial statements",
      "Project proposal"
    ],
    "estimatedEffort": "Low - straightforward application"
  },
  "applicableSchools": [
    "Ballari", "Bhadravati", "Hubballi", 
    "Bagalkot", "Kalburgi", "Mangalore"
  ],
  "status": "discovered",
  "discoveredBy": "ai-agent",
  "discoveredAt": "2026-02-26T...",
  "lastUpdated": "2026-02-26T..."
}
```

**Useful filters:**
- Government grants: `{ "providerType": "government" }`
- Technology grants: `{ "category": "technology" }`
- High eligibility (>90%): `{ "aiEligibilityScore": { "$gt": 90 } }`
- Should apply: `{ "aiRecommendation.shouldApply": true }`

---

## Method 2: MongoDB Compass (Desktop App)

### What is MongoDB Compass?
A free desktop application with a beautiful GUI for MongoDB.

### Step 1: Download & Install

1. Go to: https://www.mongodb.com/try/download/compass
2. Download for Windows
3. Install (no configuration needed)

### Step 2: Connect to Atlas

1. Open MongoDB Compass
2. Click **"New Connection"**
3. Paste your connection string:
   ```
   mongodb+srv://gjts_admin:YOUR_PASSWORD@gjts-karnataka.xxxxx.mongodb.net/gjts_karnataka
   ```
4. Click **"Connect"**

### Step 3: Browse Data

You'll see a visual interface similar to Atlas web dashboard but with more features:

**Features:**
- ✅ Visual query builder
- ✅ Schema analysis
- ✅ Index management
- ✅ Query performance analysis
- ✅ Import/Export data
- ✅ Aggregation pipeline builder

---

## Method 3: Command Line (mongosh)

### What is mongosh?
MongoDB Shell - command line interface for MongoDB.

### Step 1: Install mongosh

Download from: https://www.mongodb.com/try/download/shell

### Step 2: Connect

```bash
mongosh "mongodb+srv://gjts_admin:YOUR_PASSWORD@gjts-karnataka.xxxxx.mongodb.net/gjts_karnataka"
```

### Step 3: Run Queries

```javascript
// Show all databases
show dbs

// Use your database
use gjts_karnataka

// Show all collections
show collections

// Count documents in each collection
db.schooladmins.countDocuments()  // 7
db.alumnis.countDocuments()       // 120
db.alumnifunds.countDocuments()   // 36
db.events.countDocuments()        // 36
db.grants.countDocuments()        // 5

// View all alumni
db.alumnis.find()

// View alumni from Ballari
db.alumnis.find({ school: "Ballari" })

// View alumni from Ballari (pretty print)
db.alumnis.find({ school: "Ballari" }).pretty()

// Count Ballari alumni
db.alumnis.countDocuments({ school: "Ballari" })  // 20

// View first 5 alumni
db.alumnis.find().limit(5)

// View alumni sorted by graduation year
db.alumnis.find().sort({ graduationYear: -1 })

// View donations over ₹10,000
db.alumnifunds.find({ amount: { $gt: 10000 } })

// View upcoming events
db.events.find({ status: "upcoming" })

// View grants with high eligibility
db.grants.find({ aiEligibilityScore: { $gt: 90 } })
```

---

## Common Queries You'll Need

### Alumni Queries

```javascript
// All alumni from a specific school
db.alumnis.find({ school: "Ballari" })

// Alumni who graduated in a specific year
db.alumnis.find({ graduationYear: 2018 })

// Alumni by occupation
db.alumnis.find({ currentOccupation: "Software Engineer" })

// Alumni by company
db.alumnis.find({ company: "TCS" })

// Alumni by location
db.alumnis.find({ location: "Bangalore" })

// Count alumni by school
db.alumnis.countDocuments({ school: "Ballari" })
```

### Donation Queries

```javascript
// All donations for a school
db.alumnifunds.find({ school: "Ballari" })

// Donations over a certain amount
db.alumnifunds.find({ amount: { $gt: 10000 } })

// Donations by purpose
db.alumnifunds.find({ purpose: "infrastructure" })

// Completed donations
db.alumnifunds.find({ status: "completed" })

// Total donations for a school
db.alumnifunds.aggregate([
  { $match: { school: "Ballari" } },
  { $group: { _id: null, total: { $sum: "$amount" } } }
])
```

### Event Queries

```javascript
// All events for a school
db.events.find({ school: "Ballari" })

// Upcoming events
db.events.find({ status: "upcoming" })

// Events by category
db.events.find({ category: "alumni-meet" })

// Events in a date range
db.events.find({
  date: {
    $gte: new Date("2026-04-01"),
    $lt: new Date("2026-05-01")
  }
})
```

### Grant Queries

```javascript
// All grants
db.grants.find()

// Government grants
db.grants.find({ providerType: "government" })

// Grants by category
db.grants.find({ category: "technology" })

// High eligibility grants (>90%)
db.grants.find({ aiEligibilityScore: { $gt: 90 } })

// Grants you should apply for
db.grants.find({ "aiRecommendation.shouldApply": true })
```

---

## Exporting Data

### From Atlas Web Dashboard

1. Go to **"Browse Collections"**
2. Select a collection
3. Click **"Export Collection"**
4. Choose format: JSON or CSV
5. Click **"Export"**

### From MongoDB Compass

1. Select a collection
2. Click **"Collection"** menu
3. Choose **"Export Collection"**
4. Select format and location
5. Click **"Export"**

### From Command Line

```bash
# Export entire database
mongoexport --uri="mongodb+srv://user:pass@cluster.mongodb.net/gjts_karnataka" --collection=alumnis --out=alumnis.json

# Export specific collection
mongoexport --uri="mongodb+srv://user:pass@cluster.mongodb.net/gjts_karnataka" --collection=alumnis --out=alumnis.json

# Export as CSV
mongoexport --uri="mongodb+srv://user:pass@cluster.mongodb.net/gjts_karnataka" --collection=alumnis --type=csv --fields=name,email,school,graduationYear --out=alumnis.csv
```

---

## Importing Data

### From Atlas Web Dashboard

1. Go to **"Browse Collections"**
2. Click **"Add Data"** → **"Import File"**
3. Choose JSON or CSV file
4. Map fields
5. Click **"Import"**

### From MongoDB Compass

1. Select a collection
2. Click **"Add Data"** → **"Import File"**
3. Choose file
4. Click **"Import"**

### From Command Line

```bash
# Import JSON
mongoimport --uri="mongodb+srv://user:pass@cluster.mongodb.net/gjts_karnataka" --collection=alumnis --file=alumnis.json

# Import CSV
mongoimport --uri="mongodb+srv://user:pass@cluster.mongodb.net/gjts_karnataka" --collection=alumnis --type=csv --headerline --file=alumnis.csv
```

---

## Quick Reference

### Access Methods Comparison

| Method | Difficulty | Features | Best For |
|--------|-----------|----------|----------|
| **Atlas Web** | Easy | Basic viewing, filtering | Quick checks, beginners |
| **Compass** | Medium | Advanced queries, analysis | Data exploration, analysis |
| **mongosh** | Hard | Full MongoDB power | Developers, automation |

### When to Use Each

**Use Atlas Web Dashboard when:**
- ✅ Quick data check
- ✅ Simple filtering
- ✅ Viewing documents
- ✅ Basic editing

**Use MongoDB Compass when:**
- ✅ Data analysis
- ✅ Complex queries
- ✅ Schema exploration
- ✅ Import/Export data
- ✅ Performance tuning

**Use mongosh when:**
- ✅ Automation scripts
- ✅ Bulk operations
- ✅ Complex aggregations
- ✅ Database administration

---

## 🎯 Quick Start Checklist

To view your data right now:

- [ ] Go to: https://cloud.mongodb.com/
- [ ] Login with your account
- [ ] Click **"Database"** in left menu
- [ ] Click **"Browse Collections"** on your cluster
- [ ] Click **"gjts_karnataka"** database
- [ ] Click any collection to view data:
  - [ ] schooladmins (7 documents)
  - [ ] alumnis (120 documents)
  - [ ] alumnifunds (36 documents)
  - [ ] events (36 documents)
  - [ ] grants (5 documents)

**That's it! You're viewing your data!** 🎉

---

## 📞 Need Help?

**MongoDB Atlas Documentation:**
- Browse Collections: https://docs.atlas.mongodb.com/data-explorer/
- Query Data: https://docs.atlas.mongodb.com/data-explorer/query/
- Export Data: https://docs.atlas.mongodb.com/import-export/

**Your Project Guides:**
- `🌐_MONGODB_ATLAS_GUIDE.md` - Complete Atlas guide
- `📊_DATA_STORAGE_SUMMARY.md` - What data is stored
- `⚡_MONGODB_ATLAS_QUICK_START.md` - Quick setup

---

Built with ❤️ for GJTS Karnataka  
**View Your Data**: Easy, Visual, Powerful 👁️
