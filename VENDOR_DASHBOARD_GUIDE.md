# 🏫 Vendor Dashboard - Complete Guide

## Overview

The Vendor Dashboard is a comprehensive school management system where each of the 6 GJTS schools has their own admin panel with unique credentials. School administrators can manage events, view alumni, send notifications, and update school information.

## 🔐 School-Specific Login Credentials

Each school has unique login credentials:

### GJTS Ballari
```
Username: admin_ballari
Password: ballari123
School ID: GJTS-BLR-001
URL: http://localhost:3000/dashboard/login
```

### GJTS Bhadravati
```
Username: admin_bhadravati
Password: bhadravati123
School ID: GJTS-BDV-002
URL: http://localhost:3000/dashboard/login
```

### GJTS Hubballi
```
Username: admin_hubballi
Password: hubballi123
School ID: GJTS-HBL-003
URL: http://localhost:3000/dashboard/login
```

### GJTS Bagalkot
```
Username: admin_bagalkot
Password: bagalkot123
School ID: GJTS-BGK-004
URL: http://localhost:3000/dashboard/login
```

### GJTS Kalburgi
```
Username: admin_kalburgi
Password: kalburgi123
School ID: GJTS-KLB-005
URL: http://localhost:3000/dashboard/login
```

### GJTS Mangalore
```
Username: admin_mangalore
Password: mangalore123
School ID: GJTS-MNG-006
URL: http://localhost:3000/dashboard/login
```

## 🚀 Quick Start

### Step 1: Access Dashboard
```
1. Open browser
2. Go to: http://localhost:3000/dashboard/login
3. Select your school from dropdown
4. Enter username and password
5. Click "Login to Dashboard"
```

### Step 2: Dashboard Overview
After login, you'll see:
- **Statistics Cards**: Total events, upcoming events, alumni count, emails sent
- **Recent Events**: List of your school's events
- **Navigation Tabs**: Overview, Events, Alumni, Notifications, Settings

### Step 3: Create Your First Event
```
1. Click "Events" tab
2. Click "Create New Event" button
3. Fill in event details
4. Enable "Send AI-Powered Email Notifications"
5. Click "Create Event & Publish"
```

## 📊 Dashboard Features

### 1. Overview Tab

**Statistics Dashboard**
- Total Events Created
- Upcoming Events
- Total Registered Alumni
- Total Emails Sent

**Recent Events List**
- View last 5 events
- Quick edit/delete actions
- Event status indicators

### 2. Events Tab

**Event Management**
- Create new events
- Edit existing events
- Delete events
- View event details
- Send notifications
- Track registrations

**Event Types Available:**
- Workshop
- Seminar
- Placement Drive
- Cultural Event
- Sports Event
- Alumni Meet
- Other

### 3. Alumni Tab

**Alumni Management**
- View all registered alumni
- Filter by graduation year
- Export alumni list
- View alumni profiles
- Contact alumni

### 4. Notifications Tab

**Email Management**
- View sent notifications
- Schedule future emails
- Email analytics
- Resend notifications
- Test email system

### 5. Settings Tab

**School Settings**
- Update school information
- Change password
- Email preferences
- Notification settings
- Profile management

## 🎯 Creating an Event

### Step-by-Step Guide

#### 1. Basic Information
```
Title: Annual Alumni Meet 2026
Description: Join us for our annual alumni gathering to reconnect and celebrate
Event Type: Alumni Meet
```

#### 2. Date & Time
```
Date: March 15, 2026
Time: 10:00 AM
Venue: School Auditorium
```

#### 3. Target Audience
Select who should receive notifications:
- ☑ All
- ☐ Students
- ☐ Alumni
- ☐ Faculty

#### 4. Registration (Optional)
```
☑ Registration Required
Registration Link: https://forms.google.com/...
Max Participants: 100
```

#### 5. Email Notification
```
☑ Send AI-Powered Email Notifications
```

This will trigger the AI Nudge System to send personalized emails to all registered alumni of your school.

### Event Creation Flow

```
Fill Form → Click "Create Event & Publish"
    ↓
Event Saved to Database
    ↓
AI Nudge System Activated (if enabled)
    ↓
Personalized Emails Sent to Alumni
    ↓
Dashboard Updated with Statistics
    ↓
Success Message Displayed
```

## 🔒 Security Features

### 1. **School-Specific Access**
- Each school can only access their own data
- Cannot view or modify other schools' information
- School ID embedded in JWT token

### 2. **JWT Authentication**
- Secure token-based authentication
- 24-hour token expiration
- Automatic logout on token expiry

### 3. **Role-Based Access**
- Admin: Full access
- Editor: Can create/edit events
- Viewer: Read-only access

### 4. **Password Security**
- Passwords hashed with bcrypt
- Minimum password requirements
- Password change functionality

## 📱 Dashboard Pages

### Login Page
```
URL: /dashboard/login
Features:
- School selection dropdown
- Username/password fields
- Remember me option
- Forgot password link
```

### Main Dashboard
```
URL: /dashboard
Features:
- Statistics overview
- Recent events
- Quick actions
- Navigation tabs
```

### Create Event Page
```
URL: /dashboard/events/create
Features:
- Event form
- Date/time picker
- Target audience selector
- Email notification toggle
```

### Event List Page
```
URL: /dashboard/events
Features:
- All events table
- Filter by status
- Search functionality
- Bulk actions
```

