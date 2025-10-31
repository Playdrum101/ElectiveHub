# 🛠️ ElectiveHub Tech Stack

## Frontend Technologies

### **Next.js 14** - Full-Stack React Framework
- **Version**: 14.2.13
- **Purpose**: React framework with App Router for pages and API routes
- **Features Used**:
  - Server Components
  - App Router (file-based routing)
  - API Routes (backend endpoints)
  - Built-in optimization

**Why Next.js?**
- Single codebase for frontend and backend
- Server-side rendering for better performance
- Automatic code splitting
- SEO-friendly

### **React 18** - UI Library
- **Purpose**: Building interactive user interfaces
- **Features**: Hooks, components, state management

### **TypeScript** - Type-Safe JavaScript
- **Purpose**: Catch errors at compile time
- **Features**: Static typing, better IDE support

### **Tailwind CSS** - Utility-First CSS
- **Purpose**: Rapid UI development
- **Features**: Utility classes, responsive design

### **React Hot Toast** - Notifications
- **Purpose**: Toast notifications for user feedback
- **Features**: Success/error messages

### **Zustand** (Planned)
- **Purpose**: State management for client-side state

---

## Backend Technologies

### **Next.js API Routes** - Server Endpoints
- **Purpose**: Handle HTTP requests
- **Endpoints**:
  - `/api/auth/*` - Authentication
  - `/api/courses` - Course listing
  - `/api/register/*` - Course registration
  - `/api/admin/*` - Admin operations

### **Prisma ORM** - Database Toolkit
- **Version**: 5.20.0
- **Purpose**: Type-safe database access
- **Features**:
  - Schema migrations
  - Query builder
  - Database seeding
  - Prisma Studio (visual database editor)

### **PostgreSQL** - Relational Database
- **Purpose**: Store application data
- **Hosted Options**:
  - Supabase (recommended for beginners)
  - Neon
  - Railway
  - Local PostgreSQL

### **bcryptjs** - Password Hashing
- **Purpose**: Hash passwords securely
- **Features**: One-way encryption

### **jsonwebtoken** - JWT Authentication
- **Purpose**: Secure authentication tokens
- **Features**: 7-day token expiry

### **Socket.IO** - Real-Time Communication
- **Version**: 4.7.2
- **Purpose**: Live seat count updates
- **Status**: Installed but not integrated yet

### **Nodemailer** - Email Sending
- **Version**: 6.9.15
- **Purpose**: Send waitlist notifications
- **Status**: Installed but not configured yet

---

## Development Tools

### **ESLint** - Code Linting
- **Purpose**: Find and fix code issues
- **Config**: Next.js recommended rules

### **PostCSS & Autoprefixer** - CSS Processing
- **Purpose**: Transform Tailwind CSS
- **Features**: Vendor prefixing

### **tsx / ts-node** - TypeScript Execution
- **Purpose**: Run TypeScript files directly
- **Used For**: Prisma seed scripts

---

## Database Schema

### **Models**
1. **User** - Students and Admins
   - Fields: id, email, password_hash, name, reg_number, department, role
   - Relations: registrations

2. **Course** - Course Information
   - Fields: id, course_code, title, description, department, professor, seats, waitlist, credits
   - Relations: schedules, registrations

3. **Schedule** - Class Times
   - Fields: id, day_of_week, start_time, end_time, course_id
   - Relations: course

4. **Registration** - Enrollment Records
   - Fields: id, registered_at, status, confirmation_expires_at, user_id, course_id
   - Relations: user, course

### **Enums**
- `UserRole`: STUDENT, ADMIN
- `RegistrationStatus`: REGISTERED, WAITLISTED, PENDING_CONFIRMATION
- `DayOfWeek`: MONDAY through SUNDAY

---

## Architecture Pattern

### **Monorepo Structure**
```
ElectiveHub/
├── Frontend (Next.js App Router)
│   ├── Server Components (React)
│   ├── Client Components ("use client")
│   └── API Routes (Backend)
│
├── ORM (Prisma)
│   ├── Schema Definition
│   ├── Migrations
│   └── Seed Scripts
│
└── Database (PostgreSQL)
    ├── Users
    ├── Courses
    ├── Schedules
    └── Registrations
```

### **Data Flow**
```
User Action (Browser)
    ↓
Next.js Page (Frontend)
    ↓
API Route (Backend)
    ↓
Prisma Query (ORM)
    ↓
PostgreSQL (Database)
    ↓
Response back to user
```

---

## Key Technologies by Category

### **Language & Runtime**
- Node.js 18+
- TypeScript 5
- JavaScript (ES6+)

### **Frontend Framework**
- Next.js 14
- React 18

### **Backend Framework**
- Next.js API Routes
- Express (under the hood in Next.js)

### **Database**
- PostgreSQL
- Prisma ORM

### **Authentication**
- JWT (jsonwebtoken)
- bcryptjs

### **Real-Time** (Planned)
- Socket.IO

### **Email** (Planned)
- Nodemailer

### **Styling**
- Tailwind CSS 3.4
- PostCSS

### **Notifications**
- React Hot Toast

### **Build Tools**
- Next.js built-in bundler
- TypeScript compiler

---

## Deployment Options

### **Frontend + Backend**
- Vercel (recommended for Next.js)
- Netlify
- Railway
- Heroku

### **Database**
- Supabase (PostgreSQL)
- Neon (PostgreSQL)
- Railway (PostgreSQL)
- AWS RDS
- Local PostgreSQL

### **Email Service**
- SendGrid
- Resend
- Gmail SMTP
- AWS SES

---

## Why This Stack?

### **Benefits**
✅ **Type Safety**: TypeScript catches errors early  
✅ **Developer Experience**: Hot reload, great tooling  
✅ **Performance**: Server-side rendering, code splitting  
✅ **Scalability**: Can handle many concurrent users  
✅ **Modern**: Latest best practices  
✅ **Full-Stack**: One framework for everything  

### **Learning Curve**
📈 **Beginner Friendly**: Simple setup, good documentation  
📚 **Well Documented**: Large community, tutorials available  
🎓 **Industry Standard**: Used by companies worldwide  

---

## Version Numbers

All packages use stable versions:
- Next.js: 14.2.13 (LTS)
- React: 18.x (Latest)
- TypeScript: 5.x
- Prisma: 5.20.0
- Tailwind: 3.4.1

All versions are compatible and production-ready.

---

## Resources

- [Next.js Docs](https://nextjs.org/docs)
- [React Docs](https://react.dev)
- [Prisma Docs](https://www.prisma.io/docs)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [TypeScript Docs](https://www.typescriptlang.org/docs)

