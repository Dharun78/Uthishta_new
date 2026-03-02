# 🚀 Vercel Deployment Guide

## ✅ Pre-Deployment Checklist

Your project is **READY** for Vercel deployment! Here's what's configured:

### ✓ Configuration Files
- ✅ `package.json` - All dependencies configured
- ✅ `next.config.js` - Optimized for production
- ✅ `vercel.json` - Vercel-specific configuration
- ✅ `.gitignore` - Excludes node_modules and .next
- ✅ `lib/mongodb.js` - Connection pooling for serverless

### ✓ Required Features
- ✅ Next.js 14 App Router
- ✅ MongoDB connection with caching
- ✅ API routes properly structured
- ✅ Environment variables configured
- ✅ Image optimization setup

---

## 📋 Step-by-Step Deployment

### 1. Prepare MongoDB Atlas (Required)

Since Vercel is serverless, you need MongoDB Atlas (cloud database):

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free cluster (M0 tier is free forever)
3. Create a database user with password
4. Whitelist all IPs: `0.0.0.0/0` (for Vercel's dynamic IPs)
5. Get your connection string:
   ```
   mongodb+srv://username:password@cluster.mongodb.net/gjts_karnataka?retryWrites=true&w=majority
   ```

### 2. Deploy to Vercel

#### Option A: Deploy via GitHub (Recommended)

1. **Push to GitHub** (Already done! ✅)
   ```bash
   git push origin main
   ```

2. **Connect to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Click "Add New Project"
   - Import your GitHub repository: `Dharun78/Uthishta_new`
   - Select the `gjts-karnataka-website` folder as root directory

3. **Configure Environment Variables**
   
   In Vercel dashboard, add these environment variables:

   ```env
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/gjts_karnataka?retryWrites=true&w=majority
   JWT_SECRET=your-super-secret-jwt-key-min-32-characters-long
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=587
   SMTP_USER=your-email@gmail.com
   SMTP_PASS=your-app-password
   SMTP_FROM=noreply@gjts-karnataka.edu.in
   NODE_ENV=production
   NEXT_PUBLIC_API_URL=https://your-project.vercel.app
   ```

4. **Deploy**
   - Click "Deploy"
   - Wait 2-3 minutes for build to complete
   - Your site will be live at `https://your-project.vercel.app`

#### Option B: Deploy via Vercel CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy (from gjts-karnataka-website directory)
cd gjts-karnataka-website
vercel

# Follow prompts to set up project
# Add environment variables when prompted

# Deploy to production
vercel --prod
```

---

## 🔐 Environment Variables Setup

### Required Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `MONGODB_URI` | MongoDB Atlas connection string | `mongodb+srv://user:pass@cluster.mongodb.net/gjts_karnataka` |
| `JWT_SECRET` | Secret key for JWT tokens (min 32 chars) | `your-super-secret-jwt-key-change-this` |
| `SMTP_HOST` | Email server host | `smtp.gmail.com` |
| `SMTP_PORT` | Email server port | `587` |
| `SMTP_USER` | Email username | `your-email@gmail.com` |
| `SMTP_PASS` | Email password/app password | `your-app-password` |
| `SMTP_FROM` | From email address | `noreply@gjts-karnataka.edu.in` |
| `NODE_ENV` | Environment | `production` |
| `NEXT_PUBLIC_API_URL` | Public API URL | `https://your-project.vercel.app` |

### How to Add in Vercel

1. Go to your project in Vercel dashboard
2. Click "Settings" → "Environment Variables"
3. Add each variable with its value
4. Select "Production", "Preview", and "Development" environments
5. Click "Save"
6. Redeploy the project

---

## 📧 Email Configuration (Gmail)

To use Gmail for sending emails:

1. **Enable 2-Factor Authentication** on your Gmail account
2. **Generate App Password**:
   - Go to Google Account → Security
   - Enable 2-Step Verification
   - Go to App Passwords
   - Generate password for "Mail"
   - Use this password in `SMTP_PASS`

3. **Environment Variables**:
   ```env
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=587
   SMTP_USER=your-email@gmail.com
   SMTP_PASS=your-16-char-app-password
   SMTP_FROM=noreply@gjts-karnataka.edu.in
   ```

---

## 🗄️ Database Seeding

After deployment, seed your database:

### Option 1: Run Locally (Recommended)

```bash
# Set production MongoDB URI in .env
MONGODB_URI=mongodb+srv://...

# Run seed scripts
npm run seed:admins
node scripts/seed-all-data.js
```

### Option 2: Create API Endpoint

Create a protected API route to seed data:

```javascript
// app/api/admin/seed/route.js
import { NextResponse } from 'next/server'
import dbConnect from '@/lib/mongodb'
// Import seed functions

export async function POST(request) {
  // Add authentication check
  const { authorization } = request.headers
  if (authorization !== `Bearer ${process.env.ADMIN_SEED_TOKEN}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  await dbConnect()
  // Run seed functions
  
  return NextResponse.json({ success: true })
}
```

Then call it once:
```bash
curl -X POST https://your-project.vercel.app/api/admin/seed \
  -H "Authorization: Bearer your-secret-token"
