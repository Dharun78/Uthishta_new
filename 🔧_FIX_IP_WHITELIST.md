# 🔧 Fix MongoDB IP Whitelist Issue

## ⚠️ Problem
Your IP address is not whitelisted in MongoDB Atlas, so the connection is being blocked.

## ✅ Solution: Add Your IP to Whitelist

### Step-by-Step Instructions:

1. **Go to MongoDB Atlas**
   ```
   https://cloud.mongodb.com
   ```

2. **Login** with your credentials

3. **Navigate to Network Access**
   - Look in the left sidebar
   - Click on "Network Access" (under "Security")

4. **Add Your IP Address**
   - Click the **"+ ADD IP ADDRESS"** button (green button, top right)
   
5. **Choose One Option:**

   **Option A: Add Current IP (Recommended for now)**
   - Click **"ADD CURRENT IP ADDRESS"**
   - It will auto-detect your IP
   - Add a comment like "My Home IP"
   - Click **"Confirm"**

   **Option B: Allow Access from Anywhere (Easy but less secure)**
   - Click **"ALLOW ACCESS FROM ANYWHERE"**
   - This adds `0.0.0.0/0` to whitelist
   - Click **"Confirm"**
   - ⚠️ Note: Less secure, but works from any location

6. **Wait for Changes to Apply**
   - It takes about 1-2 minutes for the changes to take effect
   - You'll see a status indicator showing "Pending" → "Active"

7. **Verify Connection**
   - Once status shows "Active"
   - Try accessing your website again

---

## 🎯 Quick Fix (Fastest Method)

If you want the quickest solution:

1. Go to: https://cloud.mongodb.com
2. Click **"Network Access"** in left sidebar
3. Click **"+ ADD IP ADDRESS"**
4. Click **"ALLOW ACCESS FROM ANYWHERE"**
5. Click **"Confirm"**
6. Wait 1-2 minutes
7. Done! ✅

---

## 🔍 Visual Guide

```
MongoDB Atlas Dashboard
├─ Security (in left sidebar)
│  └─ Network Access ← Click here
│     └─ + ADD IP ADDRESS ← Click this button
│        ├─ Option 1: ADD CURRENT IP ADDRESS ← Recommended
│        └─ Option 2: ALLOW ACCESS FROM ANYWHERE ← Easiest
```

---

## ✅ After Whitelisting

Once your IP is whitelisted, your website will automatically connect to MongoDB.

**Test by:**
1. Go to: http://localhost:3001/dashboard/login
2. Login with:
   - Username: `hubballi`
   - Password: `hubballi123`
3. If login works → MongoDB is connected! ✅

---

## 💡 Why This Happens

MongoDB Atlas has security features that only allow connections from whitelisted IP addresses. This prevents unauthorized access to your database.

When you:
- Change networks (home → office → cafe)
- Restart your router
- Your ISP changes your IP

You may need to update the whitelist.

---

## 🚀 Next Steps

After whitelisting your IP:

1. **Refresh your website**: http://localhost:3001
2. **Try logging in** to the dashboard
3. **Test the grants system**: Go to Grants page and type "Search for grants"
4. **Test the CMS**: Go to Content page and edit your school info

---

**Let me know once you've whitelisted your IP, and I'll verify the connection!**
