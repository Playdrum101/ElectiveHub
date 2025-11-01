import Link from "next/link";
import Image from "next/image";

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="container mx-auto px-4 py-16">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="flex justify-center mb-6">
            <div className="relative w-32 h-32">
              <Image
                src="/logo.png"
                alt="ElectiveHub Logo"
                width={128}
                height={128}
                className="object-contain drop-shadow-lg"
                priority
                unoptimized
              />
            </div>
          </div>
          <h1 className="text-6xl font-bold text-gray-900 mb-4 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            Welcome to ElectiveHub
          </h1>
          <p className="text-2xl text-gray-600 mb-2">
            Real-time course registration system
          </p>
          <p className="text-lg text-gray-500">
            Enroll in courses instantly with automated waitlist management
          </p>
        </div>

        <div className="max-w-5xl mx-auto">
          <div className="bg-white rounded-2xl shadow-2xl p-10 mb-8 border border-gray-100">
            <h2 className="text-3xl font-bold mb-8 text-gray-800 text-center">
              Get Started
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              <Link
                href="/login/student"
                className="group bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-5 px-8 rounded-xl transition-all duration-200 text-center shadow-lg hover:shadow-xl transform hover:-translate-y-1"
              >
                <div className="text-xl mb-1">👨‍🎓</div>
                <div>Student Login</div>
                <div className="text-sm opacity-90 mt-1">Access your dashboard</div>
              </Link>
              <Link
                href="/login/admin"
                className="group bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white font-semibold py-5 px-8 rounded-xl transition-all duration-200 text-center shadow-lg hover:shadow-xl transform hover:-translate-y-1"
              >
                <div className="text-xl mb-1">⚙️</div>
                <div>Admin Login</div>
                <div className="text-sm opacity-90 mt-1">Manage courses</div>
              </Link>
              <Link
                href="/register"
                className="group bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-semibold py-5 px-8 rounded-xl transition-all duration-200 text-center shadow-lg hover:shadow-xl transform hover:-translate-y-1"
              >
                <div className="text-xl mb-1">✨</div>
                <div>Student Registration</div>
                <div className="text-sm opacity-90 mt-1">Create your account</div>
              </Link>
              <Link
                href="/catalog"
                className="group bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white font-semibold py-5 px-8 rounded-xl transition-all duration-200 text-center shadow-lg hover:shadow-xl transform hover:-translate-y-1"
              >
                <div className="text-xl mb-1">📚</div>
                <div>Browse Courses</div>
                <div className="text-sm opacity-90 mt-1">View available courses</div>
              </Link>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-2xl p-10 border border-gray-100">
            <h2 className="text-3xl font-bold mb-8 text-gray-800 text-center">
              Key Features
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="flex items-start gap-4 p-4 rounded-lg hover:bg-blue-50 transition-colors">
                <div className="text-3xl">⚡</div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Real-Time Updates</h3>
                  <p className="text-gray-600 text-sm">Live seat availability via WebSockets</p>
                </div>
              </div>
              <div className="flex items-start gap-4 p-4 rounded-lg hover:bg-green-50 transition-colors">
                <div className="text-3xl">📋</div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Automated Waitlist</h3>
                  <p className="text-gray-600 text-sm">Fair time-based queuing system</p>
                </div>
              </div>
              <div className="flex items-start gap-4 p-4 rounded-lg hover:bg-yellow-50 transition-colors">
                <div className="text-3xl">🔒</div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Transaction Safe</h3>
                  <p className="text-gray-600 text-sm">Prevents overbooking with database locks</p>
                </div>
              </div>
              <div className="flex items-start gap-4 p-4 rounded-lg hover:bg-purple-50 transition-colors">
                <div className="text-3xl">🚫</div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Conflict Detection</h3>
                  <p className="text-gray-600 text-sm">Schedule and credit limit validation</p>
                </div>
              </div>
              <div className="flex items-start gap-4 p-4 rounded-lg hover:bg-pink-50 transition-colors">
                <div className="text-3xl">📧</div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Email Notifications</h3>
                  <p className="text-gray-600 text-sm">Alerts for waitlist promotions</p>
                </div>
              </div>
              <div className="flex items-start gap-4 p-4 rounded-lg hover:bg-indigo-50 transition-colors">
                <div className="text-3xl">👨‍💼</div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Admin Dashboard</h3>
                  <p className="text-gray-600 text-sm">Full course management interface</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

