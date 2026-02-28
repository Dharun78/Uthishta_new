# ⚙️ .env File - Quick Reference

## 🚀 3-Step Setup

### Step 1: Copy Template
```bash
copy .env.template .env
```

### Step 2: Get MongoDB Connection String
1. Login to: https://cloud.mongodb.com/
2. Database → Connect → Connect your application
3. Copy connection string

### Step 3: Update .env File
Replace this line:
```env
MONGODB_URI=[REPLACE_WITH_YOUR_MONGODB_ATLAS_CONNECTION_STRING]
```

With your actual connection string:
```env
MONGODB_URI=mongodb+srv://USERNAME:PASSWORD@CLUSTER_URL/gjts_karnataka?retryWrites=true&w=majority
```

**Done!** 🎉

---

## 📋 Connection String Format

```
mongodb+srv://[USERNAME]:[PASSWORD]@[CLUSTER_URL]/gjts_karnataka?retryWrites=true&w=majority
```

### Parts to Replace:
- `[USERNAME]` → Your database username (e.g., `gjts_admin`)
- `[PASSWORD]` → Your database password
- `[CLUSTER_URL]` → Your cluster URL (e.g., `gjts-karnataka.abc123.mongodb.net`)

### Example:
```
mongodb+srv://gjts_admin:MyPass123@gjts-karnataka.abc123.mongodb.net/gjts_karnataka?retryWrites=true&w=majority
```

---

## ✅ Complete .env File

Your `.env` file should look like this:

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

**Only change the MONGODB_URI line!** Everything else is already correct.

---

## 🧪 Test Your Setup

```bash
# 1. Seed database
node scripts/seed-database.js

# 2. Start website
npm run dev

# 3. Open browser
# http://localhost:3000
```

**If these work, you're all set!** ✅

---

## 🔍 Common Mistakes

### ❌ Wrong: Still has placeholder
```env
MONGODB_URI=[REPLACE_WITH_YOUR_MONGODB_ATLAS_CONNECTION_STRING]
```

### ✅ Correct: Actual connection string
```env
MONGODB_URI=mongodb+srv://gjts_admin:MyPass123@cluster.mongodb.net/gjts_karnataka?retryWrites=true&w=majority
```

---

### ❌ Wrong: Missing database name
```env
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/?retryWrites=true
```

### ✅ Correct: Has /gjts_karnataka
```env
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/gjts_karnataka?retryWrites=true
```

---

### ❌ Wrong: Still has <password>
```env
MONGODB_URI=mongodb+srv://gjts_admin:<password>@cluster.mongodb.net/gjts_karnataka
```

### ✅ Correct: Real password
```env
MONGODB_URI=mongodb+srv://gjts_admin:MyActualPassword@cluster.mongodb.net/gjts_karnataka
```

---

## 🆘 Quick Troubleshooting

### Can't connect to MongoDB?
1. Check password is correct
2. Verify database name is `gjts_karnataka`
3. Check IP whitelist in Atlas (should be `0.0.0.0/0`)

### Seed script fails?
1. Verify connection string format
2. Test connection in Atlas dashboard
3. Check database user exists

### Website won't start?
1. Ensure .env file exists
2. Check all variables are set
3. Restart terminal
4. Run `npm install`

---

## 📚 Full Guides

For detailed help, read:
- **📝_ENV_SETUP_GUIDE.md** - Complete setup guide
- **🌐_MONGODB_ATLAS_GUIDE.md** - Atlas setup
- **⚡_MONGODB_ATLAS_QUICK_START.md** - Quick start

---

## 🔐 Security Notes

- ✅ .env is in .gitignore (won't be committed)
- ✅ Never share your .env file
- ✅ Use different credentials for production
- ✅ Keep passwords secure

---

## 💰 Free Tier Status

Your setup uses **0.05%** of the free tier:
- Storage: 255 KB of 512 MB
- No credit card required
- Never expires
- No charges

**You're safe!** 🎉

---

Built with ❤️ for GJTS Karnataka  
**Quick Setup**: 3 Steps, 5 Minutes ⚙️
