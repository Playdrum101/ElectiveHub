"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import toast from "react-hot-toast";

export default function AdminDashboard() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userData = localStorage.getItem("user");

    if (!token || !userData) {
      router.push("/login/admin");
      return;
    }

    try {
      const parsedUser = JSON.parse(userData);
      setUser(parsedUser);

      if (parsedUser.role !== "ADMIN") {
        router.push("/login/admin");
        return;
      }

      fetchCourses();
    } catch (error) {
      router.push("/login/admin");
    }
  }, []);

  const fetchCourses = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("/api/admin/courses", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      setCourses(data.courses || []);
    } catch (error) {
      toast.error("Failed to load courses");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (courseId: string, courseCode: string) => {
    if (!confirm(`Are you sure you want to delete ${courseCode}? This action cannot be undone.`)) {
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`/api/admin/courses/${courseId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (res.ok) {
        toast.success("Course deleted successfully");
        fetchCourses();
      } else {
        toast.error(data.error || "Failed to delete course");
      }
    } catch (error) {
      toast.error("Something went wrong");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    router.push("/");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-2xl font-semibold text-gray-600">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-100">
      {/* Header */}
      <div className="bg-white shadow-md border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-1">
                Admin Dashboard
              </h1>
              <p className="text-gray-600">Manage courses and registrations</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 px-4 py-2 bg-indigo-50 rounded-lg">
                <div className="w-2 h-2 bg-indigo-500 rounded-full"></div>
                <span className="text-sm text-gray-700 font-medium">{user?.name}</span>
              </div>
              <button
                onClick={handleLogout}
                className="px-5 py-2.5 bg-red-50 text-red-600 hover:bg-red-100 rounded-xl transition-all font-medium border border-red-200"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6 border border-gray-100">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-3xl font-bold text-gray-900">Courses</h2>
              <p className="text-gray-600 mt-1">{courses.length} total courses</p>
            </div>
            <Link
              href="/admin/courses/create"
              className="px-5 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-xl transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5 font-medium"
            >
              + Create Course
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Code
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Title
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Seats
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Credits
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Schedule
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {courses.map((course) => (
                  <tr key={course.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="font-medium text-gray-900">{course.course_code}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">{course.title}</div>
                      <div className="text-sm text-gray-500">{course.professor}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-gray-900">
                        {course.remaining_seats} / {course.total_seats}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-gray-900">{course.credits}</span>
                    </td>
                    <td className="px-6 py-4">
                      {course.schedules && course.schedules.length > 0 ? (
                        <div className="text-xs text-gray-600 space-y-1">
                          {course.schedules.slice(0, 2).map((s: any, idx: number) => (
                            <div key={idx}>
                              {s.day_of_week.slice(0, 3)} {s.start_time}-{s.end_time}
                            </div>
                          ))}
                          {course.schedules.length > 2 && (
                            <div className="text-gray-400">+{course.schedules.length - 2} more</div>
                          )}
                        </div>
                      ) : (
                        <span className="text-xs text-gray-400">No schedule</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex gap-3">
                        <Link
                          href={`/admin/courses/edit/${course.id}`}
                          className="px-4 py-2 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-lg transition font-medium"
                        >
                          Edit
                        </Link>
                        <button
                          onClick={() => handleDelete(course.id, course.course_code)}
                          className="px-4 py-2 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg transition font-medium"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {courses.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg mb-4">No courses yet.</p>
              <Link
                href="/admin/courses/create"
                className="text-indigo-600 hover:text-indigo-800 font-medium"
              >
                Create your first course →
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

