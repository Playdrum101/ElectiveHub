"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import toast from "react-hot-toast";
import Link from "next/link";

interface Schedule {
  day_of_week: string;
  start_time: string;
  end_time: string;
}

interface Course {
  id: string;
  course_code: string;
  title: string;
  description: string | null;
  department: string | null;
  professor: string | null;
  total_seats: number;
  remaining_seats: number;
  waitlist_capacity: number;
  waitlist_current: number;
  credits: number;
  schedules: Schedule[];
}

export default function CourseDetailPage() {
  const router = useRouter();
  const params = useParams();
  const courseId = params.courseId as string;

  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);
  const [registering, setRegistering] = useState(false);

  useEffect(() => {
    fetchCourse();
  }, [courseId]);

  const fetchCourse = async () => {
    try {
      const res = await fetch(`/api/courses`);
      const data = await res.json();
      const foundCourse = data.courses?.find((c: Course) => c.id === courseId);

      if (foundCourse) {
        setCourse(foundCourse);
      } else {
        toast.error("Course not found");
        router.push("/catalog");
      }
    } catch (error) {
      toast.error("Failed to load course");
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Please login first");
      router.push("/login/student");
      return;
    }

    setRegistering(true);

    try {
      const res = await fetch(`/api/register/${courseId}`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (res.ok) {
        toast.success(
          data.waitlisted
            ? "Added to waitlist successfully!"
            : "Registered successfully!"
        );
        router.push("/dashboard");
      } else {
        toast.error(data.error || "Registration failed");
      }
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setRegistering(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-2xl font-semibold text-gray-600">Loading...</div>
      </div>
    );
  }

  if (!course) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <Link
            href="/catalog"
            className="text-blue-600 hover:text-blue-800 inline-flex items-center mb-4"
          >
            ← Back to Catalog
          </Link>
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-3 py-1 rounded">
                    {course.course_code}
                  </span>
                  <span className="bg-green-100 text-green-800 text-xs font-semibold px-3 py-1 rounded">
                    {course.credits} Credits
                  </span>
                </div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  {course.title}
                </h1>
              </div>
            </div>

            {course.description && (
              <p className="text-gray-700 mb-4">{course.description}</p>
            )}

            <div className="grid md:grid-cols-2 gap-4 text-sm text-gray-600 mb-4">
              {course.professor && (
                <p>
                  <span className="font-medium">Professor:</span> {course.professor}
                </p>
              )}
              {course.department && (
                <p>
                  <span className="font-medium">Department:</span> {course.department}
                </p>
              )}
            </div>

            {/* Schedule */}
            {course.schedules && course.schedules.length > 0 && (
              <div className="border-t pt-4">
                <p className="font-medium text-gray-700 mb-2">Schedule:</p>
                <div className="space-y-2">
                  {course.schedules.map((schedule, idx) => (
                    <div key={idx} className="flex items-center text-sm text-gray-600">
                      <span className="bg-gray-100 px-3 py-1 rounded mr-2">
                        {schedule.day_of_week}
                      </span>
                      <span>
                        {schedule.start_time} - {schedule.end_time}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Seats Info */}
            <div className="border-t pt-4 mt-4">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Available Seats:</span>{" "}
                    {course.remaining_seats} / {course.total_seats}
                  </p>
                  {course.waitlist_current > 0 && (
                    <p className="text-sm text-orange-600 mt-1">
                      Waitlist: {course.waitlist_current} students
                    </p>
                  )}
                </div>

                <button
                  onClick={handleRegister}
                  disabled={registering}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-3 rounded-lg transition disabled:opacity-50"
                >
                  {registering ? "Registering..." : "Register for Course"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