### Alumni List Page
```
URL: /dashboard/alumni
Features:
- Alumni directory
- Search and filter
- Export to CSV
- Contact options
```

## 🎨 UI/UX Features

### Modern Design
- Clean, professional interface
- Gradient backgrounds
- Card-based layout
- Smooth animations

### Responsive
- Works on desktop, tablet, mobile
- Touch-friendly interface
- Adaptive layouts

### Accessibility
- Keyboard navigation
- Screen reader support
- High contrast mode
- Focus indicators

## 📊 Analytics & Reports

### Event Analytics
- Total events created
- Events by type
- Attendance tracking
- Registration statistics

### Email Analytics
- Emails sent
- Delivery rate
- Open rate (if tracking enabled)
- Click-through rate

### Alumni Analytics
- Total alumni count
- Alumni by graduation year
- Alumni by occupation
- Engagement metrics

## 🔧 Customization

### Update School Information

```javascript
// In dashboard settings
{
  schoolName: "GJTS Ballari",
  address: "Ballari, Karnataka",
  phone: "08392-XXXXX",
  email: "admin@gjts-ballari.edu.in",
  website: "https://gjts-ballari.edu.in"
}
```

### Customize Email Templates

Edit `server/services/aiNudgeSystem.js`:

```javascript
// Change email colors
const primaryColor = '#0ea5e9'  // Your school color

// Customize greeting
const greeting = `Dear ${firstName}, ...`

// Add school logo
<img src="your-logo-url" alt="School Logo" />
```

### Add Custom Event Types

Edit event types in `server/models/Event.js`:

```javascript
eventType: {
  type: String,
  enum: [
    'workshop', 'seminar', 'placement', 
    'cultural', 'sports', 'alumni-meet',
    'your-custom-type',  // Add here
    'other'
  ]
}
```

## 🚀 Advanced Features

### 1. **Bulk Event Creation**
Upload CSV file with multiple events:
```csv
title,date,time,venue,type
"Workshop 1","2026-03-15","10:00 AM","Lab 1","workshop"
"Seminar 1","2026-03-20","2:00 PM","Auditorium","seminar"
```

### 2. **Scheduled Notifications**
Schedule emails for future date:
```javascript
{
  sendAt: "2026-03-10 09:00:00",
  event: eventId
}
```

### 3. **Email Templates**
Create reusable email templates:
```javascript
{
  name: "Alumni Meet Template",
  subject: "Join us for Alumni Meet!",
  body: "..."
}
```

### 4. **Multi-Admin Support**
Add multiple admins per school:
```javascript
{
  school: "Ballari",
  admins: [
    { username: "admin1", role: "admin" },
    { username: "editor1", role: "editor" }
  ]
}
```

## 📱 Mobile App (Future)

Coming soon:
- Native mobile app for iOS/Android
- Push notifications
- Offline mode
- Quick event creation
- Real-time analytics

## 🐛 Troubleshooting

### Issue: Cannot Login

**Check:**
1. Correct school selected?
2. Username/password correct?
3. Internet connection?
4. Browser cookies enabled?

**Solution:**
```
Clear browser cache
Try different browser
Check credentials
Contact support
```

### Issue: Events Not Saving

**Check:**
1. All required fields filled?
2. Valid date/time?
3. Internet connection?
4. Token not expired?

**Solution:**
```
Refresh page
Re-login
Check form validation
Try again
```

### Issue: Emails Not Sending

**Check:**
1. Email notification enabled?
2. SMTP configured?
3. Alumni emails valid?
4. Event published?

**Solution:**
See AI_NUDGE_SYSTEM_GUIDE.md

## 📞 Support

### For School Admins
- Email: support@gjtskarnataka.edu.in
- Phone: 080-XXXX-XXXX
- Hours: Mon-Fri, 9 AM - 5 PM

### For Technical Issues
- Email: tech@gjtskarnataka.edu.in
- Documentation: Check guide files
- FAQ: See below

## ❓ FAQ

**Q: Can I change my password?**
A: Yes, go to Settings → Change Password

**Q: Can I add more admins?**
A: Contact system administrator

**Q: How do I export alumni list?**
A: Alumni tab → Export → CSV

**Q: Can I schedule events?**
A: Yes, set future date when creating event

**Q: How do I cancel an event?**
A: Edit event → Change status to "Cancelled"

**Q: Can I resend notifications?**
A: Yes, Event details → Resend Notifications

**Q: How do I view email analytics?**
A: Notifications tab → Email Analytics

**Q: Can I customize email templates?**
A: Contact technical support for customization

## 🎓 Training Resources

### Video Tutorials (Coming Soon)
- Dashboard overview
- Creating events
- Managing alumni
- Email notifications
- Analytics and reports

### Documentation
- This guide
- AI_NUDGE_SYSTEM_GUIDE.md
- API documentation
- User manual

## 🔄 Updates & Changelog

### Version 1.0.0 (Current)
- Initial release
- Basic dashboard
- Event management
- AI email notifications
- Alumni management

### Planned Features
- Advanced analytics
- Mobile app
- Bulk operations
- Custom reports
- Integration with student portal

---

**Dashboard URL**: http://localhost:3000/dashboard/login

**Need Help?** Contact support@gjtskarnataka.edu.in

**Built with ❤️ for GJTS Karnataka Schools**
