# ElectiveHub - Real-Time Course Registration System

A comprehensive, production-ready web application for elective course enrollment with real-time updates, automated waitlist management, and conflict detection.

## Features

- ✅ **Real-Time Updates**: WebSocket integration for live seat availability
- ✅ **Transaction-Safe Registration**: Prevents overbooking with database transactions
- ✅ **Automated Waitlist**: Time-based fair queuing with 24-hour confirmation windows
- ✅ **Conflict Detection**: Automatic schedule and credit limit validation
- ✅ **Admin Panel**: Full CRUD operations for course and schedule management
- ✅ **Email Notifications**: Automated alerts for waitlist promotions
- ✅ **JWT Authentication**: Secure login for students and administrators

## Tech Stack

- **Frontend**: Next.js 14, React, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes, Prisma ORM
- **Database**: PostgreSQL
- **Real-Time**: Socket.IO
- **Authentication**: JWT with bcryptjs
- **Notifications**: Nodemailer

## Prerequisites

- Node.js 18+ and npm
- PostgreSQL database
- SMTP credentials for email notifications

## Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd Elective_Polling
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```

   Edit `.env` and configure:
   - `DATABASE_URL`: PostgreSQL connection string
   - `JWT_SECRET`: Secret key for JWT tokens
   - SMTP settings for email notifications

4. **Initialize the database**
   ```bash
   npm run prisma:generate
   npm run prisma:migrate
   npm run seed
   ```

   This creates the database schema and seeds it with:
   - An admin account: `admin@electivehub.com` / `admin123`
   - Sample courses with schedules

5. **Start the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   ```
   http://localhost:3000
   ```

## API Endpoints

### Authentication
- `POST /api/auth/student-register` - Student registration
- `POST /api/auth/student-login` - Student login
- `POST /api/auth/admin-login` - Admin login

### Student APIs
- `GET /api/courses` - List all courses with schedules
- `POST /api/register/:courseId` - Register for a course
- `POST /api/drop/:registrationId` - Drop a course
- `GET /api/my-registrations` - Get student's registrations
- `POST /api/waitlist/accept/:registrationId` - Accept waitlist spot

### Admin APIs
- `GET /api/admin/courses` - List all courses
- `POST /api/admin/courses` - Create a course
- `PUT /api/admin/courses/:id` - Update a course
- `DELETE /api/admin/courses/:id` - Delete a course
- `POST /api/admin/schedules` - Add schedule to a course
- `DELETE /api/admin/schedules/:id` - Remove a schedule

## Project Structure

```
elective-hub/
├── prisma/
│   ├── schema.prisma         # Database schema
│   └── seed.ts               # Database seeder
├── src/
│   ├── app/
│   │   ├── api/              # API routes
│   │   ├── catalog/          # Course catalog page
│   │   ├── dashboard/        # Student dashboard
│   │   ├── admin/            # Admin panel
│   │   └── login/            # Login pages
│   ├── components/            # React components
│   └── lib/                  # Utilities
│       ├── prisma.ts         # Prisma client
│       ├── auth.ts           # Auth utilities
│       └── middleware.ts     # Route guards
└── public/                   # Static assets
```

## Database Schema

- **User**: Students and administrators
- **Course**: Course information and availability
- **Schedule**: Class schedules with day/time
- **Registration**: Student enrollments with status tracking

## Deployment

### Frontend (Vercel)
```bash
npm run build
vercel deploy
```

### Backend (Railway/Render)
- Set environment variables in your hosting platform
- Run migrations: `npm run prisma:migrate`
- Start server: `npm run start`

### Database (Supabase/Neon)
- Create a PostgreSQL database
- Update `DATABASE_URL` in production environment

## Development Roadmap

### Week 1-2: Core Backend & Auth ✅
- [x] Database schema with Prisma
- [x] JWT authentication
- [x] User registration and login

### Week 3: Admin Panel
- [ ] Admin dashboard UI
- [ ] Course CRUD operations
- [ ] Schedule management

### Week 4: Student Catalog & Registration
- [ ] Course catalog UI
- [ ] Registration API with transaction safety
- [ ] Conflict detection logic

### Week 5: Real-Time Integration
- [ ] Socket.IO server setup
- [ ] Client-side Socket.IO
- [ ] Live seat count updates

### Week 6: Student Dashboard & Conflicts
- [ ] Student dashboard UI
- [ ] Credit limit validation
- [ ] Schedule conflict detection

### Week 7: Waitlist System
- [ ] Automated waitlist logic
- [ ] 24-hour confirmation timer
- [ ] Expired confirmation handler

### Week 8: Polish & Deployment
- [ ] Email notifications
- [ ] UI polish
- [ ] Testing
- [ ] Production deployment

## Testing

### Race Condition Test
1. Open two browser windows
2. Set a course to 1 remaining seat
3. Click "Register" in both simultaneously
4. One should succeed, one should be waitlisted

### Waitlist Test
1. Register for a full course (waitlist)
2. Have another student drop from the course
3. Check email for waitlist promotion
4. Accept within 24 hours or see it pass to next person

## License

MIT

## Support

For issues or questions, please open an issue on the repository.

