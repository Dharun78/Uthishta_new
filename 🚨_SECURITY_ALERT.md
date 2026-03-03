# 🚨 SECURITY ALERT - IMMEDIATE ACTION REQUIRED

## ⚠️ Critical Security Issue Detected

Your `.env` file with real credentials was committed to GitHub and is publicly visible!

### 🔓 Exposed Credentials

The following sensitive information is exposed in your repository:

1. **MongoDB Password**: `Tsunade@106`
2. **MongoDB Username**: `dbuser`
3. **MongoDB Cluster**: `cluster0.eshla4d.mongodb.net`
4. **JWT Secret**: `Tsunade@106`
5. **Full Connection String**: Visible in commit history

### 🎯 Immediate Actions Required

#### 1. Change MongoDB Password (URGENT - Do This First!)

1. Go to [MongoDB Atlas](https://cloud.mongodb.com)
2. Login to your account
3. Go to "Database Access" in left sidebar
4. Find user `dbuser`
5. Click "Edit" → "Edit Password"
6. Generate a new strong password
7. Click "Update User"

**New password should be:**
- At least 16 characters
- Mix of uppercase, lowercase, numbers, symbols
- Example: `Xk9$mP2#vL8@qR5!nW7`

#### 2. Change JWT Secret

Generate a new secure JWT secret:
```bash
# On Windows PowerShell
-join ((48..57) + (65..90) + (97..122) | Get-Random -Count 32 | ForEach-Object {[char]$_})
```

#### 3. Remove .env from Git History

```bash
cd gjts-karnataka-website

# Remove .env from git tracking
git rm --cached .env

# Commit the removal
git commit -m "security: Remove .env file from repository"

# Push changes
git push origin main --force
```

#### 4. Update Your Local .env File

After changing passwords, update your local `.env`:

```env
MONGODB_URI=mongodb+srv://dbuser:YOUR_NEW_PASSWORD@cluster0.eshla4d.mongodb.net/gjts_karnataka?retryWrites=true&w=majority
JWT_SECRET=YOUR_NEW_32_CHAR_SECRET
```

**Important**: URL-encode special characters in password:
- `@` → `%40`
- `#` → `%23`
- `$` → `%24`
- `%` → `%25`
- `&` → `%26`

#### 5. Update Vercel Environment Variables

After changing credentials:
1. Go to Vercel dashboard
2. Project Settings → Environment Variables
3. Update `MONGODB_URI` with new password
4. Update `JWT_SECRET` with new secret
5. Redeploy

### 📋 For Vercel Deployment

Use these environment variables (with your NEW credentials):

```env
MONGODB_URI=mongodb+srv://dbuser:NEW_PASSWORD_HERE@cluster0.eshla4d.mongodb.net/gjts_karnataka?retryWrites=true&w=majority
JWT_SECRET=NEW_32_CHAR_SECRET_HERE
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-gmail-app-password
SMTP_FROM=noreply@gjts-karnataka.edu.in
NODE_ENV=production
NEXT_PUBLIC_API_URL=https://your-project.vercel.app
```

### ✅ Verification Checklist

After completing above steps:

- [ ] MongoDB password changed in Atlas
- [ ] JWT secret regenerated
- [ ] `.env` removed from git
- [ ] Local `.env` updated with new credentials
- [ ] Vercel environment variables updated
- [ ] Application tested with new credentials
- [ ] Old credentials no longer work

### 🔒 Best Practices Going Forward

1. **Never commit .env files** - They're in .gitignore now
2. **Use strong passwords** - 16+ characters, random
3. **Rotate secrets regularly** - Every 3-6 months
4. **Use different secrets** - Don't reuse passwords
5. **Enable MongoDB IP whitelist** - Restrict access
6. **Enable 2FA on MongoDB Atlas** - Extra security layer

### 📞 If You Need Help

If you're unsure about any step, ask before proceeding. Security is critical!

---

**Status**: ⚠️ UNRESOLVED - Action required immediately
**Priority**: 🔴 CRITICAL
**Impact**: Public exposure of database credentials
