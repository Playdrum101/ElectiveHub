# 🎯 START HERE!

Welcome! I've created everything you need to get started with ElectiveHub.

## 📖 Choose Your Starting Point:

### 🌟 **For Complete Beginners**
👉 **Read: `BEGINNER_GUIDE.md`**
- Explained in simple terms
- Step-by-step with options
- Visual walkthrough
- Video tutorial links

### ⚡ **For Quick Setup** (Already know basics?)
👉 **Read: `QUICK_START.md`**
- Fast track setup
- Copy-paste commands
- Get running in 10 minutes

### 📚 **Want Full Details?**
👉 **Read: `SETUP_GUIDE.md`**
- Complete explanations
- Multiple database options
- Troubleshooting tips

## 🚀 Quick Answer to Your Question:

### **Where do I get DATABASE_URL?**

**Easiest way (5 minutes):**
1. Go to https://supabase.com
2. Sign up for free account
3. Create new project
4. Copy the connection string from settings
5. Paste it in your `.env` file as `DATABASE_URL`

### **Where do I get JWT_SECRET?**

Just make up any random string! For development, use:
```env
JWT_SECRET="my-secret-key-123"
```

Or run this to generate a secure one:
```bash
npm run generate-secret
```

### **How do I create .env file?**

1. In your project folder
2. Create a new file named `.env` (just those 4 characters with the dot)
3. Copy this inside:

```env
DATABASE_URL="paste-supabase-connection-string-here"
JWT_SECRET="my-secret-key-123"
NODE_ENV="development"
```

4. Replace with your actual connection string from Supabase
5. Save the file

## 🎬 Next Steps:

1. **Install Node.js** (if not installed): https://nodejs.org/
2. **Get Supabase database** (follow their setup)
3. **Create .env file** (copy template above)
4. **Run these commands:**

```bash
npm install
npm run prisma:generate
npm run prisma:migrate
npm run seed
npm run dev
```

5. **Open browser:** http://localhost:3000

## ✅ Login After Setup:

**Admin:**
- Email: `admin@electivehub.com`
- Password: `admin123`

---

**Already created `.env` file? Check the contents to see your setup!**

