# 🔐 Admin Credentials - GJTS Karnataka Website

## Two-Tier Access Control System

### Public Access (No Login Required) 🌐
**Who**: Everyone - students, parents, visitors, general public

**Access**:
- Homepage: http://localhost:3000
- All school pages
- About, Admissions, Alumni pages
- AI Chatbot
- All public content

**No login needed!** Just visit the website and browse freely.

---

### Admin Access (Login Required) 🔒

#### 1. Super Admin (Full Access)
**Access Level**: Can manage ALL schools and ALL data

**Credentials**:
- Username: `superadmin`
- Password: `super123`
- School: All
- School ID: GJTS-SUPER-000

**Login**: http://localhost:3000/dashboard/login

**Permissions**:
- ✅ Edit all schools
- ✅ View all reports
- ✅ Manage funds (all schools)
- ✅ Manage grants (all schools)
- ✅ Manage events (all schools)
- ✅ Manage alumni (all schools)
- ✅ Add/remove school admins

---

#### 2. School Admins (School-Specific Access)
**Access Level**: Can manage ONLY their own school's data

| School | Username | Password | School ID |
|--------|----------|----------|-----------|
| Ballari | admin_ballari | ballari123 | GJTS-BLR-001 |
| Bhadravati | admin_bhadravati | bhadravati123 | GJTS-BHD-002 |
| Hubballi | admin_hubballi | hubballi123 | GJTS-HUB-003 |
| Bagalkot | admin_bagalkot | bagalkot123 | GJTS-BAG-004 |
| Kalburgi | admin_kalburgi | kalburgi123 | GJTS-KLB-005 |
| Mangalore | admin_mangalore | mangalore123 | GJTS-MNG-006 |

**Login**: http://localhost:3000/dashboard/login

**Permissions**:
- ❌ Edit all schools
- ✅ Edit own school
- ✅ View reports
- ✅ Manage funds (own school)
- ✅ Manage grants (own school)
- ✅ Manage events (own school)
- ✅ Manage alumni (own school)

---

## Setup Instructions

### 1. Seed the Database
```bash
cd gjts-karnataka-website
node scripts/seed-admins.js
```

### 2. Access Public Website
Just open: **http://localhost:3000**

No login required! Browse all pages freely.

### 3. Access Admin Dashboard
Go to: **http://localhost:3000/dashboard/login**

Use credentials above based on your role.

---

## Access Comparison

| Feature | Public Users | School Admin | Super Admin |
|---------|-------------|--------------|-------------|
| View Website | ✅ | ✅ | ✅ |
| Use Chatbot | ✅ | ✅ | ✅ |
| Register Alumni | ✅ | ✅ | ✅ |
| Login Required | ❌ | ✅ | ✅ |
| View Dashboard | ❌ | ✅ | ✅ |
| Edit Own School | ❌ | ✅ | ✅ |
| Edit All Schools | ❌ | ❌ | ✅ |
| Manage Funds | ❌ | ✅ (own) | ✅ (all) |
| Manage Grants | ❌ | ✅ (own) | ✅ (all) |
| Manage Events | ❌ | ✅ (own) | ✅ (all) |

---

## Security Notes

1. **Public Pages**: No authentication, safe for everyone
2. **Admin Dashboard**: JWT authentication required
3. **Change Passwords**: Update default passwords in production
4. **Role-Based Access**: Enforced at API level
5. **School Isolation**: Admins can only access their school data

---

## Troubleshooting

**Cannot access public pages**:
- Just open http://localhost:3000
- No login needed!

**Cannot login to dashboard**:
- Run: `node scripts/seed-admins.js`
- Check credentials above
- Verify MongoDB is running

**Access denied in dashboard**:
- Check your role (Super Admin vs School Admin)
- School Admins can only access their own school
- Super Admin can access all schools

---

Built with ❤️ for GJTS Karnataka
