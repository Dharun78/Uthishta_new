# 🔧 Fix Your .env File - Quick Guide

## ⚠️ Important Issues Found

Your `.env` file has been created, but you need to replace `[YOUR_CLUSTER_URL]` with your actual MongoDB Atlas cluster URL.

---

## 🎯 What You Need to Do

### Step 1: Get Your Cluster URL

1. Go to: https://cloud.mongodb.com/
2. Login with:
   - Email: dharun.a@btech.christuniversity.in
   - Password: Tsunade@106
3. Click **"Database"** in the left sidebar
4. Click **"Connect"** button on your cluster
5. Choose **"Connect your application"**
6. Copy the connection string

**It will look like:**
```
mongodb+srv://username:<password>@gjts-karnataka.xxxxx.mongodb.net/?retryWrites=true&w=majority
```

**You only need this part:** `gjts-karnataka.xxxxx.mongodb.net`

---

### Step 2: Update Your .env File

Open your `.env` file and find this line:
```env
MONGODB_URI=mongodb+srv://dharun:Tsunade%40106@[YOUR_CLUSTER_URL]/gjts_karnataka?retryWrites=true&w=majority
```

Replace `[YOUR_CLUSTER_URL]` with your actual cluster URL.

**Example:**
If your cluster URL is `gjts-karnataka.abc123.mongodb.net`, then:

```env
MONGODB_URI=mongodb+srv://dharun:Tsunade%40106@gjts-karnataka.abc123.mongodb.net/gjts_karnataka?retryWrites=true&w=majority
```

---

## 📝 Important Notes

### 1. Database Username vs Atlas Email
- ❌ **Don't use**: dharun.a@btech.christuniversity.in (Atlas login email)
- ✅ **Use**: `dharun` or whatever database username you created

**Your current .env uses:** `dharun` (which is correct if that's your database username)

### 2. Password Encoding
The `@` symbol in your password needs to be URL-encoded:
- Original password: `Tsunade@106`
- URL-encoded: `Tsunade%40106`

**Your .env already has this correct!** ✅

### 3. Database Name
Make sure `/gjts_karnataka` is in the connection string before the `?`

**Your .env already has this correct!** ✅

---

## 🔍 What Your Database Username Should Be

When you created your database user in MongoDB Atlas, you chose a username. This is **NOT** your Atlas login email.

**To check your database username:**
1. Go to MongoDB Atlas
2. Click **"Database Access"** in the left sidebar
3. Look at the username column

**Common usernames:**
- `dharun`
- `gjts_admin`
- `admin`
- Or whatever you created

**Update your .env if needed:**
```env
# If your database username is 'gjts_admin':
MONGODB_URI=mongodb+srv://gjts_admin:Tsunade%40106@[YOUR_CLUSTER_URL]/gjts_karnataka?retryWrites=true&w=majority

# If your database username is 'dharun':
MONGODB_URI=mongodb+srv://dharun:Tsunade%40106@[YOUR_CLUSTER_URL]/gjts_karnataka?retryWrites=true&w=majority
```

---

## ✅ Complete .env File Example

After you get your cluster URL, your `.env` should look like this:

```env
# MongoDB Configuration
MONGODB_URI=mongodb+srv://dharun:Tsunade%40106@gjts-karnataka.abc123.mongodb.net/gjts_karnataka?retryWrites=true&w=majority

# JWT Secret Key
JWT_SECRET=Tsunade@106

# Server Configuration
PORT=5000
NODE_ENV=development

# Frontend URL
NEXT_PUBLIC_API_URL=http://localhost:3000
```

**Replace:**
- `gjts-karnataka.abc123.mongodb.net` → Your actual cluster URL
- `dharun` → Your actual database username (if different)

---

## 🧪 Test Your Configuration

After updating the cluster URL, test it:

```bash
# 1. Seed the database
cd gjts-karnataka-website
node scripts/seed-database.js
```

**Expected output:**
```
✅ Connected to MongoDB
🗑️  Cleared existing data
📝 Seeding Admins...
✅ Created 7 admin accounts
...
🎉 DATABASE SEEDING COMPLETED!
```

**If you see this, your .env is correct!** ✅

---

## 🆘 Troubleshooting

### Error: "MongoServerError: bad auth"
**Cause:** Wrong username or password

**Solution:**
1. Check database username in Atlas → Database Access
2. Verify password is correct
3. Make sure `@` is encoded as `%40`

### Error: "MongooseServerSelectionError"
**Cause:** Wrong cluster URL or network issue

**Solution:**
1. Verify cluster URL is correct
2. Check Network Access in Atlas (should have `0.0.0.0/0`)
3. Ensure cluster is running (green status in Atlas)

### Error: "Cannot find module"
**Cause:** Missing dependencies

**Solution:**
```bash
npm install
```

---

## 📋 Quick Checklist

- [ ] Got cluster URL from MongoDB Atlas
- [ ] Replaced `[YOUR_CLUSTER_URL]` in .env
- [ ] Verified database username is correct
- [ ] Password has `%40` instead of `@`
- [ ] Database name is `/gjts_karnataka`
- [ ] Tested with seed script
- [ ] Seed script completed successfully

---

## 🎯 Next Steps

Once your .env is correct:

1. ✅ Seed the database: `node scripts/seed-database.js`
2. ✅ Start the website: `npm run dev`
3. ✅ Open: http://localhost:3000
4. ✅ Login: http://localhost:3000/dashboard/login
5. ✅ Use: `superadmin` / `super123`

---

## 📞 Need the Cluster URL?

**Get it from MongoDB Atlas:**
1. https://cloud.mongodb.com/
2. Database → Connect → Connect your application
3. Look for: `@something.mongodb.net`
4. Copy the part after `@` and before `/`

**Example from connection string:**
```
mongodb+srv://user:pass@gjts-karnataka.abc123.mongodb.net/...
                         ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
                         This is your cluster URL
```

---

Built with ❤️ for GJTS Karnataka  
**Almost There!** Just need the cluster URL 🔧
