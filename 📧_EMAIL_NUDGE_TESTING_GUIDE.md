# 📧 Email Nudge System Testing Guide

## ✅ Test Alumni Added

Two test alumni with real email addresses have been added to the database:

1. **Dharun A** - dharun.a@btech.christuniversity.in
2. **Rahul Ramana** - rahul.ramana@btech.christuniversity.in

Both are from GJTS Hubballi, graduated in 2020, and are willing to donate and mentor.

---

## 🔧 Email Configuration Required

The AI Email Nudge System requires SMTP configuration to send emails. You need to add these to your `.env` file:

### Option 1: Gmail SMTP (Recommended for Testing)

```env
# Email Configuration (Gmail)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
```

**How to get Gmail App Password:**
1. Go to Google Account Settings
2. Security → 2-Step Verification (enable if not enabled)
3. App Passwords → Generate new app password
4. Select "Mail" and "Other (Custom name)"
5. Copy the 16-character password
6. Use this password in SMTP_PASS

### Option 2: Other Email Services

**Outlook/Hotmail:**
```env
SMTP_HOST=smtp-mail.outlook.com
SMTP_PORT=587
SMTP_USER=your-email@outlook.com
SMTP_PASS=your-password
```

**SendGrid (Production):**
```env
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_USER=apikey
SMTP_PASS=your-sendgrid-api-key
```

---

## 🚀 Quick Setup Steps

### Step 1: Configure Email in .env

Add SMTP configuration to `gjts-karnataka-website/.env`:

```env
# Add these lines to your .env file
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
```

### Step 2: Restart the Server

After adding SMTP configuration:
```bash
# Stop the current server (Ctrl+C)
# Then restart:
npm run dev
```

### Step 3: Test Email Configuration

The system will automatically verify SMTP configuration on startup.

---

## 🧪 Testing the Email Nudge System

### Method 1: Create an Event (Recommended)

1. **Login to Dashboard**
   - Go to http://localhost:3000/dashboard/login
   - Login as Hubballi admin:
     - Username: `hubballi`
     - Password: `hubballi123`

2. **Create a Test Event**
   - Go to "Events" → "Create Event"
   - Fill in event details:
     - Title: "Alumni Reunion 2026"
     - Description: "Join us for our annual alumni reunion"
     - Date: Select a future date
     - Time: "10:00 AM"
     - Venue: "GJTS Hubballi Campus"
     - Event Type: "alumni-meet"
     - School: "Hubballi"
     - Target Audience: Select "Alumni"
     - Registration Required: Yes
     - Registration Link: "http://localhost:3000/events/register"
     - Max Participants: 100
     - **Send Email Notification: ✅ Check this box**

3. **Submit the Event**
   - Click "Create Event"
   - The AI Nudge System will automatically send personalized emails to all Hubballi alumni
   - Both test alumni (Dharun and Rahul) will receive emails

4. **Check Email Delivery**
   - Check the email inboxes:
     - dharun.a@btech.christuniversity.in
     - rahul.ramana@btech.christuniversity.in
   - You should see personalized event invitation emails

### Method 2: Direct API Testing

You can also test the email system directly via API:

