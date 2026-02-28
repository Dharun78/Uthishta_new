# 🌐 MongoDB Atlas Setup Guide

## What is MongoDB Atlas?

MongoDB Atlas is a **cloud-hosted MongoDB database** service. Instead of running MongoDB on your local computer, your database runs in the cloud and can be accessed from anywhere.

---

## ✅ Is MongoDB Atlas Free?

**YES!** MongoDB Atlas has a **FREE TIER** that's perfect for your project:

### Free Tier (M0) Includes:
- ✅ **512 MB Storage** (enough for ~10,000+ documents)
- ✅ **Shared RAM** (sufficient for small to medium apps)
- ✅ **No credit card required**
- ✅ **Never expires**
- ✅ **Automatic backups**
- ✅ **SSL/TLS encryption**
- ✅ **Access from anywhere**

### Your Current Data Size:
After seeding, your database has:
- 7 admin accounts (~5 KB)
- 120 alumni records (~120 KB)
- 36 donations (~50 KB)
- 36 events (~60 KB)
- 5 grants (~20 KB)

**Total: ~255 KB** (only 0.05% of free tier!)

You can store **thousands more records** on the free tier! 🎉

---

## 📊 What Data is Stored in MongoDB Atlas?

Your database will contain 5 collections (tables):

### 1. SchoolAdmin Collection (7 documents)
**What it stores**: Admin login accounts

```javascript
{
  username: "superadmin",
  email: "superadmin@gjts-karnataka.edu.in",
  password: "$2a$10$...", // Encrypted password
  school: "All",
  schoolId: "GJTS-SUPER-000",
  role: "super_admin",
  fullName: "Super Administrator",
  phone: "+91-9876543210",
  isActive: true,
  permissions: {
    canEditAllSchools: true,
    canEditOwnSchool: true,
    canViewReports: true,
    canManageFunds: true,
    canManageGrants: true,
    canManageEvents: true,
    canManageAlumni: true
  },
  createdAt: "2026-02-26T..."
}
```

**Size**: ~1 KB per document = ~7 KB total

---

### 2. Alumni Collection (120 documents)
**What it stores**: Alumni information

```javascript
{
  name: "Ballari Alumni 1",
  email: "alumni1@ballari.com",
  phone: "+91-9123456789",
  school: "Ballari",
  graduationYear: 2018,
  course: "Electronics",
  currentOccupation: "Software Engineer",
  company: "TCS",
  location: "Bangalore",
  linkedIn: "https://linkedin.com/in/alumni1",
  isActive: true,
  createdAt: "2025-08-15T..."
}
```

**Size**: ~1 KB per document = ~120 KB total

---

### 3. AlumniFund Collection (~36 documents)
**What it stores**: Donation records with AI analysis

```javascript
{
  alumniId: ObjectId("..."),
  alumniName: "Ballari Alumni 1",
  alumniEmail: "alumni1@ballari.com",
  school: "Ballari",
  amount: 10000,
  currency: "INR",
  donationType: "one-time",
  purpose: "infrastructure",
  paymentMethod: "upi",
  transactionId: "TXN1234567890",
  status: "completed",
  receiptNumber: "GJTS-BAL-2026-0001",
  taxDeductible: true,
  notes: "Thank you for your contribution!",
  aiAnalysis: {
    donorPattern: "occasional",
    engagementScore: 75,
    recommendations: [
      "Send thank you email",
      "Share impact report"
    ]
  },
  createdAt: "2025-12-10T...",
  updatedAt: "2025-12-10T..."
}
```

**Size**: ~1.5 KB per document = ~54 KB total

---

### 4. Event Collection (36 documents)
**What it stores**: School events

```javascript
{
  title: "Alumni Meet 2026 - Ballari",
  description: "Annual alumni gathering and networking event",
  school: "Ballari",
  date: "2026-04-15T10:00:00.000Z",
  time: "10:00 AM",
  venue: "Ballari Campus",
  category: "alumni-meet",
  targetAudience: ["students", "alumni", "faculty"],
  maxAttendees: 150,
  registeredCount: 25,
  status: "upcoming",
  organizer: "Ballari Admin",
  contactEmail: "admin@gjts-ballari.edu.in",
  contactPhone: "+91-9876543210",
  imageUrl: "/images/events/alumni-meet.jpg",
  createdBy: "admin_ballari",
  createdAt: "2026-02-26T...",
  updatedAt: "2026-02-26T..."
}
```

