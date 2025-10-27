# Complete Setup Guide for Beginners

## Step 1: Install Required Software

### Install Node.js (if not already installed)
1. Go to https://nodejs.org/
2. Download the LTS (Long Term Support) version
3. Install it with default settings
4. Verify installation by opening terminal and typing:
   ```bash
   node --version
   npm --version
   ```

## Step 2: Create Your Database

You have two options:

### Option A: Use a Free Cloud Database (Recommended for Beginners) ⭐

**Using Supabase (Free PostgreSQL):**

1. Go to https://supabase.com and sign up (it's free)
2. Create a new project
3. Go to Settings → Database
4. Find the "Connection string" section
5. Copy the "URI" connection string
   - It looks like: `postgresql://postgres:[YOUR-PASSWORD]@db.[PROJECT-ID].supabase.co:5432/postgres`
   - This is your DATABASE_URL

**Using Neon (Free PostgreSQL):**

1. Go to https://neon.tech and sign up (it's free)
2. Create a new project
3. Go to Dashboard
4. Click on your project
5. Find the connection string - it will look like:
   `postgresql://username:password@ep-xxx.region.aws.neon.tech/neondb`
   - This is your DATABASE_URL

**Using Railway (Free Tier Available):**

1. Go to https://railway.app and sign up
2. Create a new project
3. Click "New" → "Database" → "Add PostgreSQL"
4. Click on the PostgreSQL service
5. Go to "Variables" tab
6. Copy the "DATABASE_URL" value
   - This is your DATABASE_URL

### Option B: Install PostgreSQL Locally

If you want to run PostgreSQL on your computer:

1. **Windows:**
   - Download from https://www.postgresql.org/download/windows/
   - Install with default settings
   - Remember the password you set for 'postgres' user
   - Your DATABASE_URL will be: `postgresql://postgres:YOUR_PASSWORD@localhost:5432/electivehub?schema=public`

2. **Mac:**
   ```bash
   # Using Homebrew
   brew install postgresql@16
   brew services start postgresql@16
   ```
   - Create database:
   ```bash
   createdb electivehub
   ```
   - Your DATABASE_URL will be: `postgresql://localhost:5432/electivehub?schema=public`

## Step 3: Create .env File

1. Open a text editor (VS Code, Notepad, etc.)
2. Create a new file in your project folder named `.env` (just the filename, no extension)
3. Copy and paste this content:

```env
# Database Connection - Replace with your DATABASE_URL from Step 2
DATABASE_URL="postgresql://postgres:password@localhost:5432/electivehub?schema=public"

# JWT Secret Key - You can use this or any random string
JWT_SECRET="electivehub-secret-key-change-me-in-production"

# Email Configuration (Optional for now - you can skip this)
SMTP_HOST="smtp.gmail.com"
SMTP_PORT="587"
SMTP_USER="your-email@gmail.com"
SMTP_PASS="your-app-password"
SMTP_FROM="ElectiveHub <noreply@electivehub.com>"

# Environment
NODE_ENV="development"
```

4. **Important:** Replace the DATABASE_URL with the one you copied from Supabase/Neon/Railway
5. **JWT_SECRET:** You can use the one provided above, or generate a random string

## Step 4: Generate a Random JWT Secret (Optional but Recommended)

Open your terminal and run:
```bash
# On Windows PowerShell
-join ((48..57) + (65..90) + (97..122) | Get-Random -Count 32 | ForEach-Object {[char]$_})

# Or visit https://randomkeygen.com/ and copy a "CodeIgniter Encryption Keys"
```

Copy the generated string and use it as your JWT_SECRET

## Step 5: Install Project Dependencies

Open terminal in your project folder and run:
```bash
npm install
```

This will install all required packages (may take a few minutes)

## Step 6: Set Up Your Database

Run these commands one by one:

```bash
# Generate Prisma client
npm run prisma:generate

# Create database tables
npm run prisma:migrate

# Add sample data (admin account and courses)
npm run seed
```

## Step 7: Start the Development Server

```bash
npm run dev
```

Open your browser and go to: http://localhost:3000

## Step 8: Login Credentials

After seeding, you can login with:

**Admin:**
- Email: `admin@electivehub.com`
- Password: `admin123`

## Troubleshooting

### "Cannot connect to database"
- Make sure your DATABASE_URL is correct
- For local PostgreSQL, make sure the service is running
- Check if you need to whitelist your IP (for cloud databases)

### "npm: command not found"
- Make sure Node.js is installed
- Restart your terminal after installing Node.js

### "Module not found" errors
- Run `npm install` again
- Delete `node_modules` folder and run `npm install`

## Quick Reference

**Common Commands:**
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start      # Start production server
npm run prisma:studio  # Open database viewer (optional)
```

**Database Management:**
```bash
npm run prisma:studio  # View/edit database data in browser
```

**URLs:**
- Frontend: http://localhost:3000
- Admin: http://localhost:3000/login/admin
- Student: http://localhost:3000/login/student
- Prisma Studio: http://localhost:5555 (when running)

## Next Steps

Once everything is working:
1. Explore the admin panel
2. Try registering a student account
3. Browse the course catalog
4. See the features in action!

Need help? The project structure is already set up, just follow these steps!

