# 🎓 Registration Flow Testing Guide

## ✅ What's Been Implemented

### 1. **Course Registration API** (`/api/register/:courseId`)
- ✅ Transaction-safe registration (prevents overbooking)
- ✅ Conflict detection (schedule overlaps)
- ✅ Credit limit validation (max 20 credits)
- ✅ Automatic waitlist joining when seats are full
- ✅ Race condition protection using database transactions

### 2. **Student Dashboard** (`/dashboard`)
- ✅ View enrolled courses
- ✅ View waitlisted courses
- ✅ See total credits enrolled
- ✅ Drop course functionality
- ✅ Course schedules displayed

### 3. **Course Detail Page** (`/register-course/:courseId`)
- ✅ View course information
- ✅ See schedules
- ✅ Check seat availability
- ✅ Register button with toast notifications

## 🧪 Testing Steps

### Test 1: Register as a Student

1. **Go to homepage**: http://localhost:3000
2. **Click "Student Registration"**
3. **Fill in the form**:
   - Name: John Doe
   - Email: john@example.com
   - Reg Number: REG001
   - Department: Computer Science
   - Password: test123
4. **Click Register**

**Expected Result:**
- ✅ Registration successful
- ✅ Automatically logged in
- ✅ Redirected to dashboard

---

### Test 2: Browse and Register for a Course

1. **From dashboard**, click "Browse Courses"
2. **Find a course** (e.g., CS101 - Introduction to Computer Science)
3. **Click "Enroll Now"** or **"View Details"**
4. **On the course detail page**, click **"Register for Course"**

**Expected Result:**
- ✅ Success toast message
- ✅ Redirected back to dashboard
- ✅ Course appears in "Enrolled Courses"
- ✅ Credits updated

---

### Test 3: Test Conflict Detection (Schedule Overlap)

1. **Register for CS101** (Monday 9:00-10:30, Wednesday 9:00-10:30)
2. **Try to register for another course with overlapping times**
3. **Expected**: Error message about schedule conflict

---

### Test 4: Test Credit Limit

1. **Register for multiple courses** until you approach 20 credits
   - CS101: 3 credits
   - CS201: 4 credits  
   - MATH101: 3 credits
2. **Try to register for one more course** that would exceed 20 credits
3. **Expected**: Error message about credit limit exceeded

---

### Test 5: Test Waitlist

1. **Logout and create another student account**
2. **As admin**, you can manually set a course's remaining_seats to 0
3. **As the new student**, try to register
4. **Expected**: Added to waitlist successfully

---

### Test 6: Drop a Course

1. **Go to your dashboard**
2. **Find a course you're enrolled in**
3. **Click "Drop Course"**
4. **Confirm the action**

**Expected Result:**
- ✅ Course removed from enrolled list
- ✅ Credits updated
- ✅ Seat returned to the course

---

## 🎯 Key Features Explained

### Transaction Safety
The registration uses Prisma transactions to ensure that:
- Checking seats and registering happens atomically
- No race conditions (two students getting the last seat)
- Database is always in a consistent state

### Conflict Detection

**Schedule Conflicts:**
- Checks if any new class time overlaps with existing classes
- Compares day_of_week
- Checks time overlap: (start1 < end2) AND (end1 > start2)

**Credit Limits:**
- Maximum 20 credits per student
- Calculates total credits from all enrolled courses
- Prevents registration if new course would exceed limit

### Waitlist System

When seats are full:
- Student is added to waitlist
- `waitlist_current` is incremented
- Registration status is `WAITLISTED`
- Can be promoted to `PENDING_CONFIRMATION` when seat opens

---

## 🔍 API Endpoints to Know

### Register for a Course
```
POST /api/register/:courseId
Headers: { Authorization: "Bearer <token>" }
```

### Get My Registrations
```
GET /api/my-registrations
Headers: { Authorization: "Bearer <token>" }
Response: { registered: [...], waitlisted: [...], totalCredits: number }
```

### Drop a Course
```
POST /api/drop/:registrationId
Headers: { Authorization: "Bearer <token>" }
```

---

## 💡 Tips for Testing

1. **Use Chrome DevTools**: Open Network tab to see API calls
2. **Check Browser Console**: Look for any errors
3. **Try Different Scenarios**: 
   - Multiple registrations
   - Conflict scenarios
   - Edge cases (already enrolled, etc.)

4. **Database Inspection**: Run `npm run prisma:studio` to see data

---

## 🚧 Known Limitations (Next Steps)

These will be implemented in later modules:

1. **Real-time Updates**: Seat counts don't update live yet (needs Socket.IO)
2. **Waitlist Promotion**: Automatic promotion not implemented yet
3. **Email Notifications**: Waitlist promotions don't send emails yet
4. **PENDING_CONFIRMATION**: 24-hour timer not implemented yet

These are part of Modules 6-8 (Real-time updates, waitlist automation, notifications)

---

## ✅ Success Indicators

You've successfully tested the registration flow if:

- ✅ Can register students
- ✅ Can enroll in courses
- ✅ Dashboard shows enrolled courses
- ✅ Conflict detection works
- ✅ Credit limit enforcement works
- ✅ Can drop courses
- ✅ Waitlist works when seats full

---

## 🐛 Troubleshooting

**"Unauthorized" error?**
- Make sure you're logged in
- Check if token is in localStorage

**"Already registered" error?**
- Check if you're already enrolled
- Use dashboard to see current registrations

**"Schedule conflict" error?**
- Check your enrolled courses' schedules
- Try registering for a different course

---

**Next**: Implement real-time updates with Socket.IO! 🚀

