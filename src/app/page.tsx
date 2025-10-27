import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            Welcome to ElectiveHub
          </h1>
          <p className="text-xl text-gray-600">
            Real-time course registration with automated waitlist management
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow-xl p-8 mb-8">
            <h2 className="text-2xl font-semibold mb-6 text-gray-800">
              Get Started
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              <Link
                href="/login/student"
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 px-6 rounded-lg transition duration-200 text-center"
              >
                Student Login
              </Link>
              <Link
                href="/login/admin"
                className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-4 px-6 rounded-lg transition duration-200 text-center"
              >
                Admin Login
              </Link>
              <Link
                href="/register"
                className="bg-green-600 hover:bg-green-700 text-white font-semibold py-4 px-6 rounded-lg transition duration-200 text-center"
              >
                Student Registration
              </Link>
              <Link
                href="/catalog"
                className="bg-purple-600 hover:bg-purple-700 text-white font-semibold py-4 px-6 rounded-lg transition duration-200 text-center"
              >
                Browse Courses
              </Link>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-xl p-8">
            <h2 className="text-2xl font-semibold mb-6 text-gray-800">
              Features
            </h2>
            <ul className="space-y-4 text-gray-700">
              <li className="flex items-start">
                <span className="text-green-600 mr-2">✓</span>
                <span>Real-time seat availability updates via WebSockets</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-600 mr-2">✓</span>
                <span>Automated waitlist with time-based fair queuing</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-600 mr-2">✓</span>
                <span>Transaction-safe registration to prevent overbooking</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-600 mr-2">✓</span>
                <span>Schedule conflict detection and credit limit validation</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-600 mr-2">✓</span>
                <span>Email notifications for waitlist promotions</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-600 mr-2">✓</span>
                <span>Admin dashboard for course management</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </main>
  );
}

