# 🎓 Beginner's Guide to Setting Up ElectiveHub

## What You Need to Understand

### 1. DATABASE_URL - Where Your Data Lives

Your app needs a database to store:
- User accounts
- Courses
- Registrations

**You have 2 options:**

#### ✅ Option A: Free Cloud Database (Recommended - No Installation!)
1. Go to https://supabase.com
2. Sign up (it's free!)
3. Create a new project
4. Copy the connection string they give you
5. Paste it as your `DATABASE_URL`

**What it looks like:**
```
postgresql://postgres.abc123:[PASSWORD]@db.xyz.supabase.co:5432/postgres
```

#### ⚙️ Option B: Install Locally (Advanced)
- Install PostgreSQL on your computer
- Set `DATABASE_URL` to `postgresql://postgres:YOUR_PASSWORD@localhost:5432/electivehub`

### 2. JWT_SECRET - Your App's Password Manager

JWT_SECRET is like a master password your app uses to:
- Create login tokens
- Verify users are who they say they are

**How to get one:**
- Just use: `"my-secret-key-123"` (any random string works!)
- Or run: `npm run generate-secret` to get a secure one

⚠️ **Important:** Don't share your JWT_SECRET with anyone!

### 3. .env File - Your Configuration File

The `.env` file stores secrets you don't want in your code:
- Database connection
- Secret keys
- API credentials

**Where to create it:**
- In your project root folder (same folder as package.json)
- Name it exactly: `.env` (the dot is important!)

**What goes inside:**
```env
DATABASE_URL="your-connection-string-here"
JWT_SECRET="your-secret-key-here"
NODE_ENV="development"
```

## Step-by-Step Setup (Copy & Paste!)

### 1️⃣ Install Node.js
- Go to https://nodejs.org/
- Download the LTS version (v18 or v20)
- Install it (just click Next, Next, Next)
- Restart your computer

### 2️⃣ Get Database (Choose Easiest Option)

**Supabase (Easiest - 5 minutes):**
1. Visit: https://supabase.com
2. Click "Start your project"
3. Sign up with GitHub or email
4. Click "New Project"
   - Name: anything (like "electivehub")
   - Password: choose any password (remember it!)
   - Region: pick closest to you
5. Wait for database to create (1-2 minutes)
6. Click the settings gear icon
7. Go to "Database" in left menu
8. Scroll to "Connection string"
9. Click "URI" tab
10. Copy the connection string

### 3️⃣ Create .env File

1. Open your project folder in VS Code (or any text editor)
2. Create a new file called `.env`
3. Paste this content:
```env
DATABASE_URL="PASTE_YOUR_SUPABASE_CONNECTION_STRING_HERE"
JWT_SECRET="my-super-secret-key-for-development"
NODE_ENV="development"
```
4. Replace `PASTE_YOUR_SUPABASE_CONNECTION_STRING_HERE` with what you copied
5. Save the file

### 4️⃣ Run These Commands

Open terminal in your project folder and run these ONE BY ONE:

```bash
# Install all packages
npm install

# Generate database code
npm run prisma:generate

# Create database tables
npm run prisma:migrate

# Add sample data (admin account + courses)
npm run seed

# Start the app!
npm run dev
```

### 5️⃣ Open Your Browser

Go to: **http://localhost:3000**

## Login Information

After running `npm run seed`, you can login as:

**Admin Account:**
- Email: `admin@electivehub.com`
- Password: `admin123`

## Visual Walkthrough

```
┌─────────────────────────────────────────┐
│ 1. Get Free Database (Supabase.com)     │
│    ↓ Copy connection string             │
└─────────────────────────────────────────┘
              ↓
┌─────────────────────────────────────────┐
│ 2. Create .env file                     │
│    - Paste connection string             │
│    - Add JWT_SECRET                      │
└─────────────────────────────────────────┘
              ↓
┌─────────────────────────────────────────┐
│ 3. Run commands:                         │
│    npm install                           │
│    npm run prisma:generate               │
│    npm run prisma:migrate                │
│    npm run seed                          │
└─────────────────────────────────────────┘
              ↓
┌─────────────────────────────────────────┐
│ 4. Start app: npm run dev                │
│    Open: http://localhost:3000           │
└─────────────────────────────────────────┘
```

## File Structure Explanation

```
Elective_Polling/
├── .env              ← Your secrets go here (DATABASE_URL, JWT_SECRET)
├── package.json      ← Project dependencies
├── prisma/
│   ├── schema.prisma ← Database structure
│   └── seed.ts       ← Sample data (admin + courses)
├── src/
│   ├── app/          ← Your pages and API routes
│   └── lib/          ← Helper functions
├── QUICK_START.md    ← Start here!
├── SETUP_GUIDE.md    ← Detailed guide
└── README.md         ← Full documentation
```

## Need Help?

**Common Error Messages:**

1. **"Cannot connect to database"**
   - Your DATABASE_URL is wrong
   - Check for extra spaces or quotes
   - Make sure Supabase project is running

2. **"npm: command not found"**
   - Install Node.js from nodejs.org
   - Restart your terminal after installing

3. **"Module not found"**
   - Run: `npm install` again
   - Or delete `node_modules` folder and run `npm install`

4. **"Port 3000 already in use"**
   - Close other apps running on port 3000
   - Or change port: `npm run dev -- -p 3001`

## Video Tutorial Links (External)

- **Installing Node.js:** https://www.youtube.com/watch?v=0XY-D0QQi9A
- **Supabase Setup:** https://www.youtube.com/watch?v=D4dx95QVLho
- **Next.js Basics:** https://www.youtube.com/watch?v=Sklc_fQBmcs

## Success Checklist

When everything works, you'll see:
- ✅ `npm run dev` starts without errors
- ✅ Browser shows the home page at localhost:3000
- ✅ Can login as admin (admin@electivehub.com / admin123)
- ✅ Can see sample courses in the catalog

## What's Next?

After setup works:
1. Explore the code in `src/app/` folder
2. Try creating a student account
3. Register for a course
4. Check the database with `npm run prisma:studio`
5. Read the full documentation in `README.md`

Happy coding! 🚀

