# 🤖 AI Nudge System - Complete Guide

## Overview

The AI Nudge System is an intelligent email notification system that automatically sends personalized emails to registered alumni about school events. It uses AI to optimize email content, timing, and personalization.

## 🎯 Key Features

### 1. **AI-Powered Personalization**
- Personalizes greeting based on years since graduation
- Customizes subject lines based on event type
- Adapts content based on alumni profile
- Includes relevant context about their journey

### 2. **Smart Timing Optimization**
- Determines optimal send time based on alumni occupation
- Working professionals: 7-9 AM or 6-8 PM
- Students: 10 AM - 2 PM
- Maximizes email open rates

### 3. **Intelligent Filtering**
- Filters alumni by school
- Targets specific audiences (students, alumni, faculty, all)
- Only sends to verified alumni
- Respects event target audience settings

### 4. **Beautiful Email Templates**
- Professional HTML email design
- Responsive layout for all devices
- School-branded colors and logo
- Clear call-to-action buttons

### 5. **Event Reminders**
- Automatic reminders 3 days before event
- Personalized reminder content
- Prevents no-shows

## 📧 How It Works

### Step 1: School Admin Creates Event
```
Dashboard → Events → Create New Event
↓
Fill event details (title, date, venue, etc.)
↓
Enable "Send AI-Powered Email Notifications"
↓
Click "Create Event & Publish"
```

### Step 2: AI Nudge System Activates
```
Event Published
↓
AI Nudge System retrieves all alumni for that school
↓
Filters based on target audience
↓
For each alumnus:
  - Personalizes email content
  - Determines optimal send time
  - Sends email
↓
Updates event with email statistics
```

### Step 3: Alumni Receive Personalized Emails
```
Alumni receives email with:
- Personalized greeting
- Event details
- Registration link (if required)
- Personalized context about their journey
- Call-to-action button
```

## 🎨 Email Personalization Examples

### Example 1: Recent Graduate (2 years ago)
```
Subject: 🎓 Rahul, Join Us for Alumni Reunion at GJTS Hubballi!

Dear Rahul, we hope you're thriving in your career!

We're excited to share an upcoming event at your alma mater...

Your Journey: It's been 2 years since you graduated from GJTS Hubballi.
```

### Example 2: Mid-Career Alumni (5 years ago)
```
Subject: 💼 Career Opportunity Alert for GJTS Ballari Alumni

Hello Priya, it's been 5 years since graduation!

We're hosting a placement drive that might interest you...

Your Journey: It's been 5 years since you graduated from GJTS Ballari.
```

### Example 3: Senior Alumni (10+ years ago)
```
Subject: 📚 Dear Kumar, we'd love to reconnect with you!

We're organizing a knowledge session and would love your participation...

Your Journey: It's been 12 years since you graduated from GJTS Mangalore.
```

## 🔧 Configuration

### Environment Variables

Add to `.env` file:

```env
# Email Configuration
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password

# JWT Secret
JWT_SECRET=your-secret-key-here
```

### Gmail Setup (Recommended)

1. **Enable 2-Factor Authentication** on your Gmail account
2. **Generate App Password**:
   - Go to Google Account → Security
   - 2-Step Verification → App passwords
   - Select "Mail" and "Other (Custom name)"
   - Copy the 16-character password
3. **Add to .env**:
   ```
   SMTP_USER=your-email@gmail.com
   SMTP_PASS=xxxx-xxxx-xxxx-xxxx
   ```

## 📊 Email Analytics

The system tracks:
- Total emails sent
- Successful deliveries
- Failed deliveries
- Recipient count per event
- Send timestamp

View in Dashboard → Events → Event Details

## 🎯 Target Audience Options

| Audience | Description | Use Case |
|----------|-------------|----------|
| **All** | Everyone (students, alumni, faculty) | General announcements |
| **Alumni** | Only graduated students | Alumni-specific events |
| **Students** | Current students | Student workshops |
| **Faculty** | Teaching staff | Faculty meetings |

## 🚀 Usage Examples

### Example 1: Alumni Meet

```javascript
Event Details:
- Title: "Annual Alumni Meet 2026"
- Type: alumni-meet
- Target: Alumni
- Registration: Required
- Send Emails: Yes

Result:
✅ 45 emails sent to Ballari alumni
✅ Personalized for each recipient
✅ Registration link included
```

### Example 2: Technical Workshop