```bash
# Test email configuration
curl -X POST http://localhost:5000/api/test-email

# Send event notifications (replace EVENT_ID)
curl -X POST http://localhost:5000/api/events/EVENT_ID/notify \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

## 📧 Email Features

The AI Email Nudge System includes:

### 1. Personalization
- Uses alumni's first name
- References graduation year
- Calculates years since graduation
- Customizes greeting based on time elapsed

### 2. AI-Powered Subject Lines
Different subject lines based on event type:
- Alumni Meet: "🎓 [Name], Join Us for Alumni Reunion!"
- Placement: "💼 Career Opportunity Alert"
- Workshop: "🔧 Exclusive Workshop"
- Seminar: "📚 Knowledge Session"
- Cultural: "🎉 Cultural Event"
- Sports: "⚽ Sports Event"

### 3. Beautiful HTML Email Template
- Responsive design
- School branding
- Event details card
- Call-to-action button
- AI personalization badge
- Professional footer

### 4. Smart Timing
AI determines optimal send time based on:
- Current occupation (students vs professionals)
- Time of day
- Engagement patterns

### 5. Rate Limiting
- 100ms delay between emails
- Prevents spam
- Respects email service limits

---

## 📊 Expected Email Content

When the test alumni receive emails, they will see:

**Subject:** 🎓 Dharun, Join Us for Alumni Reunion at GJTS Hubballi!

**Email Body:**
- Personalized greeting: "Dear Dharun, it's been 6 years since graduation!"
- Event details in a beautiful card
- Date, time, venue, event type
- Registration button (if applicable)
- "Why This Matters to You" section
- Personal journey note
- Professional footer with AI badge

---

## 🔍 Verification Steps

### 1. Check Server Logs
Look for these messages in the terminal:
```
Email configuration is valid
Email sent to dharun.a@btech.christuniversity.in: <message-id>
Email sent to rahul.ramana@btech.christuniversity.in: <message-id>
```

### 2. Check Email Inboxes
- Login to both email accounts
- Check inbox (and spam folder)
- Verify email received
- Check personalization is correct

### 3. Check Database
Event should be updated with:
- `emailSent: true`
- `emailSentAt: [timestamp]`
- `recipientCount: 2`

---

## 🎯 Test Scenarios

### Scenario 1: Event Notification
✅ Create event with email notification enabled
✅ Verify both alumni receive emails
✅ Check personalization (names, years, etc.)
✅ Verify HTML rendering
✅ Test registration link

### Scenario 2: Different Event Types
Test different event types to see different subject lines:
- Alumni Meet
- Workshop
- Seminar
- Cultural Event
- Sports Event

### Scenario 3: Email Reminders
The system can send reminders 3 days before events:
```javascript
// This would be scheduled in production
await aiNudgeSystem.sendEventReminders(3)
```

---

## 🐛 Troubleshooting

### Problem: Emails not sending

**Check 1: SMTP Configuration**
```bash
# Verify .env has SMTP settings
cat .env | grep SMTP
```

**Check 2: Email Credentials**
- Verify Gmail app password is correct
- Check 2-step verification is enabled
- Try generating new app password

**Check 3: Server Logs**
Look for error messages in terminal

**Check 4: Firewall/Network**
- Port 587 must be open
- Check corporate firewall settings

### Problem: Emails go to spam

**Solutions:**
- Use a verified email domain
- Add SPF/DKIM records (production)
- Use professional email service (SendGrid)
- Ask recipients to mark as "Not Spam"

### Problem: Rate limiting errors

**Solutions:**
- Reduce batch size
- Increase delay between emails
- Use professional email service with higher limits

---

## 📝 Current Configuration Status

### ✅ Completed:
- Test alumni added to database
- AI Email Nudge System implemented
- Email templates created
- Personalization logic ready
- Event creation with email option

### ⏳ Pending:
- SMTP configuration in .env
- Email service credentials
- Testing with real emails

---

## 🚀 Next Steps

1. **Add SMTP Configuration**
   - Choose email service (Gmail recommended for testing)
   - Get credentials (app password for Gmail)
   - Add to .env file

2. **Restart Server**
   - Stop current server
   - Start with new configuration

3. **Create Test Event**
   - Login as Hubballi admin
   - Create event with email notification
   - Verify emails sent

4. **Check Email Delivery**
   - Check both test email accounts
   - Verify personalization
   - Test links and buttons

5. **Monitor and Optimize**
   - Check delivery rates
   - Monitor spam reports
   - Optimize send times

---

## 📧 Email Service Recommendations

### For Testing:
- **Gmail**: Free, easy setup, 500 emails/day limit
- **Outlook**: Free, similar to Gmail

### For Production:
- **SendGrid**: 100 emails/day free, professional features
- **Mailgun**: 5,000 emails/month free
- **Amazon SES**: Very cheap, reliable
- **Postmark**: Excellent deliverability

---

## ✅ Ready to Test!

Once you add SMTP configuration to your .env file and restart the server, you can:

1. Create an event with email notification enabled
2. Watch as personalized emails are sent to Dharun and Rahul
3. Check their inboxes for beautifully formatted, AI-personalized emails
4. Test the registration links and engagement tracking

The system is fully implemented and ready to send emails as soon as SMTP is configured!
