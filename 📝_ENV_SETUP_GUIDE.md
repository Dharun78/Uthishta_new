# 📝 .env File Setup Guide

## 🎯 Quick Setup (5 Minutes)

Follow these steps to configure your environment variables.

---

## Step 1: Create Your .env File

### Option A: Copy the Template (Recommended)
```bash
# In the gjts-karnataka-website folder
copy .env.template .env
```

### Option B: Create Manually
1. Create a new file named `.env` in the `gjts-karnataka-website` folder
2. Copy the contents from `.env.template`

---

## Step 2: Get Your MongoDB Atlas Connection String

### 2.1: Login to MongoDB Atlas
1. Go to: https://cloud.mongodb.com/
2. Login with your Atlas account:
   - Email: dharun.a@btech.cristuniversity.in
   - Password: [Your Atlas password]

### 2.2: Navigate to Your Cluster
1. Click **"Database"** in the left sidebar
2. Find your cluster (e.g., `gjts-karnataka`)
3. Click the **"Connect"** button

### 2.3: Get Connection String
1. Choose **"Connect your application"**
2. Select:
   - Driver: **Node.js**
   - Version: **5.5 or later**
3. Copy the connection string (looks like this):
   ```
   mongodb+srv://[username]:<password>@cluster.mongodb.net/?retryWrites=true&w=majority
   ```

### 2.4: Modify the Connection String
You need to make 2 changes:

**Change 1**: Replace `<password>` with your database user password
```
Before: mongodb+srv://gjts_admin:<password>@cluster...
After:  mongodb+srv://gjts_admin:YourActualPassword@cluster...
```

**Change 2**: Add database name `/gjts_karnataka` before the `?`
```
Before: ...@cluster.mongodb.net/?retryWrites=true
After:  ...@cluster.mongodb.net/gjts_karnataka?retryWrites=true
```

**Final format:**
```
mongodb+srv://[USERNAME]:[PASSWORD]@[CLUSTER_URL]/gjts_karnataka?retryWrites=true&w=majority
```

**Example:**
```
mongodb+srv://gjts_admin:MySecurePass123@gjts-karnataka.abc123.mongodb.net/gjts_karnataka?retryWrites=true&w=majority
```

---

## Step 3: Fill in Your .env File

Open your `.env` file and replace the placeholder:

### Before:
```env
MONGODB_URI=[REPLACE_WITH_YOUR_MONGODB_ATLAS_CONNECTION_STRING]
```

### After:
```env
MONGODB_URI=mongodb+srv://gjts_admin:YourPassword@gjts-karnataka.abc123.mongodb.net/gjts_karnataka?retryWrites=true&w=majority
```

**Important**: 
- Replace `gjts_admin` with your actual database username
- Replace `YourPassword` with your actual database password
- Replace `gjts-karnataka.abc123.mongodb.net` with your actual cluster URL

---

## Step 4: Verify Other Settings

Your `.env` file should now look like this:

```env
# MongoDB Configuration
MONGODB_URI=mongodb+srv://gjts_admin:YourPassword@gjts-karnataka.abc123.mongodb.net/gjts_karnataka?retryWrites=true&w=majority

# JWT Secret
JWT_SECRET=gjts-secret-key-2024

# Server Configuration
PORT=5000
NODE_ENV=development

# Frontend URL
NEXT_PUBLIC_API_URL=http://localhost:3000
```

**These other values are already set correctly!** You don't need to change them.

---

## Step 5: Test Your Configuration

### 5.1: Seed the Database
```bash
cd gjts-karnataka-website
node scripts/seed-database.js
```

**Expected output:**
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

### 5.2: Start the Website
```bash
npm run dev
```

**Expected output:**
```
> gjts-karnataka-website@1.0.0 dev
> next dev

   ▲ Next.js 14.2.35
   - Local:        http://localhost:3000
   - Environments: .env

 ✓ Ready in 2.5s
```

### 5.3: Test the Website
1. Open: http://localhost:3000
2. Homepage should load
3. Go to: http://localhost:3000/dashboard/login
4. Login with: `superadmin` / `super123`
5. Dashboard should load with data

**If all these work, your .env is configured correctly!** ✅

---

## 🔍 Troubleshooting

### Error: "Cannot connect to MongoDB"

**Possible causes:**
1. Wrong connection string
2. Wrong password
3. IP not whitelisted in Atlas

**Solutions:**

