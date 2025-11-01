"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import toast from "react-hot-toast";

export default function AcceptWaitlist() {
  const router = useRouter();
  const params = useParams();
  const registrationId = params.registrationId as string;

  const [loading, setLoading] = useState(true);
  const [accepting, setAccepting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [courseInfo, setCourseInfo] = useState<any>(null);

  useEffect(() => {
    // Try to accept immediately
    handleAccept();
  }, [registrationId]);

  const handleAccept = async () => {
    setAccepting(true);
    try {
      const res = await fetch(`/api/waitlist/accept/${registrationId}`, {
        method: "POST",
      });

      const data = await res.json();

      if (res.ok) {
        toast.success("Congratulations! You've successfully enrolled in the course!");
        setCourseInfo(data.registration);
        
        // Redirect to dashboard after 3 seconds
        setTimeout(() => {
          router.push("/dashboard");
        }, 3000);
      } else {
        setError(data.error || "Failed to accept waitlist spot");
        toast.error(data.error || "Failed to accept waitlist spot");
      }
    } catch (error) {
      setError("Something went wrong");
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
      setAccepting(false);
    }
  };

  if (loading || accepting) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl p-10 max-w-md w-full text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-green-600 mx-auto mb-6"></div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Processing Your Enrollment...
          </h2>
          <p className="text-gray-600">Please wait while we confirm your spot</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-orange-50 to-yellow-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl p-10 max-w-md w-full text-center">
          <div className="text-6xl mb-6">⚠️</div>
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Unable to Process
          </h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <div className="space-y-3">
            <Link
              href="/dashboard"
              className="block w-full px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition"
            >
              Go to Dashboard
            </Link>
            <Link
              href="/catalog"
              className="block w-full px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-xl transition"
            >
              Browse Courses
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (courseInfo) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl p-10 max-w-md w-full text-center">
          <div className="text-6xl mb-6">✅</div>
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Enrollment Confirmed!
          </h2>
          <div className="bg-green-50 rounded-xl p-6 mb-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              {courseInfo.course.course_code}
            </h3>
            <p className="text-gray-700">{courseInfo.course.title}</p>
          </div>
          <p className="text-gray-600 mb-6">
            Congratulations! You've successfully enrolled in this course.
            You'll receive a confirmation email shortly.
          </p>
          <p className="text-sm text-gray-500 mb-6">
            Redirecting to your dashboard...
          </p>
          <Link
            href="/dashboard"
            className="inline-block px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition"
          >
            Go to Dashboard Now
          </Link>
        </div>
      </div>
    );
  }

  return null;
}

