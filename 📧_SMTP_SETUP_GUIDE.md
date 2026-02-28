# 📧 SMTP Setup Guide - Send Real Emails

## 🎯 Current Status

The email system is currently **simulating** emails (logging to console only). To send real emails to the test alumni (Dharun & Rahul), you need to configure SMTP.

---

## ⚡ Quick Setup (Gmail - Recommended)

### Step 1: Get Gmail App Password

1. **Go to Google Account Settings**
   - Visit: https://myaccount.google.com/
   - Click on "Security" in the left sidebar

2. **Enable 2-Step Verification** (if not already enabled)
   - Scroll to "How you sign in to Google"
   - Click "2-Step Verification"
   - Follow the setup process

3. **Generate App Password**
   - Go back to Security
   - Scroll to "How you sign in to Google"
   - Click "App passwords" (or "2-Step Verification" → "App passwords")
   - Select "Mail" and "Other (Custom name)"
   - Enter name: "GJTS Website"
   - Click "Generate"
   - **Copy the 16-character password** (e.g., "abcd efgh ijkl mnop")

### Step 2: Update .env File

Open `gjts-karnataka-website/.env` and update these lines:

```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-actual-email@gmail.com
SMTP_PASS=abcdefghijklmnop
```

**Replace:**
- `your-actual-email@gmail.com` with your Gmail address
- `abcdefghijklmnop` with the 16-character app password (remove spaces)

### Step 3: Restart Server

```bash
# Stop the server (Ctrl+C in terminal)
# Then restart:
npm run dev
```

### Step 4: Test!

1. Login to dashboard
2. Create a new event
3. Check "Send Email Notification"
4. Submit
5. Check the email inboxes:
   - dharun.a@btech.christuniversity.in
   - rahul.ramana@btech.christuniversity.in

---

## 📧 What Will Happen

### Before SMTP Configuration:
```
⚠️  SMTP not configured - simulating email sends
✅ Email simulated to: Dharun A (dharun.a@btech.christuniversity.in)
✅ Email simulated to: Rahul Ramana (rahul.ramana@btech.christuniversity.in)
```

### After SMTP Configuration:
```
📧 Sending REAL emails for event: Alumni Meet
📧 Recipients: 52 alumni
✅ Email sent to: Dharun A (dharun.a@btech.christuniversity.in) - ID: <message-id>
✅ Email sent to: Rahul Ramana (rahul.ramana@btech.christuniversity.in) - ID: <message-id>
... and 50 more
```

---

## 📨 Email Features

When SMTP is configured, alumni will receive:

### Beautiful HTML Email with:
- 🎓 School branding header
- 📧 Personalized greeting with first name
- 📅 Event details in formatted card
- 🕐 Date, time, venue information
- 🎯 Event type badge
- ⚠️  Registration info (if required)
- 🔗 Registration button (if link provided)
- 💡 "Why Attend?" section
- 📧 Professional footer

### Example Email:
```
Subject: 🎓 Dharun, Join Us for Alumni Meet at GJTS Hubballi!

Dear Dharun,

We're excited to invite you to an upcoming event at your alma mater, GJTS Hubballi!

[Event Card with all details]

[Register Now Button]

Why Attend?
• Reconnect with your alma mater
• Network with fellow alumni
• Share your experiences
• Stay updated

Warm regards,
GJTS Hubballi Team
```

---

## 🔧 Alternative Email Services

### Option 1: Gmail (Recommended for Testing)
- **Pros**: Free, easy setup, reliable
- **Cons**: 500 emails/day limit
- **Best for**: Testing and small-scale use

```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
```

### Option 2: Outlook/Hotmail
- **Pros**: Free, good for personal use
- **Cons**: Lower sending limits

```env
SMTP_HOST=smtp-mail.outlook.com
SMTP_PORT=587
SMTP_USER=your-email@outlook.com
SMTP_PASS=your-password
```

### Option 3: SendGrid (Production)
- **Pros**: 100 emails/day free, professional features
- **Cons**: Requires signup

```env
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_USER=apikey
SMTP_PASS=your-sendgrid-api-key
```

### Option 4: Mailgun (Production)
- **Pros**: 5,000 emails/month free
- **Cons**: Requires signup and domain verification

```env
SMTP_HOST=smtp.mailgun.org
SMTP_PORT=587
SMTP_USER=postmaster@your-domain.mailgun.org
SMTP_PASS=your-mailgun-password
```

---

## 🐛 Troubleshooting

### Problem: "Invalid login" error

**Solution:**
1. Make sure 2-Step Verification is enabled
2. Use App Password, not your regular Gmail password
3. Remove spaces from the app password
4. Try generating a new app password

### Problem: Emails go to spam

**Solutions:**
1. Ask recipients to mark as "Not Spam"
2. Use a verified email domain (production)
3. Add SPF/DKIM records (production)
4. Use professional email service like SendGrid

### Problem: "Connection timeout"

**Solutions:**
1. Check firewall settings
2. Ensure port 587 is open
3. Try port 465 with `secure: true`
4. Check antivirus software

### Problem: Rate limiting

**Solutions:**
1. System already has 100ms delay between emails
2. Use professional email service for bulk sending
3. Gmail limit: 500 emails/day
4. SendGrid free: 100 emails/day

---

## ✅ Verification Checklist

Before testing:
- [ ] 2-Step Verification enabled on Gmail
- [ ] App Password generated
- [ ] .env file updated with correct credentials
- [ ] App password has no spaces
- [ ] Server restarted after .env changes

After testing:
- [ ] Check server console for "REAL emails sent" message
- [ ] Check dharun.a@btech.christuniversity.in inbox
- [ ] Check rahul.ramana@btech.christuniversity.in inbox
- [ ] Check spam folder if not in inbox
- [ ] Verify email formatting looks good

---

## 📊 Current Configuration

### .env File Location:
`gjts-karnataka-website/.env`

### Current Settings:
```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com          ← UPDATE THIS
SMTP_PASS=your-app-password-here        ← UPDATE THIS
```

### What to Update:
1. Replace `your-email@gmail.com` with your Gmail
2. Replace `your-app-password-here` with 16-char app password
3. Save file
4. Restart server

---

## 🎯 Quick Test

After configuring SMTP:

1. **Create Test Event**:
   - Title: "Test Email System"
   - Date: Tomorrow
   - Time: "10:00 AM"
   - Venue: "GJTS Hubballi"
   - School: Hubballi
   - ✅ Send Email Notification

2. **Check Console**:
   ```
   📧 Sending REAL emails...
   ✅ Email sent to: Dharun A...
   ✅ Email sent to: Rahul Ramana...
   ```

3. **Check Inboxes**:
   - dharun.a@btech.christuniversity.in
   - rahul.ramana@btech.christuniversity.in

4. **Verify Email**:
   - Beautiful HTML formatting
   - Personalized greeting
   - All event details
   - Registration button (if provided)

---

## 🚀 Ready to Send Real Emails!

Once you update the .env file with your Gmail credentials and restart the server, the system will automatically send real emails to all alumni when you create an event with email notification enabled.

The two test alumni (Dharun and Rahul) will receive actual emails at their Christ University addresses!
