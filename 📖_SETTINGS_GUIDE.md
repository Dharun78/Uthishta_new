# 📖 SETTINGS PAGE - COMPLETE GUIDE

## 🎯 What is the Settings Page?

The Settings page allows Super Admin to configure system-wide settings that affect the entire GJTS Karnataka website.

**Access**: http://localhost:3001/dashboard/settings

---

## ⚙️ CURRENT SETTINGS

### 1. General Settings
**What it does**: Controls basic website information

**Settings Available**:
- **Site Name**: The name displayed across the website
- **Site Tagline**: Short description/motto
- **Contact Email**: Main contact email for the organization
- **Contact Phone**: Main phone number
- **Address**: Physical address of main office

**Why it matters**: These appear on every page and in search results

---

### 2. Email Notification Settings
**What it does**: Controls when and how email notifications are sent

**Settings Available**:
- **Enable Email Notifications**: Turn on/off all email notifications
- **Admin Email**: Where system notifications are sent
- **SMTP Configuration**: Email server settings
- **Notification Frequency**: How often to send digest emails

**Why it matters**: Keeps admins informed of important events

---

### 3. Social Media Links
**What it does**: Manages social media presence

**Settings Available**:
- Facebook Page URL
- Twitter Handle
- Instagram Profile
- LinkedIn Company Page
- YouTube Channel

**Why it matters**: Appears in footer and contact pages

---

### 4. Website Preferences
**What it does**: Controls website behavior

**Settings Available**:
- **Maintenance Mode**: Temporarily disable public access
- **Allow Alumni Registration**: Enable/disable new registrations
- **Show Chatbot**: Display AI chatbot on pages
- **Enable Analytics**: Track website visitors

**Why it matters**: Controls user experience and data collection

---

## 🔧 HOW TO USE SETTINGS

### For Super Admin:

1. **Login** as Super Admin
2. **Navigate** to Settings page
3. **Edit** any setting
4. **Click** "Save Settings"
5. **Changes** apply immediately across the website

### For School Admins:

School admins have limited settings access:
- Can view general settings
- Cannot modify system-wide settings
- Can only edit their school-specific settings

---

## 💡 COMMON USE CASES

### Use Case 1: Update Contact Information
```
Scenario: Main office phone number changed
Action: Go to Settings → General → Update Contact Phone → Save
Result: New number appears on Contact page and footer
```

### Use Case 2: Enable Maintenance Mode
```
Scenario: Need to perform system maintenance
Action: Go to Settings → Website Preferences → Enable Maintenance Mode
Result: Public website shows "Under Maintenance" message
        Admin dashboard still accessible
```

### Use Case 3: Configure Email Notifications
```
Scenario: Want to receive daily digest of activities
Action: Go to Settings → Email Notifications → Set Frequency to "Daily"
Result: Receive one email per day with all activities
```

### Use Case 4: Update Social Media Links
```
Scenario: Created new Instagram account
Action: Go to Settings → Social Media → Add Instagram URL → Save
Result: Instagram icon appears in footer with link
```

---

## 🎯 SETTINGS CATEGORIES EXPLAINED

### General Settings
**Purpose**: Basic website identity
**Impact**: High - affects entire site
**Update Frequency**: Rarely (only when org details change)

### Email Settings
**Purpose**: Communication configuration
**Impact**: Medium - affects notifications only
**Update Frequency**: Occasionally (when email server changes)

### Social Media
**Purpose**: Online presence management
**Impact**: Low - affects footer links only
**Update Frequency**: Occasionally (when accounts change)

### Website Preferences
**Purpose**: Feature toggles and behavior
**Impact**: High - affects user experience
**Update Frequency**: As needed (for maintenance, features)

---

## 🚨 IMPORTANT NOTES

### ⚠️ Maintenance Mode
- **What happens**: Public website becomes inaccessible
- **Who can access**: Only logged-in admins
- **Use when**: Performing updates, fixing bugs, data migration
- **Remember**: Turn it OFF when done!

### ⚠️ Email Configuration
- **SMTP Settings**: Requires valid email server credentials
- **Test First**: Use "Send Test Email" button before saving
- **Gmail Users**: Need to create App Password (not regular password)

### ⚠️ Analytics
- **Privacy**: Ensure compliance with data protection laws
- **Performance**: May slightly slow page load times
- **Data**: Stored in third-party service (Google Analytics, etc.)

---

## 🔐 SECURITY CONSIDERATIONS

### Who Can Access Settings?
- ✅ Super Admin: Full access to all settings
- ❌ School Admins: Read-only access to general settings
- ❌ Public Users: No access

### What's Protected?
- SMTP passwords are encrypted
- API keys are hidden after saving
- Sensitive settings require confirmation

### Best Practices:
1. Only change settings when necessary
2. Test changes in maintenance mode first
3. Keep backup of current settings
4. Document why changes were made

---

## 📊 SETTINGS IMPACT MATRIX

| Setting | Impact | Visibility | Risk |
|---------|--------|------------|------|
| Site Name | High | Public | Low |
| Contact Info | High | Public | Low |
| Maintenance Mode | Critical | Public | High |
| Email Config | Medium | Internal | Medium |
| Social Media | Low | Public | Low |
| Analytics | Medium | Internal | Low |

---

## 🎓 TRAINING GUIDE

### For New Admins:

**Step 1**: Familiarize yourself with current settings
- Review each section
- Understand what each setting does
- Note current values

**Step 2**: Make test changes
- Enable maintenance mode
- Update a social media link
- Save and verify changes

**Step 3**: Revert test changes
- Disable maintenance mode
- Restore original values
- Confirm everything works

**Step 4**: Document procedures
- Create checklist for common changes
- Note who to contact for help
- Keep settings backup

---

## 🆘 TROUBLESHOOTING

### Problem: Changes not appearing
**Solution**: 
1. Clear browser cache (Ctrl+Shift+R)
2. Check if settings were saved
3. Verify you're logged in as Super Admin

### Problem: Email notifications not working
**Solution**:
1. Check SMTP settings are correct
2. Test email server connection
3. Verify email addresses are valid
4. Check spam folder

### Problem: Can't access settings page
**Solution**:
1. Verify you're logged in as Super Admin
2. Check URL is correct
3. Clear cookies and login again

---

## 📞 SUPPORT

For settings-related issues:
1. Check this guide first
2. Review error messages
3. Test in maintenance mode
4. Contact system administrator

---

**Last Updated**: February 27, 2026
**Version**: 1.0
**Status**: ✅ Active
