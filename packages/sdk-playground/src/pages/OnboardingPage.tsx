import { UserIcon } from 'lucide-react';

export function OnboardingPage() {
  return (
    <div className="p-6">
      <div className="flex items-center gap-3 mb-6">
        <UserIcon className="w-8 h-8 text-cyan-600" />
        <h1 className="text-3xl font-bold text-gray-900">Onboarding</h1>
      </div>

      <div className="space-y-6">
        <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Onboarding Progress
          </h2>
          <p className="text-gray-600 mb-4">
            Guide new users through the setup process and help them get started
            with the platform.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="font-medium text-blue-900 mb-2">Active Users</h3>
              <p className="text-2xl font-bold text-blue-600">127</p>
            </div>

            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <h3 className="font-medium text-green-900 mb-2">Completed</h3>
              <p className="text-2xl font-bold text-green-600">94</p>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <h3 className="font-medium text-yellow-900 mb-2">In Progress</h3>
              <p className="text-2xl font-bold text-yellow-600">33</p>
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Onboarding Steps
          </h2>
          <div className="space-y-4">
            <div className="flex items-center gap-4 p-4 bg-green-50 border border-green-200 rounded-lg">
              <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                <span className="text-white font-medium">1</span>
              </div>
              <div className="flex-1">
                <h3 className="font-medium text-gray-900">Account Setup</h3>
                <p className="text-sm text-gray-600">
                  Create account and verify email
                </p>
              </div>
              <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-sm">
                Completed
              </span>
            </div>

            <div className="flex items-center gap-4 p-4 bg-green-50 border border-green-200 rounded-lg">
              <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                <span className="text-white font-medium">2</span>
              </div>
              <div className="flex-1">
                <h3 className="font-medium text-gray-900">
                  Profile Configuration
                </h3>
                <p className="text-sm text-gray-600">
                  Set up company information and preferences
                </p>
              </div>
              <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-sm">
                Completed
              </span>
            </div>

            <div className="flex items-center gap-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <div className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center">
                <span className="text-white font-medium">3</span>
              </div>
              <div className="flex-1">
                <h3 className="font-medium text-gray-900">Payment Setup</h3>
                <p className="text-sm text-gray-600">
                  Configure payment methods and billing
                </p>
              </div>
              <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-sm">
                In Progress
              </span>
            </div>

            <div className="flex items-center gap-4 p-4 bg-gray-50 border border-gray-200 rounded-lg">
              <div className="w-8 h-8 bg-gray-400 rounded-full flex items-center justify-center">
                <span className="text-white font-medium">4</span>
              </div>
              <div className="flex-1">
                <h3 className="font-medium text-gray-900">Team Invitation</h3>
                <p className="text-sm text-gray-600">
                  Invite team members and set up roles
                </p>
              </div>
              <span className="bg-gray-100 text-gray-800 px-2 py-1 rounded text-sm">
                Pending
              </span>
            </div>

            <div className="flex items-center gap-4 p-4 bg-gray-50 border border-gray-200 rounded-lg">
              <div className="w-8 h-8 bg-gray-400 rounded-full flex items-center justify-center">
                <span className="text-white font-medium">5</span>
              </div>
              <div className="flex-1">
                <h3 className="font-medium text-gray-900">First Transaction</h3>
                <p className="text-sm text-gray-600">
                  Create your first invoice or bill
                </p>
              </div>
              <span className="bg-gray-100 text-gray-800 px-2 py-1 rounded text-sm">
                Pending
              </span>
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Onboarding Tools
          </h2>
          <div className="flex flex-wrap gap-3">
            <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
              Start Tour
            </button>
            <button className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">
              Help Center
            </button>
            <button className="bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600">
              Video Tutorials
            </button>
            <button className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600">
              Support Chat
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