```javascript
Event Details:
- Title: "IoT Workshop"
- Type: workshop
- Target: All
- Registration: Not required
- Send Emails: Yes

Result:
✅ 150 emails sent (students + alumni)
✅ Different personalization for each group
✅ No registration link
```

### Example 3: Placement Drive

```javascript
Event Details:
- Title: "Campus Placement 2026"
- Type: placement
- Target: Students, Alumni
- Registration: Required (Max 100)
- Send Emails: Yes

Result:
✅ 95 emails sent
✅ Urgency highlighted
✅ Limited seats mentioned
```

## 🔄 Automated Reminders

### Setup Reminder Cron Job

Add to your server:

```javascript
// Run daily at 9 AM
const cron = require('node-cron')
const aiNudgeSystem = require('./services/aiNudgeSystem')

cron.schedule('0 9 * * *', async () => {
  console.log('Sending event reminders...')
  await aiNudgeSystem.sendEventReminders(3) // 3 days before
})
```

### Reminder Logic

```
Check all published events
↓
Find events 3 days away
↓
Send reminder emails to registered alumni
↓
Subject: "⏰ Reminder: [Event Name]"
```

## 📱 Email Template Features

### Responsive Design
- Works on desktop, tablet, mobile
- Optimized for Gmail, Outlook, Apple Mail
- Fallback for email clients without HTML support

### Branding
- School colors (blue gradient)
- GJTS logo placeholder
- Professional typography
- Consistent styling

### Call-to-Action
- Prominent "Register Now" button
- Clear event details
- Easy-to-read layout
- Contact information

## 🧪 Testing

### Test Email Configuration

```javascript
// In your server
const aiNudgeSystem = require('./services/aiNudgeSystem')

// Test connection
const result = await aiNudgeSystem.testEmailConfiguration()
console.log(result)
// { success: true, message: 'Email server is ready' }
```

### Send Test Email

```javascript
// Create a test event
const testEvent = {
  title: 'Test Event',
  description: 'This is a test',
  eventType: 'workshop',
  date: new Date(),
  time: '10:00 AM',
  venue: 'Test Venue',
  school: 'Ballari'
}

// Send to one alumni
const testAlumni = {
  name: 'Test User',
  email: 'your-test-email@gmail.com',
  school: 'Ballari',
  graduationYear: 2020
}

await aiNudgeSystem.sendEmailToAlumni(testAlumni, testEvent)
```

## 📈 Best Practices

### 1. **Event Timing**
- Create events at least 1 week in advance
- Send notifications 1-2 weeks before event
- Send reminders 3 days before

### 2. **Content Quality**
- Write clear, concise event descriptions
- Include all necessary details
- Add registration links if required
- Specify venue clearly

### 3. **Target Audience**
- Be specific about who should attend
- Don't spam all alumni for every event
- Use "All" sparingly

### 4. **Email Frequency**
- Don't send more than 2-3 emails per week
- Space out event notifications
- Respect alumni inbox

### 5. **Registration**
- Always provide registration link if required
- Specify max participants if limited
- Close registration when full

## 🔒 Privacy & Compliance

### GDPR Compliance
- Only sends to verified alumni
- Includes unsubscribe information
- Respects email preferences
- Secure data handling

### Data Protection
- Emails stored securely
- No sharing with third parties
- Alumni can opt-out anytime
- Transparent data usage

## 🐛 Troubleshooting

### Issue: Emails Not Sending

**Check:**
1. SMTP credentials in `.env`
2. Gmail app password (not regular password)
3. Internet connection
4. Email server status

**Solution:**
```bash
# Test email configuration
node -e "require('./server/services/aiNudgeSystem').testEmailConfiguration()"
```

### Issue: Emails Going to Spam

**Solutions:**
1. Use verified email domain
2. Add SPF/DKIM records
3. Avoid spam trigger words
4. Include unsubscribe link
5. Maintain good sender reputation

### Issue: Slow Email Sending

**Cause:** Rate limiting (100ms between emails)

**Solution:** This is intentional to avoid spam filters. For faster sending:
```javascript
// Reduce delay (not recommended)
await new Promise(resolve => setTimeout(resolve, 50))
```

## 📞 Support

For issues or questions:
- Check server logs
- Review email configuration
- Test with single email first
- Contact: tech@gjtskarnataka.edu.in

## 🎉 Success Metrics

Track these metrics:
- Email open rate (target: >30%)
- Click-through rate (target: >10%)
- Event registration rate
- Alumni engagement
- Email delivery rate (target: >95%)

---

**Built with ❤️ using AI and Node.js**
*Empowering alumni engagement through intelligent notifications*
