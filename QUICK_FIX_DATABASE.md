# ⚡ Quick Database Fix

## Your Problem
```
Can't reach database server at db.fjygvzgsinjoxvwzuwbr.supabase.co:5432
```

Your Supabase project is likely deleted or paused.

## ⚡ Quick Solution (5 Minutes)

### Step 1: Get Fresh Database Connection

**Option A: Create New Supabase Project**
1. Go to: https://supabase.com
2. Sign in with your account
3. Click "New Project"
4. Project name: `electivehub`
5. Password: `electivehub123` (remember this!)
6. Region: Choose closest
7. Click "Create new project"
8. Wait 2 minutes for it to finish

**Option B: Use Existing Project**
- Go to Supabase dashboard
- If your project shows "Paused", click "Restore"

### Step 2: Copy Connection String

1. In Supabase dashboard, click your project
2. Settings → Database
3. Scroll to "Connection string"
4. Click "URI" tab
5. Copy the FULL string

It should look like:
```
postgresql://postgres.xxxxx:password@aws-0-region.pooler.supabase.com:5432/postgres
```

### Step 3: Update .env

Open `.env` and replace DATABASE_URL:

**Current (broken):**
```env
DATABASE_URL="postgresql://postgres:db2admin@db.fjygvzgsinjoxvwzuwbr.supabase.co:5432/postgres"
```

**Replace with (from Supabase):**
```env
DATABASE_URL="paste-full-string-from-supabase-here"
JWT_SECRET="electivehub-secret-key"
NODE_ENV="development"
```

### Step 4: Run This Command

```bash
npm run prisma:migrate
```

When prompted:
- Type: `ElectiveHub_database` (or any name)
- Press Enter

Then run:
```bash
npm run seed
```

This creates the database tables and adds the admin account.

### Step 5: Restart Server

If server is running:
- Press Ctrl+C to stop
- Then: `npm run dev`

### Step 6: Test Login

Go to: http://localhost:3000/login/admin
- Email: `admin@electivehub.com`
- Password: `admin123`

---

## 🎯 What This Does

1. Creates database tables (users, courses, schedules, registrations)
2. Adds admin account
3. Adds 3 sample courses

---

## ✅ Success!

You'll know it works when:
- ✅ Server starts without errors
- ✅ Can login as admin
- ✅ See "Dashboard" instead of errors

---

## 🆘 Still Not Working?

### Check Your Connection String
- Make sure you copied the ENTIRE string
- No spaces or extra characters
- Should start with `postgresql://`

### Common Mistakes
- ❌ Forgetting to replace the connection string
- ❌ Wrong password in connection string
- ❌ Using old connection string

### Alternative: Local Database

If Supabase keeps failing:
1. Install PostgreSQL: https://www.postgresql.org/download/windows/
2. Update .env to: `postgresql://postgres:YOUR_PASSWORD@localhost:5432/electivehub`
3. Run: `createdb electivehub`
4. Run: `npm run prisma:migrate && npm run seed`

---

**Need Help?** Follow the steps above exactly, and you'll have a working database in 5 minutes! 🚀

