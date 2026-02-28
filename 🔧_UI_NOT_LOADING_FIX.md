# 🔧 UI Not Loading - Quick Fix

## Issue
The UI is not loading on the page editors.

## Server Status
✅ Server is running on: **http://localhost:3003** (not 3002!)

## Possible Causes & Solutions

### 1. Wrong Port
**Problem**: Server is on port 3003, but you're accessing port 3002

**Solution**: Use the correct URL
```
http://localhost:3003/dashboard/pages
```

### 2. Browser Cache
**Problem**: Browser is showing old cached version

**Solution**: Hard refresh
- Press `Ctrl + Shift + R` (Windows)
- Or `Cmd + Shift + R` (Mac)
- Or open DevTools (F12) → Right-click refresh → "Empty Cache and Hard Reload"

### 3. CSS Not Loading
**Problem**: Tailwind CSS not compiling

**Solution**: Check browser console (F12) for CSS errors

### 4. JavaScript Errors
**Problem**: React components not rendering

**Solution**: 
1. Open browser console (F12)
2. Look for red errors
3. Share the error message

### 5. Infinite Loading
**Problem**: Page stuck on loading spinner

**Solution**: Check browser console for API errors

## Quick Diagnostic Steps

### Step 1: Check Server
Server should show:
```
✓ Ready in 4.2s
- Local: http://localhost:3003
```

### Step 2: Access Correct URL
```
http://localhost:3003/dashboard/login
```

Login with:
- Username: `superadmin`
- Password: `super123`

### Step 3: Navigate to CMS
```
http://localhost:3003/dashboard/pages
```

### Step 4: Check Browser Console
Press F12 and look for:
- ❌ Red errors
- ⚠️ Yellow warnings
- 🔵 Network errors (404, 500)

### Step 5: Check Network Tab
1. Open DevTools (F12)
2. Go to Network tab
3. Reload page
4. Look for failed requests (red)

## Common Issues

### Issue: "Cannot GET /dashboard/pages"
**Cause**: Server not running or wrong port

**Fix**: 
```bash
cd gjts-karnataka-website
npm run dev
```

### Issue: Plain text, no styling
**Cause**: CSS not loading

**Fix**:
1. Stop server (Ctrl+C)
2. Delete `.next` folder
3. Restart: `npm run dev`
4. Hard refresh browser

### Issue: Infinite loading spinner
**Cause**: API error or authentication issue

**Fix**:
1. Check browser console for errors
2. Verify you're logged in as Super Admin
3. Check MongoDB connection

### Issue: 404 Not Found
**Cause**: Route doesn't exist

**Fix**: Verify URL is correct:
- ✅ `http://localhost:3003/dashboard/pages`
- ❌ `http://localhost:3002/dashboard/pages` (wrong port)

## What to Check

### 1. Server Logs
Look at the terminal where `npm run dev` is running:
- Should show "✓ Ready"
- Should show "✓ Compiled"
- Should NOT show errors

### 2. Browser Console
Press F12 and check Console tab:
- Should NOT have red errors
- API calls should return 200 status

### 3. Network Tab
Press F12 → Network tab:
- CSS files should load (200 status)
- JS files should load (200 status)
- API calls should succeed (200 status)

## Emergency Reset

If nothing works, do a complete reset:

### Step 1: Stop Server
Press `Ctrl+C` in terminal

### Step 2: Clear Cache
```powershell
Remove-Item -Path ".next" -Recurse -Force
```

### Step 3: Restart Server
```bash
npm run dev
```

### Step 4: Hard Refresh Browser
Press `Ctrl + Shift + R`

### Step 5: Try Incognito
Open in incognito/private window to bypass all cache

## Still Not Working?

### Share This Information:
1. **Server output** - What does terminal show?
2. **Browser console errors** - Any red errors in F12 console?
3. **Network errors** - Any failed requests in F12 Network tab?
4. **What you see** - Blank page? Loading spinner? Plain text?
5. **URL you're using** - Exact URL in address bar

## Quick Test

Try this URL directly:
```
http://localhost:3003/dashboard/pages/home
```

If you see:
- ✅ **Loading spinner** - Good! Page is loading
- ✅ **Content with edit buttons** - Perfect! UI is working
- ❌ **Blank page** - CSS issue
- ❌ **Plain text** - CSS not loading
- ❌ **Error message** - Check console

---

**Current Server**: http://localhost:3003  
**CMS URL**: http://localhost:3003/dashboard/pages  
**Login**: superadmin / super123
