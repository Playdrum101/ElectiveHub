"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import toast from "react-hot-toast";

interface Schedule {
  day_of_week: string;
  start_time: string;
  end_time: string;
}

export default function EditCourse() {
  const router = useRouter();
  const params = useParams();
  const courseId = params.id as string;

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    course_code: "",
    title: "",
    description: "",
    department: "",
    professor: "",
    total_seats: "",
    waitlist_capacity: "10",
    credits: "",
  });
  const [schedules, setSchedules] = useState<Schedule[]>([]);

  const DAYS_OF_WEEK = [
    "MONDAY",
    "TUESDAY",
    "WEDNESDAY",
    "THURSDAY",
    "FRIDAY",
    "SATURDAY",
    "SUNDAY",
  ];

  useEffect(() => {
    fetchCourse();
  }, [courseId]);

  const fetchCourse = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`/api/admin/courses/${courseId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (res.ok) {
        const course = data.course;
        setFormData({
          course_code: course.course_code,
          title: course.title,
          description: course.description || "",
          department: course.department || "",
          professor: course.professor || "",
          total_seats: course.total_seats.toString(),
          waitlist_capacity: course.waitlist_capacity.toString(),
          credits: course.credits.toString(),
        });
        setSchedules(
          course.schedules.map((s: any) => ({
            day_of_week: s.day_of_week,
            start_time: s.start_time,
            end_time: s.end_time,
          }))
        );
      } else {
        toast.error("Failed to load course");
        router.push("/admin/dashboard");
      }
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const addSchedule = () => {
    setSchedules([
      ...schedules,
      { day_of_week: "MONDAY", start_time: "09:00", end_time: "10:30" },
    ]);
  };

  const removeSchedule = (index: number) => {
    setSchedules(schedules.filter((_, i) => i !== index));
  };

  const updateSchedule = (index: number, field: keyof Schedule, value: string) => {
    const updated = [...schedules];
    updated[index] = { ...updated[index], [field]: value };
    setSchedules(updated);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`/api/admin/courses/${courseId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...formData,
          schedules,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        toast.success("Course updated successfully!");
        router.push("/admin/dashboard");
      } else {
        toast.error(data.error || "Failed to update course");
      }
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-2xl font-semibold text-gray-600">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-100 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <Link
            href="/admin/dashboard"
            className="text-indigo-600 hover:text-indigo-800 font-medium"
          >
            ← Back to Dashboard
          </Link>
        </div>

        <div className="bg-white rounded-2xl shadow-2xl p-8 border border-gray-100">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-2">
            Edit Course
          </h1>
          <p className="text-gray-600 mb-8">Update course details below</p>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Same form fields as create page */}
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Course Code *
                </label>
                <input
                  type="text"
                  value={formData.course_code}
                  onChange={(e) =>
                    setFormData({ ...formData, course_code: e.target.value.toUpperCase() })
                  }
                  placeholder="CS101"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Credits *
                </label>
                <input
                  type="number"
                  value={formData.credits}
                  onChange={(e) =>
                    setFormData({ ...formData, credits: e.target.value })
                  }
                  placeholder="3"
                  min="1"
                  max="6"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Course Title *
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                placeholder="Introduction to Computer Science"
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                placeholder="Course description..."
                rows={3}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Department
                </label>
                <input
                  type="text"
                  value={formData.department}
                  onChange={(e) =>
                    setFormData({ ...formData, department: e.target.value })
                  }
                  placeholder="Computer Science"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Professor
                </label>
                <input
                  type="text"
                  value={formData.professor}
                  onChange={(e) =>
                    setFormData({ ...formData, professor: e.target.value })
                  }
                  placeholder="Dr. Smith"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Total Seats *
                </label>
                <input
                  type="number"
                  value={formData.total_seats}
                  onChange={(e) =>
                    setFormData({ ...formData, total_seats: e.target.value })
                  }
                  placeholder="30"
                  min="1"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Waitlist Capacity
                </label>
                <input
                  type="number"
                  value={formData.waitlist_capacity}
                  onChange={(e) =>
                    setFormData({ ...formData, waitlist_capacity: e.target.value })
                  }
                  placeholder="10"
                  min="0"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
            </div>

            {/* Schedules */}
            <div>
              <div className="flex justify-between items-center mb-4">
                <label className="block text-sm font-semibold text-gray-700">
                  Schedule
                </label>
                <button
                  type="button"
                  onClick={addSchedule}
                  className="px-4 py-2 bg-indigo-100 text-indigo-600 hover:bg-indigo-200 rounded-lg font-medium transition"
                >
                  + Add Schedule
                </button>
              </div>

              {schedules.length === 0 ? (
                <p className="text-gray-500 text-sm py-4 text-center">
                  No schedules added. Click "Add Schedule" to add class times.
                </p>
              ) : (
                <div className="space-y-4">
                  {schedules.map((schedule, index) => (
                    <div
                      key={index}
                      className="grid md:grid-cols-4 gap-4 p-4 bg-gray-50 rounded-xl border border-gray-200"
                    >
                      <select
                        value={schedule.day_of_week}
                        onChange={(e) =>
                          updateSchedule(index, "day_of_week", e.target.value)
                        }
                        className="px-4 py-2 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500"
                      >
                        {DAYS_OF_WEEK.map((day) => (
                          <option key={day} value={day}>
                            {day}
                          </option>
                        ))}
                      </select>
                      <input
                        type="time"
                        value={schedule.start_time}
                        onChange={(e) =>
                          updateSchedule(index, "start_time", e.target.value)
                        }
                        className="px-4 py-2 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500"
                      />
                      <input
                        type="time"
                        value={schedule.end_time}
                        onChange={(e) =>
                          updateSchedule(index, "end_time", e.target.value)
                        }
                        className="px-4 py-2 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500"
                      />
                      <button
                        type="button"
                        onClick={() => removeSchedule(index)}
                        className="px-4 py-2 bg-red-100 text-red-600 hover:bg-red-200 rounded-lg transition"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Submit */}
            <div className="flex gap-4 pt-4">
              <button
                type="submit"
                disabled={saving}
                className="flex-1 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold py-3.5 rounded-xl transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:opacity-50"
              >
                {saving ? "Saving..." : "Update Course"}
              </button>
              <Link
                href="/admin/dashboard"
                className="px-6 py-3.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-xl transition"
              >
                Cancel
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

