"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import toast from "react-hot-toast";

interface Course {
  id: string;
  course_code: string;
  title: string;
  description: string | null;
  department: string | null;
  professor: string | null;
  credits: number;
  schedules: Array<{
    day_of_week: string;
    start_time: string;
    end_time: string;
  }>;
}

interface Registration {
  id: string;
  status: string;
  registered_at: string;
  confirmation_expires_at: string | null;
  course: Course;
}

export default function StudentDashboard() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [registered, setRegistered] = useState<Registration[]>([]);
  const [waitlisted, setWaitlisted] = useState<Registration[]>([]);
  const [pending, setPending] = useState<Registration[]>([]);
  const [totalCredits, setTotalCredits] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userData = localStorage.getItem("user");

    if (!token || !userData) {
      router.push("/login/student");
      return;
    }

    try {
      const parsedUser = JSON.parse(userData);
      setUser(parsedUser);

      if (parsedUser.role !== "STUDENT") {
        router.push("/login/student");
        return;
      }

      fetchRegistrations();
    } catch (error) {
      router.push("/login/student");
    }
  }, []);

  const fetchRegistrations = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("/api/my-registrations", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (res.ok) {
        setRegistered(data.registrations.registered || []);
        setWaitlisted(data.registrations.waitlisted || []);
        setPending(data.registrations.pending || []);
        setTotalCredits(data.totalCredits || 0);
      }
    } catch (error) {
      toast.error("Failed to load registrations");
    } finally {
      setLoading(false);
    }
  };

  const handleDrop = async (registrationId: string) => {
    if (!confirm("Are you sure you want to drop this course?")) {
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`/api/drop/${registrationId}`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (res.ok) {
        toast.success("Course dropped successfully");
        fetchRegistrations();
      } else {
        toast.error(data.error || "Failed to drop course");
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-100">
      {/* Header */}
      <div className="bg-white shadow-md border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-1">
                My Dashboard
              </h1>
              <p className="text-gray-600">Welcome back, {user?.name}</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="px-5 py-2.5 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl shadow-md font-semibold">
                {totalCredits} Credits
              </div>
              <Link
                href="/catalog"
                className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-xl transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5 font-medium"
              >
                Browse Courses
              </Link>
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
        {/* Enrolled Courses */}
        <div className="bg-white rounded-2xl shadow-lg mb-6 border border-gray-100">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-3xl font-bold text-gray-900">
              Enrolled Courses ({registered.length})
            </h2>
            <p className="text-gray-600 mt-1">Manage your course registrations</p>
          </div>

          <div className="p-6">
            {registered.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500 text-lg mb-4">No courses enrolled yet</p>
                <Link
                  href="/catalog"
                  className="text-blue-600 hover:underline font-medium"
                >
                  Browse available courses →
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {registered.map((reg) => (
                  <div
                    key={reg.id}
                    className="border-2 border-gray-200 rounded-xl p-6 hover:border-blue-400 hover:shadow-md transition-all bg-gradient-to-br from-white to-blue-50/30"
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2 py-1 rounded">
                            {reg.course.course_code}
                          </span>
                          <h3 className="text-lg font-semibold text-gray-900">
                            {reg.course.title}
                          </h3>
                          <span className="text-sm text-gray-600">
                            {reg.course.credits} Credits
                          </span>
                        </div>

                        <div className="text-sm text-gray-600 space-y-1">
                          {reg.course.professor && (
                            <p>
                              <span className="font-medium">Professor:</span>{" "}
                              {reg.course.professor}
                            </p>
                          )}
                          {reg.course.department && (
                            <p>
                              <span className="font-medium">Department:</span>{" "}
                              {reg.course.department}
                            </p>
                          )}
                        </div>

                        {/* Schedule */}
                        {reg.course.schedules && reg.course.schedules.length > 0 && (
                          <div className="mt-3">
                            <p className="text-sm font-medium text-gray-700 mb-1">
                              Schedule:
                            </p>
                            <div className="flex flex-wrap gap-2">
                              {reg.course.schedules.map((schedule, idx) => (
                                <span
                                  key={idx}
                                  className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded"
                                >
                                  {schedule.day_of_week} {schedule.start_time}-
                                  {schedule.end_time}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>

                      <button
                        onClick={() => handleDrop(reg.id)}
                        className="ml-4 px-5 py-2.5 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white text-sm font-semibold rounded-xl transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                      >
                        Drop Course
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Pending Confirmation Courses */}
        {pending.length > 0 && (
          <div className="bg-white rounded-2xl shadow-lg mb-6 border border-gray-100">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-3xl font-bold text-gray-900">
                ⚠️ Action Required ({pending.length})
              </h2>
              <p className="text-gray-600 mt-1">Confirm your enrollment within 24 hours</p>
            </div>

            <div className="p-6">
              <div className="space-y-4">
                {pending.map((reg) => {
                  const expiresAt = reg.confirmation_expires_at 
                    ? new Date(reg.confirmation_expires_at)
                    : null;
                  const hoursLeft = expiresAt 
                    ? Math.max(0, Math.floor((expiresAt.getTime() - new Date().getTime()) / (1000 * 60 * 60)))
                    : 0;

                  return (
                    <div
                      key={reg.id}
                      className="border-2 border-yellow-400 bg-gradient-to-br from-yellow-50 to-orange-50 rounded-xl p-6"
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <span className="bg-yellow-100 text-yellow-800 text-xs font-semibold px-3 py-1 rounded">
                              {reg.course.course_code}
                            </span>
                            <h3 className="text-lg font-semibold text-gray-900">
                              {reg.course.title}
                            </h3>
                            <span className="text-sm text-gray-600">
                              {reg.course.credits} Credits
                            </span>
                          </div>
                          <p className="text-sm font-semibold text-yellow-800 mb-2">
                            🎉 A spot opened up! You have {hoursLeft} hours to confirm.
                          </p>
                          <p className="text-xs text-gray-600 mb-3">
                            Check your email for the confirmation link, or click below to accept.
                          </p>
                          <a
                            href={`/waitlist/accept/${reg.id}`}
                            className="inline-block px-5 py-2.5 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white text-sm font-semibold rounded-xl transition-all shadow-md hover:shadow-lg"
                          >
                            Accept Spot Now
                          </a>
                        </div>
                        <button
                          onClick={() => handleDrop(reg.id)}
                          className="ml-4 px-4 py-2 bg-red-50 text-red-600 hover:bg-red-100 text-sm rounded-lg transition font-medium"
                        >
                          Decline
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Waitlisted Courses */}
        {waitlisted.length > 0 && (
          <div className="bg-white rounded-2xl shadow-lg mb-6 border border-gray-100">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-3xl font-bold text-gray-900">
                Waitlisted Courses ({waitlisted.length})
              </h2>
              <p className="text-gray-600 mt-1">You'll be notified when a spot becomes available</p>
            </div>

            <div className="p-6">
              <div className="space-y-4">
                {waitlisted.map((reg) => (
                  <div
                    key={reg.id}
                    className="border border-orange-200 bg-orange-50 rounded-lg p-4"
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <span className="bg-orange-100 text-orange-800 text-xs font-semibold px-2 py-1 rounded">
                            {reg.course.course_code}
                          </span>
                          <h3 className="text-lg font-semibold text-gray-900">
                            {reg.course.title}
                          </h3>
                          <span className="text-sm text-gray-600">
                            {reg.course.credits} Credits
                          </span>
                        </div>
                        <p className="text-sm text-orange-700 font-medium">
                          ⏳ You're on the waitlist for this course
                        </p>
                      </div>
                      <button
                        onClick={() => handleDrop(reg.id)}
                        className="ml-4 px-4 py-2 bg-red-50 text-red-600 hover:bg-red-100 text-sm rounded-lg transition font-medium"
                      >
                        Remove from Waitlist
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

