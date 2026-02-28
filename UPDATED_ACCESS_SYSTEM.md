# 🔐 Updated Access System - GJTS Karnataka Website

## Two-Tier Access Control

### Public Access (No Login Required)
**Who**: Normal users, students, parents, visitors

**Access**:
- Homepage: http://localhost:3000
- About page
- Schools listing
- Individual school pages
- Admissions information
- Alumni registration
- AI Chatbot

**Features**:
- Browse all school information
- View courses and facilities
- Read about admissions
- Register as alumni
- Chat with AI assistant
- No login required!

---

### Admin Access (Login Required)

#### 1. Super Admin
**Access Level**: ALL schools

**Credentials**:
- Username: `superadmin`
- Password: `super123`
- Login: http://localhost:3000/dashboard/login

**Permissions**:
- ✅ View all 6 schools
- ✅ Edit all schools' data
- ✅ Manage funds for all schools
- ✅ Manage grants for all schools
- ✅ Manage events for all schools
- ✅ Manage alumni for all schools
- ✅ View cross-school reports
- ✅ Add/remove school admins

**Dashboard Features**:
- School selector dropdown
- Global statistics
- Cross-school analytics
- System-wide settings

---

#### 2. School Admin
**Access Level**: ONLY their assigned school

**Credentials**:
| School | Username | Password |
|--------|----------|----------|
| Ballari | admin_ballari | ballari123 |
| Bhadravati | admin_bhadravati | bhadravati123 |
| Hubballi | admin_hubballi | hubballi123 |
| Bagalkot | admin_bagalkot | bagalkot123 |
| Kalburgi | admin_kalburgi | kalburgi123 |
| Mangalore | admin_mangalore | mangalore123 |

**Login**: http://localhost:3000/dashboard/login

**Permissions**:
- ✅ View own school only
- ✅ Edit own school's data
- ✅ Manage own school funds
- ✅ Manage own school grants
- ✅ Manage own school events
- ✅ Manage own school alumni
- ❌ Cannot access other schools
- ❌ Cannot edit other schools

**Dashboard Features**:
- Single school view
- School-specific statistics
- Event management
- Fund management
- Grant discovery
- Alumni management

---

## Access Flow

```
┌─────────────────────────────────────────────────────┐
│                   GJTS Website                      │
└─────────────────────────────────────────────────────┘
                        │
                        ├─────────────────────────────┐
                        │                             │
                   Public Pages                  Admin Login
                  (No Login)                  (/dashboard/login)
                        │                             │
                        │                             │
                ┌───────┴────────┐           ┌────────┴────────┐
                │                │           │                 │
            Homepage        Schools      Super Admin    School Admin
            About           Individual    (All Schools)  (Own School)
            Admissions      Chatbot
            Alumni
```

---

## Setup Instructions

### 1. Seed Admin Accounts
```bash
cd gjts-karnataka-website
node scripts/seed-admins.js
```

### 2. Access Public Website
Just open: http://localhost:3000

No login needed! Browse freely.

### 3. Access Admin Dashboard
Go to: http://localhost:3000/dashboard/login

**Super Admin**:
- Username: superadmin
- Password: super123

**School Admin** (example):
- Username: admin_ballari
- Password: ballari123

---

## Key Changes from Previous System

### ❌ Removed
- Normal user login
- User role
- User credentials
- Login requirement for public pages

### ✅ Simplified
- Only 2 roles: Super Admin & School Admin
- Public pages are completely open
- Login only for admin dashboard
- Cleaner access control

---

## Security

### Public Pages
- No authentication required
- Read-only access
- No sensitive data exposed
- Safe for public viewing

### Admin Dashboard
- JWT authentication required
- Role-based access control
- School-specific data isolation
- Secure password hashing
- Session management

---

## API Access Control

### Public APIs
- `/api/chatbot` - No auth required
- `/api/schools` - No auth required (if created)

### Admin APIs
- `/api/dashboard/*` - JWT required
- Role checked on every request
- School access verified
- Permissions enforced

---

## Testing

### Test Public Access
1. Open http://localhost:3000
2. Browse all pages
3. No login prompt
4. Full public access

### Test Super Admin
1. Go to http://localhost:3000/dashboard/login
2. Login as superadmin
3. See all 6 schools
4. Can edit any school

### Test School Admin
1. Go to http://localhost:3000/dashboard/login
2. Login as admin_ballari
3. See only Ballari data
4. Cannot access other schools

---

## Benefits

1. **Simpler for Users**: No login needed for public content
2. **Clearer Roles**: Only admin roles, no confusion
3. **Better UX**: Visitors can browse freely
4. **Easier Maintenance**: Fewer roles to manage
5. **More Secure**: Admin access clearly separated

---

## Summary

**Before**:
- 3 roles (Super Admin, School Admin, User)
- Users needed to login
- Complex permission system

**After**:
- 2 roles (Super Admin, School Admin)
- Public access without login
- Simple, clear access control

**Result**:
- Better user experience
- Simpler system
- Same admin functionality
- More accessible public content

---

Built with ❤️ for GJTS Karnataka
