# 📧 Test Alumni Added for Email Nudge System

## ✅ Alumni Added Successfully

Two test alumni have been added to the database with real email addresses for testing the email nudge system.

---

## 👥 Test Alumni Details

### 1. Dharun A
- **Email**: `dharun.a@btech.christuniversity.in`
- **Phone**: +91-9876543210
- **School**: GJTS Hubballi
- **Graduation Year**: 2020
- **Current Occupation**: Software Engineer
- **Company**: Infosys Technologies
- **City**: Bangalore
- **Willing to Mentor**: Yes ✅
- **Willing to Donate**: Yes ✅
- **Registered**: January 15, 2024

### 2. Rahul Ramana
- **Email**: `rahul.ramana@btech.christuniversity.in`
- **Phone**: +91-9876543211
- **School**: GJTS Hubballi
- **Graduation Year**: 2020
- **Current Occupation**: Data Analyst
- **Company**: TCS Digital
- **City**: Bangalore
- **Willing to Mentor**: Yes ✅
- **Willing to Donate**: Yes ✅
- **Registered**: February 20, 2024

---

## 🧪 How to Test Email Nudge System

### Step 1: Login to Dashboard
1. Go to http://localhost:3000/dashboard/login
2. Login as Hubballi School Admin:
   - **Username**: `hubballi`
   - **Password**: `hubballi123`

### Step 2: Navigate to Alumni Page
1. Click on "Alumni" in the sidebar
2. You should see both test alumni in the list

### Step 3: Test Email Nudge
The email nudge system should automatically:
- Identify alumni willing to donate
- Send personalized email nudges
- Track engagement and responses

### Step 4: Verify in Dashboard
1. Check alumni list for these two entries
2. Verify their details are correct
3. Test any email functionality if implemented

---

## 📊 Alumni Statistics

Both alumni are:
- From the same school (Hubballi)
- Same graduation year (2020)
- Working in Bangalore
- Willing to mentor and donate
- Registered in early 2024

This makes them ideal candidates for testing:
- Email campaigns
- Donation requests
- Mentorship programs
- Alumni engagement initiatives

---

## 🔍 Finding Them in Dashboard

### As Hubballi Admin:
- Login with credentials above
- Go to Alumni page
- Search by name: "Dharun" or "Rahul"
- Search by email: "dharun.a@btech" or "rahul.ramana@btech"
- Filter by graduation year: 2020
- Filter by company: "Infosys" or "TCS"

### As Super Admin:
- Login with: username `super`, password `super123`
- Go to Alumni page
- Filter by school: "Hubballi"
- Search for the alumni

---

## 📧 Email Nudge System Features

The system should be able to:
1. **Identify Potential Donors**: Both alumni marked as willing to donate
2. **Send Personalized Emails**: Based on their profile and history
3. **Track Engagement**: Monitor email opens, clicks, responses
4. **Follow-up Campaigns**: Automated follow-ups based on engagement
5. **Donation Tracking**: Link emails to actual donations

---

## 🎯 Test Scenarios

### Scenario 1: Donation Campaign
- Target alumni willing to donate
- Send personalized email to both
- Track responses

### Scenario 2: Mentorship Program
- Target alumni willing to mentor
- Send invitation emails
- Track sign-ups

### Scenario 3: Event Invitation
- Send event invitations
- Track RSVPs
- Send reminders

### Scenario 4: Alumni Engagement
- Regular newsletters
- Success story features
- Community updates

---

## 🔧 Technical Details

### Database Collection: `alumnis`
```javascript
{
  name: String,
  email: String (unique),
  phone: String,
  school: String,
  graduationYear: Number,
  currentOccupation: String,
  company: String,
  city: String,
  willingToMentor: Boolean,
  willingToDonate: Boolean,
  registeredAt: Date
}
```

### Email Addresses (Real):
- dharun.a@btech.christuniversity.in
- rahul.ramana@btech.christuniversity.in

These are real Christ University email addresses that can receive emails.

---

## ⚠️ Important Notes

1. **Real Email Addresses**: These are actual email addresses, so any emails sent will be delivered
2. **Test Responsibly**: Don't spam these addresses with too many test emails
3. **Email Configuration**: Ensure your email service (SendGrid, etc.) is properly configured
4. **Rate Limits**: Be aware of email service rate limits during testing
5. **Unsubscribe**: Include unsubscribe links in all emails

---

## 🚀 Next Steps

1. ✅ Alumni added to database
2. ⏳ Configure email service (if not already done)
3. ⏳ Test email sending functionality
4. ⏳ Verify emails are received
5. ⏳ Test email tracking and analytics
6. ⏳ Test follow-up campaigns

---

## 📝 Script Location

The script used to add these alumni:
- **Path**: `scripts/add-test-alumni.js`
- **Usage**: `node scripts/add-test-alumni.js`
- **Function**: Adds/updates the two test alumni in the database

To re-run or update:
```bash
cd gjts-karnataka-website/scripts
node add-test-alumni.js
```

---

## ✅ Verification

To verify the alumni were added:
1. Login to MongoDB Atlas
2. Go to Collections → alumnis
3. Search for emails containing "christuniversity.in"
4. You should see both alumni entries

Or check via dashboard:
1. Login as Hubballi admin
2. Go to Alumni page
3. Search for "Dharun" or "Rahul"

---

## 🎉 Ready for Testing!

The test alumni are now in the database and ready for email nudge system testing. Both alumni have real email addresses and are marked as willing to donate and mentor, making them perfect for testing all email campaign features.
