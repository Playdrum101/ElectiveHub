# 🔧 Database Connection Troubleshooting

## The Problem

Your Supabase database is not reachable. This is common on the free tier.

## Quick Fixes (Try These)

### Option 1: Restart Supabase Database (Easiest)

1. **Go to your Supabase project**: https://supabase.com/dashboard
2. **Find your project** (electivehub or whatever you named it)
3. **Click on the project**
4. **Click "Settings"** (gear icon in left sidebar)
5. **Go to "Database"**
6. **Look for your project** - it might say "Paused"
7. **If paused, click "Restore" or "Resume"**

Your database will wake up in 1-2 minutes.

---

### Option 2: Get Fresh Connection String

Sometimes the connection string changes. Get a fresh one:

1. **Go to Supabase Dashboard**: https://supabase.com/dashboard
2. **Select your project**
3. **Settings** → **Database**
4. **Scroll to "Connection string"**
5. **Use "URI" format** and copy it
6. **Update your .env file**:

```env
DATABASE_URL="paste-the-new-connection-string-here"
```

---

### Option 3: Use Local PostgreSQL (If Supabase Keeps Failing)

If Supabase keeps pausing, use a local database:

1. **Install PostgreSQL locally** (Windows):
   - Download from: https://www.postgresql.org/download/windows/
   - Install with default settings

2. **Create database**:
   ```bash
   createdb electivehub
   ```

3. **Update .env**:
   ```env
   DATABASE_URL="postgresql://postgres:YOUR_PASSWORD@localhost:5432/electivehub?schema=public"
   ```

4. **Run migrations**:
   ```bash
   npm run prisma:migrate
   npm run seed
   ```

---

### Option 4: Check Your Current Connection String

Your current error shows the database is at:
`db.fjygvzgsinjoxvwzuwbr.supabase.co:5432`

**Check if this is correct**:
1. Go to your Supabase project
2. Settings → Database
3. See if the connection string matches your .env file

---

## After Fixing Connection

Once your database is connected, restart your dev server:

```bash
# Stop current server (Ctrl+C)
npm run dev
```

Then try logging in again.

---

## Verify Database is Working

Test the connection:

```bash
npm run prisma:studio
```

This should open Prisma Studio in your browser showing your database tables.

---

## Still Not Working?

### Check Your Internet Connection
- Supabase requires internet access
- Make sure you're connected to the internet

### Check Firewall
- Some firewalls block PostgreSQL connections
- Try temporarily disabling firewall to test

### Check Supabase Status
- Visit https://status.supabase.com
- See if there are any outages

### Try a Different Database Provider
- **Neon**: https://neon.tech (also free tier)
- **Railway**: https://railway.app (database hosting)

---

## Quick Command Reference

```bash
# Check if .env exists
cat .env

# Check connection
npm run prisma:studio

# Recreate database
npm run prisma:migrate reset

# Seed data
npm run seed
```

---

## Common Error Messages

| Error | Solution |
|-------|----------|
| "Can't reach database server" | Database paused - restart in Supabase |
| "password authentication failed" | Wrong password in DATABASE_URL |
| "database does not exist" | Create database or fix URL |
| "connection refused" | Database not running or wrong host |

---

## Success Indicators

✅ You know it's working when:
- `npm run dev` starts without errors
- You can login as admin
- You see courses in the catalog
- Prisma Studio opens without errors

Good luck! 🚀

