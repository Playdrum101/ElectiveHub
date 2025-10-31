# 🚀 Quick Supabase Setup Guide

## Your Current Issue
Your database at `db.fjygvzgsinjoxvwzuwbr.supabase.co` is not reachable.

## Solution: Create Fresh Supabase Database

### Step 1: Go to Supabase
1. Visit: https://supabase.com
2. Sign in (or sign up if you don't have an account)

### Step 2: Create New Project
1. Click "New Project"
2. Fill in:
   - **Organization**: Create new or select existing
   - **Project Name**: electivehub (or any name)
   - **Database Password**: **write this down!** (e.g., `mypassword123`)
   - **Region**: Choose closest to you
3. Click "Create new project"

Wait 2-3 minutes for the database to be created.

### Step 3: Get Connection String
1. Once created, click on your project
2. Go to **Settings** (gear icon in left sidebar)
3. Click **Database** in the left menu
4. Scroll down to **"Connection string"** section
5. Click on the **"URI"** tab
6. Copy the connection string

It will look like:
```
postgresql://postgres.XXXX:YOUR_PASSWORD@aws-0-us-east-1.pooler.supabase.com:5432/postgres
```

### Step 4: Update Your .env File
1. Open your `.env` file in the project
2. Replace the DATABASE_URL line with the new connection string:

```env
DATABASE_URL="postgresql://postgres.YOUR_ID:YOUR_PASSWORD@aws-0-us-east-1.pooler.supabase.com:5432/postgres"
JWT_SECRET="electivehub-secret-key-change-me"
NODE_ENV="development"
```

**IMPORTANT**: Make sure to replace `YOUR_ID` and `YOUR_PASSWORD` with actual values from Supabase!

### Step 5: Run Migrations
After updating .env, run these commands:

```bash
npm run prisma:migrate
npm run seed
```

This will:
- Create all database tables
- Add admin account (admin@electivehub.com / admin123)
- Add sample courses

### Step 6: Restart Dev Server
If server is running, stop it (Ctrl+C) and restart:

```bash
npm run dev
```

### Step 7: Test It
Visit: http://localhost:3000/login/admin
- Email: admin@electivehub.com
- Password: admin123

---

## Troubleshooting

### Error: "Invalid connection string"
- Make sure you copied the ENTIRE string from Supabase
- Don't add extra spaces or quotes

### Error: "Password authentication failed"
- Check your database password in the connection string
- Make sure password matches what you set in Supabase

### Can't find connection string in Supabase?
1. Settings → Database
2. Scroll down to "Connection string"
3. Click "URI" tab (not "Session pooler" or "Direct connection")

### Database still not connecting?
Try the "Direct connection" string instead:
1. In Supabase: Settings → Database
2. Use "Direct connection" instead of "Connection pooling"
3. Copy that string to .env

---

## Alternative: Use Local Database

If Supabase keeps giving you trouble:

### Install PostgreSQL Locally:
1. Download: https://www.postgresql.org/download/windows/
2. Install with default settings
3. Remember the password you set during installation

### Update .env:
```env
DATABASE_URL="postgresql://postgres:YOUR_LOCAL_PASSWORD@localhost:5432/electivehub?schema=public"
```

### Create database:
```bash
createdb electivehub
```

### Run migrations:
```bash
npm run prisma:migrate
npm run seed
```

---

## Success Indicators

✅ You'll know it's working when:
- Server starts without errors
- Can login as admin
- No more "Can't reach database server" errors
- Courses appear in catalog

Good luck! 🎉