#### Check 1: Verify Connection String Format
```env
# Correct format:
mongodb+srv://USERNAME:PASSWORD@CLUSTER_URL/gjts_karnataka?retryWrites=true&w=majority

# Common mistakes:
❌ Missing database name: ...@cluster.mongodb.net/?retryWrites=true
✅ Correct: ...@cluster.mongodb.net/gjts_karnataka?retryWrites=true

❌ Still has <password>: ...gjts_admin:<password>@cluster...
✅ Correct: ...gjts_admin:YourActualPassword@cluster...

❌ Wrong database name: .../wrong_name?retryWrites=true
✅ Correct: .../gjts_karnataka?retryWrites=true
```

#### Check 2: Verify Database User Password
1. Go to MongoDB Atlas
2. Click "Database Access"
3. Find your user (e.g., `gjts_admin`)
4. If needed, click "Edit" and reset password
5. Update .env with new password

#### Check 3: Verify IP Whitelist
1. Go to MongoDB Atlas
2. Click "Network Access"
3. Ensure you have: `0.0.0.0/0` (Allow from anywhere)
4. Or add your current IP address

---

### Error: "JWT token error"

**Solution:**
Make sure your .env has:
```env
JWT_SECRET=gjts-secret-key-2024
```

If you changed it, restart the dev server:
```bash
# Stop the server (Ctrl+C)
# Start again
npm run dev
```

---

### Error: "Port 3000 already in use"

**Solution:**
Another application is using port 3000.

**Option 1**: Stop the other application

**Option 2**: Use a different port
```bash
# Windows
$env:PORT=3001; npm run dev

# Mac/Linux
PORT=3001 npm run dev
```

---

## 📋 Complete .env File Example

Here's what your complete `.env` file should look like:

```env
# MongoDB Configuration
MONGODB_URI=mongodb+srv://gjts_admin:MySecurePass123@gjts-karnataka.abc123.mongodb.net/gjts_karnataka?retryWrites=true&w=majority

# JWT Secret
JWT_SECRET=gjts-secret-key-2024

# Server Configuration
PORT=5000
NODE_ENV=development

# Frontend URL
NEXT_PUBLIC_API_URL=http://localhost:3000
```

**Remember to replace:**
- `gjts_admin` → Your database username
- `MySecurePass123` → Your database password
- `gjts-karnataka.abc123.mongodb.net` → Your cluster URL

---

## 🔐 Security Checklist

- [ ] .env file is NOT committed to Git
- [ ] .env is listed in .gitignore
- [ ] Connection string has correct password
- [ ] JWT_SECRET is set
- [ ] No sensitive data in code files
- [ ] Only .env.template is in Git (without real credentials)

---

## 📊 MongoDB Atlas Free Tier Limits

Your current setup will stay within free tier limits:

| Resource | Free Tier Limit | Your Usage | Status |
|----------|----------------|------------|--------|
| Storage | 512 MB | ~255 KB | ✅ 0.05% |
| RAM | Shared | Shared | ✅ Free |
| Connections | 500 concurrent | ~10 | ✅ Free |
| Backups | 2 days retention | Automatic | ✅ Free |

**You're well within limits!** No charges will occur. 🎉

---

## 🎯 Quick Reference

### Get Connection String:
```
Atlas Dashboard → Database → Connect → Connect your application → Copy string
```

### Connection String Format:
```
mongodb+srv://[USERNAME]:[PASSWORD]@[CLUSTER]/gjts_karnataka?retryWrites=true&w=majority
```

### Test Connection:
```bash
node scripts/seed-database.js
```

### Start Website:
```bash
npm run dev
```

### View Data:
```
https://cloud.mongodb.com/ → Database → Browse Collections
```

---

## 📞 Need Help?

### If seed script fails:
1. Check connection string format
2. Verify password is correct
3. Check IP whitelist in Atlas
4. Ensure database name is `gjts_karnataka`

### If website won't start:
1. Check .env file exists
2. Verify all required variables are set
3. Restart terminal
4. Run `npm install` again

### If login doesn't work:
1. Ensure database is seeded
2. Check JWT_SECRET is set
3. Clear browser cache
4. Try incognito mode

---

## ✅ Success Checklist

- [ ] .env file created
- [ ] MongoDB connection string added
- [ ] Connection string has correct format
- [ ] Password replaced in connection string
- [ ] Database name is `gjts_karnataka`
- [ ] JWT_SECRET is set
- [ ] Seed script runs successfully
- [ ] Website starts without errors
- [ ] Can login to dashboard
- [ ] Data loads in dashboard

**If all checked, you're ready to go!** 🚀

---

## 🎉 Next Steps

1. ✅ .env file configured
2. ✅ Database seeded
3. ✅ Website running

**Now you can:**
- Explore the dashboard
- View fund management
- Try the grants chatbot
- Create events
- Customize content
- Deploy to production

---

Built with ❤️ for GJTS Karnataka  
**Environment Setup**: Simple, Secure, Complete ✅
