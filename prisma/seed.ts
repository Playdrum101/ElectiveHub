import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database...");

  // Create default admin
  const hashedPassword = await bcrypt.hash("admin123", 10);
  const admin = await prisma.user.upsert({
    where: { email: "admin@electivehub.com" },
    update: {},
    create: {
      email: "admin@electivehub.com",
      password_hash: hashedPassword,
      name: "Admin User",
      role: "ADMIN",
      department: "Administration",
    },
  });

  console.log("Created admin:", admin.email, "password: admin123");

  // Create some sample courses
  const course1 = await prisma.course.create({
    data: {
      course_code: "CS101",
      title: "Introduction to Computer Science",
      description: "Learn the fundamentals of programming and algorithms",
      department: "Computer Science",
      professor: "Dr. Smith",
      total_seats: 30,
      remaining_seats: 30,
      waitlist_capacity: 10,
      credits: 3,
      schedules: {
        create: [
          {
            day_of_week: "MONDAY",
            start_time: "09:00",
            end_time: "10:30",
          },
          {
            day_of_week: "WEDNESDAY",
            start_time: "09:00",
            end_time: "10:30",
          },
        ],
      },
    },
  });

  const course2 = await prisma.course.create({
    data: {
      course_code: "CS201",
      title: "Data Structures and Algorithms",
      description: "Advanced data structures and algorithmic problem solving",
      department: "Computer Science",
      professor: "Dr. Johnson",
      total_seats: 25,
      remaining_seats: 25,
      waitlist_capacity: 8,
      credits: 4,
      schedules: {
        create: [
          {
            day_of_week: "TUESDAY",
            start_time: "10:00",
            end_time: "11:30",
          },
          {
            day_of_week: "THURSDAY",
            start_time: "10:00",
            end_time: "11:30",
          },
        ],
      },
    },
  });

  const course3 = await prisma.course.create({
    data: {
      course_code: "MATH101",
      title: "Calculus I",
      description: "Differential and integral calculus",
      department: "Mathematics",
      professor: "Dr. Williams",
      total_seats: 40,
      remaining_seats: 40,
      waitlist_capacity: 15,
      credits: 3,
      schedules: {
        create: [
          {
            day_of_week: "MONDAY",
            start_time: "14:00",
            end_time: "15:30",
          },
          {
            day_of_week: "WEDNESDAY",
            start_time: "14:00",
            end_time: "15:30",
          },
          {
            day_of_week: "FRIDAY",
            start_time: "14:00",
            end_time: "15:30",
          },
        ],
      },
    },
  });

  console.log("Created courses:", course1.course_code, course2.course_code, course3.course_code);
  console.log("Seeding complete!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

