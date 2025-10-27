# 🚀 Quick Start Guide

## For Absolute Beginners

### Step 1: Get a Free Database (Choose One)

**Easiest Option: Supabase**
1. Visit: https://supabase.com
2. Click "Start your project" (free account)
3. Sign up with GitHub or Email
4. Click "New Project"
5. Fill in:
   - Project name: electivehub (or any name)
   - Database password: **remember this!**
   - Region: closest to you
6. Click "Create new project"
7. Wait 2-3 minutes for database setup
8. Once ready, click "Project Settings" (gear icon)
9. Go to "Database" → "Connection string"
10. Copy the "URI" connection string

Your connection string looks like:
```
postgresql://postgres.xxxx:[YOUR-PASSWORD]@aws-0-us-east-1.pooler.supabase.com:6543/postgres
```

### Step 2: Create Your .env File

1. In your project folder, create a file named `.env` (with the dot!)
2. Copy this template and paste it:

```env
DATABASE_URL="paste-your-supabase-connection-string-here"
JWT_SECRET="my-super-secret-key-2024"
NODE_ENV="development"
```

3. Replace `paste-your-supabase-connection-string-here` with what you copied from Supabase

### Step 3: Generate a Secure JWT Secret (Optional)

Run this command in terminal:
```bash
npm run generate-secret
```

Copy the output and replace `my-super-secret-key-2024` in your .env file

**Or** just use a simple string for development: `electivehub-2024-secret`

### Step 4: Install Everything

Open terminal in your project folder and run:
```bash
npm install
```

Wait for it to finish (may take 2-3 minutes)

### Step 5: Set Up Database

Run these commands one by one:

```bash
npm run prisma:generate
npm run prisma:migrate
npm run seed
```

The `seed` command creates:
- Admin account (admin@electivehub.com / admin123)
- Sample courses

### Step 6: Start the App!

```bash
npm run dev
```

You should see:
```
ready - started server on 0.0.0.0:3000
```

Now open your browser: **http://localhost:3000**

## 🎉 You're Done!

**Login Credentials:**
- Admin: admin@electivehub.com / admin123
- Create student accounts from the registration page

## 📚 What to Try

1. **Login as Admin** → Manage courses
2. **Register as Student** → Create your account
3. **Browse Catalog** → See available courses
4. **Register for Course** → Enroll in classes
5. **View Dashboard** → See your registrations

## 🆘 Common Issues

**Error: "Cannot connect to database"**
- Check your DATABASE_URL in .env file
- Make sure there are no extra spaces or quotes
- Make sure your Supabase project is running (green status)

**Error: "npm: command not found"**
- Install Node.js from https://nodejs.org/

**Error: "Module not found"**
- Delete `node_modules` folder
- Run `npm install` again

## 🎯 Next Steps

Once everything works:
- Read `SETUP_GUIDE.md` for detailed explanations
- Explore the code in `src/app` folder
- Check the database with: `npm run prisma:studio`