**Size**: ~1.5 KB per document = ~54 KB total

---

### 5. Grant Collection (5 documents)
**What it stores**: Available grants with AI eligibility analysis

```javascript
{
  title: "Digital India Initiative - School Technology Grant 2026",
  description: "Government grant for upgrading school technology...",
  grantProvider: "Ministry of Electronics and IT",
  providerType: "government",
  amount: {
    min: 500000,
    max: 2000000,
    currency: "INR"
  },
  eligibilityCriteria: [
    { criterion: "Government-recognized institution", met: true },
    { criterion: "Technical/vocational focus", met: true },
    { criterion: "Student strength > 100", met: true }
  ],
  applicationDeadline: "2026-06-30T...",
  grantUrl: "https://digitalindia.gov.in/grants",
  applicationUrl: "https://digitalindia.gov.in/apply",
  category: "technology",
  targetBeneficiaries: ["government schools", "technical schools"],
  aiEligibilityScore: 95,
  aiRecommendation: {
    shouldApply: true,
    reasoning: "Excellent match! You meet 3/3 criteria...",
    successProbability: 95,
    requiredDocuments: [
      "School registration",
      "Financial statements",
      "Project proposal"
    ],
    estimatedEffort: "Low - straightforward application"
  },
  applicableSchools: [
    "Ballari", "Bhadravati", "Hubballi", 
    "Bagalkot", "Kalburgi", "Mangalore"
  ],
  status: "discovered",
  discoveredBy: "ai-agent",
  discoveredAt: "2026-02-26T...",
  lastUpdated: "2026-02-26T..."
}
```

**Size**: ~4 KB per document = ~20 KB total

---

## 📈 Storage Breakdown

| Collection | Documents | Size per Doc | Total Size | % of Free Tier |
|------------|-----------|--------------|------------|----------------|
| SchoolAdmin | 7 | ~1 KB | ~7 KB | 0.001% |
| Alumni | 120 | ~1 KB | ~120 KB | 0.023% |
| AlumniFund | 36 | ~1.5 KB | ~54 KB | 0.010% |
| Event | 36 | ~1.5 KB | ~54 KB | 0.010% |
| Grant | 5 | ~4 KB | ~20 KB | 0.004% |
| **TOTAL** | **204** | - | **~255 KB** | **0.05%** |

**Free Tier Capacity**: 512 MB (524,288 KB)  
**Your Usage**: 255 KB  
**Remaining**: 524,033 KB (99.95% free!)

### You Can Still Add:
- ✅ **~50,000 more alumni records**
- ✅ **~10,000 more donations**
- ✅ **~10,000 more events**
- ✅ **~1,000 more grants**

---

## 🚀 How to Set Up MongoDB Atlas (Step-by-Step)

### Step 1: Create Free Account

1. Go to: https://www.mongodb.com/cloud/atlas/register
2. Sign up with:
   - Email address
   - Or Google account
   - Or GitHub account
3. **No credit card required!**

---

### Step 2: Create Free Cluster

1. After login, click **"Build a Database"**
2. Choose **"M0 FREE"** tier
3. Select cloud provider:
   - **AWS** (recommended)
   - Google Cloud
   - Azure
4. Choose region closest to you:
   - **Mumbai** (for India - lowest latency)
   - Singapore
   - Or any other region
5. Cluster name: `gjts-karnataka` (or any name)
6. Click **"Create"**

**Wait 3-5 minutes** for cluster creation

---

### Step 3: Create Database User

1. Click **"Database Access"** in left menu
2. Click **"Add New Database User"**
3. Choose **"Password"** authentication
4. Enter:
   - Username: `gjts_admin` (or any name)
   - Password: Generate secure password (save it!)
