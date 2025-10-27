# 🧪 Testing Guide - Try These Features!

Now that your app is running, here's how to test everything.

## ✅ What's Working Right Now

### 1. **Homepage** (Working!)
- Browse the features
- Four action buttons: Student Login, Admin Login, Student Registration, Browse Courses

### 2. **Course Catalog** (Working!)
- View all courses
- Search functionality
- Filter by availability
- See schedules and seat counts

## 🧪 Testing Steps

### Test 1: Login as Admin

1. Click "Admin Login" button
2. Use these credentials:
   - Email: `admin@electivehub.com`
   - Password: `admin123`
3. You should see the Admin Dashboard with sample courses

**Expected Result:**
- ✓ Dashboard loads
- ✓ Shows list of courses from seed data
- ✓ Can see course details

### Test 2: Browse Course Catalog

1. Go back to homepage
2. Click "Browse Courses"
3. You should see 3 sample courses:
   - CS101 - Introduction to Computer Science
   - CS201 - Data Structures and Algorithms
   - MATH101 - Calculus I

**Expected Result:**
- ✓ All courses displayed in cards
- ✓ Search box works
- ✓ Filter dropdown works
- ✓ Can see schedules and seat counts

### Test 3: Register a Student Account

1. Click "Student Registration"
2. Fill in the form:
   - Name: Your Name
   - Email: your@email.com
   - Registration Number: REG12345
   - Department: Computer Science
   - Password: any password
   - Confirm Password: same password
3. Click "Register"

**Expected Result:**
- ✓ Registration successful message
- ✓ Automatically logged in
- ✓ Redirected to dashboard (empty since no registrations yet)

## 🚧 What's Not Yet Implemented

These features need to be built (Modules 4-8):

### Module 4: Student Dashboard
- View enrolled courses
- Drop courses
- See waitlist status

### Module 5: Course Registration
- Register for courses
- Conflict detection
- Credit limit checking

### Module 6: Real-Time Updates
- Socket.IO integration
- Live seat count updates

### Module 7: Waitlist System
- Automated waitlist
- Email notifications
- 24-hour confirmation window

### Module 8: Admin Course Management
- Create/edit/delete courses
- Add schedules to courses

## 🎯 Current Status

**Completed:**
- ✅ Project setup
- ✅ Database schema
- ✅ Authentication (login, register)
- ✅ Admin login page
- ✅ Student login page
- ✅ Registration page
- ✅ Course catalog display
- ✅ Admin dashboard
- ✅ API endpoints for courses

**Next Steps:**
- Student registration for courses
- Conflict detection
- Real-time updates
- Waitlist automation

## 💡 What You Can Do Now

1. **Explore the UI**: Click through all the pages
2. **Check the database**: Run `npm run prisma:studio` to see your data
3. **Test authentication**: Login/logout as different users
4. **Browse courses**: View the catalog

## 🎓 What's in the Database?

After running `npm run seed`, you have:

**Users:**
- 1 admin account (admin@electivehub.com)

**Courses:**
- CS101 - Introduction to Computer Science (30 seats)
- CS201 - Data Structures and Algorithms (25 seats)
- MATH101 - Calculus I (40 seats)

**Schedules:**
- Each course has multiple class times
- Stored in the schedules table

## 🐛 Troubleshooting

**Can't login?**
- Make sure you ran `npm run seed` after migrations
- Check browser console for errors

**Courses not showing?**
- Make sure the database has courses
- Run `npm run prisma:studio` to check

**API errors?**
- Check browser Network tab
- Look for 404 or 500 errors
- Make sure dev server is running

## 🎉 Success Indicators

You've set everything up correctly if:
- ✓ Homepage loads
- ✓ Can login as admin
- ✓ Admin dashboard shows 3 courses
- ✓ Course catalog displays all courses
- ✓ Can create a student account

## 🚀 Next: Implementing More Features

Would you like me to implement:
1. **Course registration** - Students can enroll in courses
2. **Student dashboard** - View and manage registrations
3. **Admin course creation** - Create new courses via UI
4. **Conflict detection** - Prevent scheduling conflicts
5. **Real-time updates** - Socket.IO integration

Tell me which feature you'd like to build next!