```

---

## 🔍 Post-Deployment Checks

After deployment, verify:

1. ✅ **Homepage loads**: Visit your Vercel URL
2. ✅ **Database connection**: Check Vercel logs for MongoDB connection
3. ✅ **API routes work**: Test `/api/dashboard/pages`
4. ✅ **Authentication**: Try logging in to dashboard
5. ✅ **Custom pages**: Create a test custom page
6. ✅ **Email sending**: Test contact form
7. ✅ **Chatbot**: Test the grants chatbot

### Check Vercel Logs

```bash
# View real-time logs
vercel logs --follow

# View specific deployment logs
vercel logs [deployment-url]
```

---

## 🐛 Common Issues & Solutions

### Issue 1: MongoDB Connection Timeout

**Error**: `MongooseServerSelectionError: connection timed out`

**Solution**:
- Whitelist all IPs in MongoDB Atlas: `0.0.0.0/0`
- Check connection string format
- Ensure database user has correct permissions

### Issue 2: Environment Variables Not Working

**Error**: `undefined` values in production

**Solution**:
- Redeploy after adding environment variables
- Check variable names match exactly (case-sensitive)
- For client-side variables, use `NEXT_PUBLIC_` prefix

### Issue 3: Build Fails

**Error**: Build errors during deployment

**Solution**:
```bash
# Test build locally first
npm run build

# Check for TypeScript/ESLint errors
npm run lint
```

### Issue 4: API Routes Return 404

**Error**: API routes not found

**Solution**:
- Ensure files are in `app/api/` directory
- Check file naming: `route.js` not `index.js`
- Verify dynamic routes use `[param]` syntax

### Issue 5: Images Not Loading

**Error**: Images fail to load

**Solution**:
- Add image domains to `next.config.js`:
  ```javascript
  images: {
    domains: ['images.unsplash.com', 'your-domain.com'],
  }
  ```

---

## 🎯 Performance Optimization

Your project is already optimized with:

- ✅ SWC minification enabled
- ✅ Compression enabled
- ✅ Image optimization configured
- ✅ MongoDB connection pooling
- ✅ React strict mode

### Additional Optimizations

1. **Enable Edge Runtime** for faster API routes:
   ```javascript
   // app/api/some-route/route.js
   export const runtime = 'edge'
   ```

2. **Add ISR (Incremental Static Regeneration)**:
   ```javascript
   // app/page.js
   export const revalidate = 3600 // Revalidate every hour
   ```

3. **Use Vercel Analytics**:
   ```bash
   npm install @vercel/analytics
   ```

---

## 🔄 Continuous Deployment

Vercel automatically deploys when you push to GitHub:

```bash
# Make changes
git add .
git commit -m "Update feature"
git push origin main

# Vercel automatically builds and deploys
```

### Preview Deployments

Every pull request gets a preview URL:
- Create a branch: `git checkout -b feature-name`
- Push changes: `git push origin feature-name`
- Create PR on GitHub
- Vercel creates preview deployment

---

## 📊 Monitoring

### Vercel Dashboard

Monitor your deployment:
- Real-time logs
- Build history
- Performance metrics
- Error tracking

### MongoDB Atlas

Monitor database:
- Connection metrics
- Query performance
- Storage usage
- Alerts

---

## 🎉 You're Ready!

Your GJTS Karnataka website is fully configured for Vercel deployment. Just:

1. ✅ Set up MongoDB Atlas
2. ✅ Add environment variables in Vercel
3. ✅ Deploy via GitHub or CLI
4. ✅ Seed your database
5. ✅ Test everything

**Estimated deployment time**: 5-10 minutes

**Your site will be live at**: `https://your-project.vercel.app`

---

## 📞 Support

If you encounter issues:

1. Check Vercel logs: `vercel logs`
2. Check MongoDB Atlas logs
3. Review [Vercel Documentation](https://vercel.com/docs)
4. Review [Next.js Documentation](https://nextjs.org/docs)

---

## 🔗 Useful Links

- [Vercel Dashboard](https://vercel.com/dashboard)
- [MongoDB Atlas](https://cloud.mongodb.com)
- [Next.js Deployment Docs](https://nextjs.org/docs/deployment)
- [Vercel Environment Variables](https://vercel.com/docs/concepts/projects/environment-variables)
