# 🔧 How to Resume MongoDB Atlas Cluster

## Step-by-Step Guide

### Step 1: Go to MongoDB Atlas Website

1. Open your web browser
2. Go to: **https://cloud.mongodb.com/**
3. You'll see the MongoDB Atlas login page

---

### Step 2: Login to Your Account

1. **Enter your email** (the one you used to create the MongoDB account)
2. **Enter your password**
3. Click **"Sign In"**

**If you don't remember your login:**
- Click "Forgot Password" to reset it
- Or check your email for MongoDB Atlas registration confirmation

---

### Step 3: Find Your Cluster

After logging in, you'll see the MongoDB Atlas dashboard:

1. Look for **"Database"** in the left sidebar
2. Click on **"Database"** or **"Clusters"**
3. You should see your cluster named **"Cluster0"**

---

### Step 4: Check Cluster Status

Look at your Cluster0 - you'll see one of these statuses:

**If it shows "PAUSED" or "Paused":**
- ✅ This is the problem! Continue to Step 5

**If it shows "RUNNING" or has a green indicator:**
- ✅ Cluster is already running
- The issue might be something else (see Alternative Solutions below)

**If it shows "STARTING":**
- ⏳ Wait 2-3 minutes for it to finish starting
- Then refresh your website

---

### Step 5: Resume the Cluster (If Paused)

1. Find the **"..."** (three dots) button next to your Cluster0
2. Click the three dots
3. You'll see a menu with options
4. Click **"Resume"** or **"Resume Cluster"**
5. Confirm if asked

**OR**

1. Look for a **"Resume"** button directly on the cluster card
2. Click it
3. Confirm if asked

---

### Step 6: Wait for Cluster to Start

After clicking Resume:

1. You'll see status change to **"STARTING"** or **"Resuming"**
2. **Wait 2-3 minutes** (this is normal)
3. Status will change to **"RUNNING"** with a green indicator
4. ✅ Your cluster is now active!

---

### Step 7: Test Your Website

1. Go back to your website: **http://localhost:3000**
2. Login to dashboard:
   - Username: `hubballi`
   - Password: `hubballi123`
3. Go to **Grants** page
4. You should now see the 10 government grants!

---

## 🎯 Visual Guide

### What You're Looking For:

**MongoDB Atlas Dashboard:**
```
┌─────────────────────────────────────────┐
│  MongoDB Atlas                          │
│  ┌─────────────────────────────────┐   │
│  │ Database                        │   │
│  │   └─ Clusters                   │   │
│  │                                 │   │
│  │ Cluster0                        │   │
│  │ Status: PAUSED  [Resume] [...]  │   │  ← Click Resume!
│  │                                 │   │
│  └─────────────────────────────────┘   │
└─────────────────────────────────────────┘
```

**After Resuming:**
```
┌─────────────────────────────────────────┐
│  Cluster0                               │
│  Status: RUNNING ●                      │  ← Green dot = Good!
│  Region: AWS / Mumbai                   │
│  Tier: M0 Sandbox (Free)                │
└─────────────────────────────────────────┘
```

---

## 🔍 Alternative Solutions

### If Cluster is Already Running:

#### Option 1: Check IP Whitelist

1. In MongoDB Atlas, click **"Network Access"** in left sidebar
2. Look at **"IP Access List"**
3. You should see entries like:
   - `0.0.0.0/0` (allows all IPs) - RECOMMENDED for development
   - Or your specific IP address

**If list is empty or doesn't have your IP:**
1. Click **"Add IP Address"**
2. Click **"Allow Access from Anywhere"**
3. Click **"Confirm"**
4. Wait 1-2 minutes
5. Try your website again

#### Option 2: Check Database User

1. Click **"Database Access"** in left sidebar
2. Look for user: **dbuser**
3. Make sure it exists and has **"Read and write to any database"** permission

**If user doesn't exist:**
1. Click **"Add New Database User"**
2. Username: `dbuser`
3. Password: `Tsunade@106`
4. Database User Privileges: **"Read and write to any database"**
5. Click **"Add User"**

#### Option 3: Verify Connection String

Your connection string should be:
```
mongodb+srv://dbuser:Tsunade%40106@cluster0.eshla4d.mongodb.net/gjts_karnataka?retryWrites=true&w=majority&appName=Cluster0
```

Check in your `.env` file:
```env
MONGODB_URI=mongodb+srv://dbuser:Tsunade%40106@cluster0.eshla4d.mongodb.net/gjts_karnataka?retryWrites=true&w=majority&appName=Cluster0
```

---

## 📞 Common Issues

### Issue 1: "I can't find the Resume button"

**Solution:**
- Look for three dots (...) menu next to cluster name
- Or look for "Actions" dropdown
- Or right-click on the cluster card

### Issue 2: "Resume button is grayed out"

**Solution:**
- You might not have permission
- Try logging out and back in
- Or contact the account owner

### Issue 3: "Cluster is running but website still doesn't work"

**Solution:**
1. Check IP whitelist (see Option 1 above)
2. Restart your development server:
   - Stop server (Ctrl+C in terminal)
   - Run `npm run dev` again
3. Clear browser cache and refresh

### Issue 4: "I don't remember my MongoDB Atlas login"

**Solution:**
1. Go to https://cloud.mongodb.com/
2. Click "Forgot Password"
3. Enter your email
4. Check email for reset link
5. Create new password
6. Login again

---

## ✅ Success Checklist

After resuming cluster, verify:

- [ ] Cluster status shows "RUNNING" with green indicator
- [ ] IP whitelist includes `0.0.0.0/0` or your IP
- [ ] Database user `dbuser` exists
- [ ] Website loads without errors
- [ ] Dashboard login works
- [ ] Grants page shows 10 grants
- [ ] Alumni page shows 300+ alumni
- [ ] Events can be created

---

## 🎯 Quick Summary

**The Problem:**
Your MongoDB Atlas cluster is paused, so the website can't access the database.

**The Solution:**
1. Go to https://cloud.mongodb.com/
2. Login
3. Find Cluster0
4. Click "Resume"
5. Wait 2-3 minutes
6. Refresh website

**Time Required:** 5 minutes

**Once Fixed:**
- Grants will show
- Alumni will load
- Events will work
- Everything database-related will work
- Then we can implement the CMS system

---

## 📧 Need Help?

If you're stuck:
1. Take a screenshot of your MongoDB Atlas dashboard
2. Tell me what you see
3. I'll guide you through it

**The most common issue is simply that the cluster is paused and needs to be resumed!**
