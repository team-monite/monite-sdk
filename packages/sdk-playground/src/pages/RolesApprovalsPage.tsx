import { UserIcon } from 'lucide-react';

export function RolesApprovalsPage() {
  return (
    <div className="p-6">
      <div className="flex items-center gap-3 mb-6">
        <UserIcon className="w-8 h-8 text-teal-600" />
        <h1 className="text-3xl font-bold text-gray-900">
          Roles and Approvals
        </h1>
      </div>

      <div className="space-y-6">
        <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Role Management
          </h2>
          <p className="text-gray-600 mb-4">
            Define user roles and configure approval workflows for your
            organization.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="font-medium text-blue-900 mb-2">Total Roles</h3>
              <p className="text-2xl font-bold text-blue-600">8</p>
            </div>

            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <h3 className="font-medium text-green-900 mb-2">Active Users</h3>
              <p className="text-2xl font-bold text-green-600">34</p>
            </div>

            <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
              <h3 className="font-medium text-purple-900 mb-2">
                Approval Policies
              </h3>
              <p className="text-2xl font-bold text-purple-600">6</p>
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            System Roles
          </h2>
          <div className="space-y-3">
            <div className="flex items-center justify-between py-3 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                  <UserIcon className="w-5 h-5 text-red-600" />
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">Administrator</h3>
                  <p className="text-sm text-gray-600">Full system access</p>
                </div>
              </div>
              <span className="text-sm text-gray-500">3 users</span>
            </div>

            <div className="flex items-center justify-between py-3 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <UserIcon className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">Manager</h3>
                  <p className="text-sm text-gray-600">
                    Team management and approvals
                  </p>
                </div>
              </div>
              <span className="text-sm text-gray-500">8 users</span>
            </div>

            <div className="flex items-center justify-between py-3 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                  <UserIcon className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">Accountant</h3>
                  <p className="text-sm text-gray-600">Financial operations</p>
                </div>
              </div>
              <span className="text-sm text-gray-500">5 users</span>
            </div>

            <div className="flex items-center justify-between py-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                  <UserIcon className="w-5 h-5 text-gray-600" />
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">Employee</h3>
                  <p className="text-sm text-gray-600">Basic user access</p>
                </div>
              </div>
              <span className="text-sm text-gray-500">18 users</span>
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Role Management
          </h2>
          <div className="flex flex-wrap gap-3">
            <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
              Create Role
            </button>
            <button className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">
              Assign Users
            </button>
            <button className="bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600">
              Configure Permissions
            </button>
            <button className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600">
              Audit Log
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
