"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const [user, setUser] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    router.push("/");
  };

  return (
    <nav className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="text-2xl font-bold text-gray-900">
            ElectiveHub
          </Link>

          <div className="flex items-center gap-4">
            {user ? (
              <>
                <Link
                  href={user.role === "STUDENT" ? "/dashboard" : "/admin/dashboard"}
                  className="text-gray-700 hover:text-gray-900"
                >
                  Dashboard
                </Link>
                <button
                  onClick={handleLogout}
                  className="text-gray-700 hover:text-gray-900"
                >
                  Logout ({user.name})
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login/student"
                  className="text-gray-700 hover:text-gray-900"
                >
                  Student Login
                </Link>
                <Link
                  href="/login/admin"
                  className="text-gray-700 hover:text-gray-900"
                >
                  Admin Login
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