5. Database User Privileges: **"Read and write to any database"**
6. Click **"Add User"**

**Save these credentials!** You'll need them.

---

### Step 4: Allow Network Access

1. Click **"Network Access"** in left menu
2. Click **"Add IP Address"**
3. Choose one:
   - **"Allow Access from Anywhere"** (0.0.0.0/0) - Easiest for development
   - Or add your specific IP address
4. Click **"Confirm"**

**Note**: For production, restrict to specific IPs for security.

---

### Step 5: Get Connection String

1. Click **"Database"** in left menu
2. Click **"Connect"** button on your cluster
3. Choose **"Connect your application"**
4. Select:
   - Driver: **Node.js**
   - Version: **5.5 or later**
5. Copy the connection string:
   ```
   mongodb+srv://gjts_admin:<password>@gjts-karnataka.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```

---

### Step 6: Update Your .env File

1. Open `gjts-karnataka-website/.env`
2. Replace the MongoDB URI:

```env
# OLD (Local MongoDB)
MONGODB_URI=mongodb://localhost:27017/gjts_karnataka

# NEW (MongoDB Atlas)
MONGODB_URI=mongodb+srv://gjts_admin:YOUR_PASSWORD@gjts-karnataka.xxxxx.mongodb.net/gjts_karnataka?retryWrites=true&w=majority
```

**Replace**:
- `YOUR_PASSWORD` with your actual password
- `gjts-karnataka.xxxxx` with your actual cluster URL
- Add database name: `/gjts_karnataka` before the `?`

**Example**:
```env
MONGODB_URI=mongodb+srv://gjts_admin:MySecurePass123@gjts-karnataka.abc123.mongodb.net/gjts_karnataka?retryWrites=true&w=majority
```

---

### Step 7: Seed Your Cloud Database

Run the seeding script to populate MongoDB Atlas:

```bash
cd gjts-karnataka-website
node scripts/seed-database.js
```

**You should see**:
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

### Step 8: Test Your Website

1. Start your development server (if not running):
   ```bash
   npm run dev
   ```

2. Open: http://localhost:3000

3. Login to dashboard: http://localhost:3000/dashboard/login
   - Username: `superadmin`
   - Password: `super123`

4. Check if data loads correctly:
   - Dashboard statistics
   - Fund management
   - Grant discovery
   - Events

**If everything works, you're connected to MongoDB Atlas!** 🎉

---

## 🔒 Security Best Practices

### 1. Strong Password
Use a strong password for database user:
- At least 12 characters
- Mix of uppercase, lowercase, numbers, symbols
- Don't use common words

### 2. Environment Variables
Never commit `.env` file to Git:
```bash
# .gitignore already includes:
.env
.env.local
.env.production
```

### 3. Network Access
For production:
- Don't use "Allow Access from Anywhere"
- Add only your server's IP address
- Update when IP changes

### 4. Database User Permissions
- Use separate users for different environments
- Development user: Read/Write
- Production user: Read/Write with specific database
- Backup user: Read-only

---

## 📊 Monitoring Your Database

### View Data in Atlas

1. Go to MongoDB Atlas dashboard
2. Click **"Browse Collections"**
3. Select database: `gjts_karnataka`
4. View collections:
   - schooladmins (7 documents)
   - alumnis (120 documents)
   - alumnifunds (36 documents)
   - events (36 documents)
   - grants (5 documents)

### Check Storage Usage

1. Click **"Metrics"** tab
2. View:
   - Storage size
   - Number of documents
   - Operations per second
   - Network traffic

### Set Up Alerts

1. Click **"Alerts"** in left menu
2. Create alerts for:
   - Storage usage > 80%
   - Connection failures
   - Slow queries

---

## 💰 Cost Comparison

### Free Tier (M0) - Current Plan
- **Cost**: $0/month
- **Storage**: 512 MB
- **RAM**: Shared
- **Your usage**: ~255 KB (0.05%)
- **Perfect for**: Development, testing, small production

### If You Outgrow Free Tier

**M2 Shared Cluster** - $9/month
- Storage: 2 GB
- RAM: Shared
- Good for: Small production apps

