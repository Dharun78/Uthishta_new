# 🔑 Login Credentials

## Super Admin (Access All Schools)

**Username:** `super`  
**Password:** `super123`  
**School:** Select "All Schools" from dropdown

After login:
- Can view all schools' data
- Has school filter dropdown to switch between schools
- Can select "All Schools" to see aggregated data

---

## School Admins (Individual Schools)

### Ballari
**Username:** `ballari`  
**Password:** `ballari123`  
**School:** Select "GJTS Ballari"

### Bhadravati
**Username:** `bhadravati`  
**Password:** `bhadravati123`  
**School:** Select "GJTS Bhadravati"

### Hubballi
**Username:** `hubballi`  
**Password:** `hubballi123`  
**School:** Select "GJTS Hubballi"

### Bagalkot
**Username:** `bagalkot`  
**Password:** `bagalkot123`  
**School:** Select "GJTS Bagalkot"

### Kalburgi
**Username:** `kalburgi`  
**Password:** `kalburgi123`  
**School:** Select "GJTS Kalburgi"

### Mangalore
**Username:** `mangalore`  
**Password:** `mangalore123`  
**School:** Select "GJTS Mangalore"

After login:
- Can only view their own school's data
- No school filter dropdown (locked to their school)

---

## Login Page URL

**http://localhost:3000/dashboard/login**

---

## School Dropdown Options

The "Select School" dropdown now includes:
1. **All Schools** - For Super Admin only
2. **GJTS Ballari**
3. **GJTS Bhadravati**
4. **GJTS Hubballi**
5. **GJTS Bagalkot**
6. **GJTS Kalburgi**
7. **GJTS Mangalore**

---

## Quick Test

1. **Test Super Admin:**
   - Username: `super`
   - Password: `super123`
   - School: `All Schools`
   - ✅ Should see filter dropdown after login

2. **Test School Admin:**
   - Username: `ballari`
   - Password: `ballari123`
   - School: `GJTS Ballari`
   - ✅ Should NOT see filter dropdown after login
