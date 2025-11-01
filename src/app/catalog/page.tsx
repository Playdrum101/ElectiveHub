"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import toast from "react-hot-toast";
import { getClientSocket } from "@/lib/socket-client";

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
  schedules: Array<{
    day_of_week: string;
    start_time: string;
    end_time: string;
  }>;
}

export default function Catalog() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    fetchCourses();

    // Socket.IO live updates
    const socket = getClientSocket();
    const onSeatUpdate = (payload: {
      courseId: string;
      newSeatCount: number;
      newWaitlistCount: number;
    }) => {
      setCourses((prev) =>
        prev.map((c) =>
          c.id === payload.courseId
            ? {
                ...c,
                remaining_seats: payload.newSeatCount,
                waitlist_current: payload.newWaitlistCount,
              }
            : c
        )
      );
    };

    socket.on("seat-update", onSeatUpdate);
    return () => {
      socket.off("seat-update", onSeatUpdate);
    };
  }, []);

  const fetchCourses = async () => {
    try {
      const res = await fetch("/api/courses");
      const data = await res.json();
      setCourses(data.courses || []);
    } catch (error) {
      toast.error("Failed to load courses");
    } finally {
      setLoading(false);
    }
  };

  const filteredCourses = courses.filter((course) => {
    const matchesSearch =
      course.title.toLowerCase().includes(search.toLowerCase()) ||
      course.course_code.toLowerCase().includes(search.toLowerCase());
    const matchesFilter =
      filter === "all" || (filter === "available" && course.remaining_seats > 0);
    return matchesSearch && matchesFilter;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-2xl font-semibold text-gray-600">Loading courses...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-100 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-2">
                Course Catalog
              </h1>
              <p className="text-gray-600">Browse and enroll in available courses</p>
            </div>
            <Link
              href="/"
              className="px-5 py-2.5 bg-white hover:bg-gray-50 border-2 border-gray-200 rounded-xl transition-all shadow-sm hover:shadow-md font-medium"
            >
              ← Home
            </Link>
          </div>

          {/* Search and Filter */}
          <div className="grid md:grid-cols-2 gap-4 mb-6">
            <div className="relative">
              <input
                type="text"
                placeholder="🔍 Search courses..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full px-4 py-3 pl-12 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all bg-white shadow-sm"
              />
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">🔍</span>
            </div>
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all bg-white shadow-sm font-medium"
            >
              <option value="all">All Courses</option>
              <option value="available">Available Only</option>
            </select>
          </div>

          <p className="text-gray-600">
            Showing {filteredCourses.length} of {courses.length} courses
          </p>
        </div>

        {/* Course Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCourses.map((course) => (
            <div
              key={course.id}
              className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 border border-gray-100 transform hover:-translate-y-2"
            >
              <div className="p-6">
                <div className="flex justify-between items-start mb-2">
                  <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2 py-1 rounded">
                    {course.course_code}
                  </span>
                  <span className="bg-green-100 text-green-800 text-xs font-semibold px-2 py-1 rounded">
                    {course.credits} Credits
                  </span>
                </div>

                <h3 className="text-xl font-bold text-gray-900 mb-2">{course.title}</h3>
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                  {course.description || "No description available"}
                </p>

                <div className="space-y-2 text-sm text-gray-600 mb-4">
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
                  <div className="mb-4">
                    <p className="text-sm font-medium text-gray-700 mb-1">Schedule:</p>
                    <div className="space-y-1">
                      {course.schedules.map((schedule, idx) => (
                        <p key={idx} className="text-xs text-gray-600">
                          {schedule.day_of_week} {schedule.start_time}-{schedule.end_time}
                        </p>
                      ))}
                    </div>
                  </div>
                )}

                {/* Seats Info */}
                <div className="flex justify-between items-center pt-4 border-t">
                  <div>
                    <p className="text-sm font-medium text-gray-700">
                      Seats: <span className={course.remaining_seats > 0 ? "text-green-600 font-semibold" : "text-red-600 font-semibold"}>{course.remaining_seats}</span> / {course.total_seats}
                    </p>
                    {course.waitlist_current > 0 && (
                      <p className="text-xs text-orange-600">
                        Waitlist: {course.waitlist_current}
                      </p>
                    )}
                  </div>
                  <Link
                    href={`/register-course/${course.id}`}
                    className={`text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5 ${
                      course.remaining_seats > 0
                        ? "bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800"
                        : "bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700"
                    }`}
                  >
                    {course.remaining_seats > 0 ? "Enroll Now" : "Join Waitlist"}
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredCourses.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg">No courses found</p>
          </div>
        )}
      </div>
    </div>
  );
}