**M10 Dedicated** - $57/month
- Storage: 10 GB
- RAM: 2 GB
- Good for: Medium production apps

**You won't need paid tier for a long time!**

---

## 🔄 Backup & Recovery

### Automatic Backups (Free Tier)
- ✅ Continuous backups
- ✅ Point-in-time recovery
- ✅ Retained for 2 days

### Manual Backup
Export your data:
```bash
# Install MongoDB Database Tools
# Then export:
mongodump --uri="mongodb+srv://gjts_admin:password@cluster.mongodb.net/gjts_karnataka"
```

### Restore from Backup
```bash
mongorestore --uri="mongodb+srv://gjts_admin:password@cluster.mongodb.net/gjts_karnataka" dump/
```

---

## 🌍 Access from Anywhere

With MongoDB Atlas, you can:

### From Your Computer
```env
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/gjts_karnataka
```

### From AWS Server
Same connection string works!

### From Vercel/Netlify
Add as environment variable in deployment settings

### From Mobile App
Use same connection string (with proper security)

---

## 🚀 Performance Tips

### 1. Create Indexes
For faster queries:
```javascript
// In MongoDB Atlas UI or via code
db.alumnis.createIndex({ school: 1 })
db.alumnifunds.createIndex({ school: 1, createdAt: -1 })
db.events.createIndex({ school: 1, date: 1 })
```

### 2. Use Connection Pooling
Already configured in `lib/mongodb.js`:
```javascript
const opts = {
  bufferCommands: false,
}
```

### 3. Enable Compression
Add to connection string:
```
?compressors=snappy,zlib
```

---

## ❓ Common Questions

### Q: Will my free tier expire?
**A**: No! MongoDB Atlas free tier never expires.

### Q: Can I upgrade later?
**A**: Yes! Upgrade anytime with zero downtime.

### Q: Is my data secure?
**A**: Yes! Encrypted in transit (SSL/TLS) and at rest.

### Q: Can multiple people access it?
**A**: Yes! Create multiple database users.

### Q: What if I exceed 512 MB?
**A**: You'll be notified. Upgrade to M2 ($9/month) or clean old data.

### Q: Can I use it for production?
**A**: Yes! Many small apps run on free tier.

### Q: Is it fast?
**A**: Yes! Choose region closest to your users for best performance.

---

## 🎯 Quick Setup Checklist

- [ ] Create MongoDB Atlas account (free)
- [ ] Create M0 free cluster
- [ ] Create database user
- [ ] Allow network access (0.0.0.0/0 for development)
- [ ] Get connection string
- [ ] Update .env file with connection string
- [ ] Run seed script: `node scripts/seed-database.js`
- [ ] Test website: http://localhost:3000
- [ ] Verify data in Atlas dashboard

---

## 📞 Support

### MongoDB Atlas Support
- Documentation: https://docs.atlas.mongodb.com/
- Community Forums: https://www.mongodb.com/community/forums/
- University (Free Courses): https://university.mongodb.com/

### Your Project Support
- Check `✅_SYSTEM_STATUS.md` for troubleshooting
- Review connection string format
- Verify network access settings
- Check database user permissions

---

## 🎉 Benefits of MongoDB Atlas

✅ **No Installation**: No need to install MongoDB locally  
✅ **Always Available**: 99.95% uptime SLA  
✅ **Automatic Backups**: Your data is safe  
✅ **Scalable**: Upgrade as you grow  
✅ **Secure**: Enterprise-grade security  
✅ **Global**: Deploy in 80+ regions  
✅ **Free Forever**: M0 tier never expires  
✅ **Easy to Use**: Beautiful web interface  

---

## 🚀 Next Steps

1. **Create your MongoDB Atlas account** (5 minutes)
2. **Set up free cluster** (3 minutes)
3. **Update .env file** (1 minute)
4. **Seed database** (1 minute)
5. **Start using your cloud database!** 🎉

Your data will be accessible from anywhere, backed up automatically, and completely free!

---

Built with ❤️ for GJTS Karnataka  
**MongoDB Atlas**: Free, Secure, Scalable ✅
