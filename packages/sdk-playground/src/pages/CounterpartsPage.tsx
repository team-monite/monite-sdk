import { Building2Icon } from 'lucide-react';

export function CounterpartsPage() {
  return (
    <div className="p-6">
      <div className="flex items-center gap-3 mb-6">
        <Building2Icon className="w-8 h-8 text-purple-600" />
        <h1 className="text-3xl font-bold text-gray-900">Counterparts</h1>
      </div>

      <div className="space-y-6">
        <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Counterpart Overview
          </h2>
          <p className="text-gray-600 mb-4">
            Manage your business relationships with vendors, customers, and
            partners.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="font-medium text-blue-900 mb-2">Vendors</h3>
              <p className="text-2xl font-bold text-blue-600">47</p>
            </div>

            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <h3 className="font-medium text-green-900 mb-2">Customers</h3>
              <p className="text-2xl font-bold text-green-600">134</p>
            </div>

            <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
              <h3 className="font-medium text-purple-900 mb-2">Partners</h3>
              <p className="text-2xl font-bold text-purple-600">12</p>
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Recent Counterparts
          </h2>
          <div className="space-y-3">
            <div className="flex items-center justify-between py-3 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <Building2Icon className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">
                    Acme Corporation
                  </h3>
                  <p className="text-sm text-gray-600">Vendor • Technology</p>
                </div>
              </div>
              <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-sm">
                Active
              </span>
            </div>

            <div className="flex items-center justify-between py-3 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                  <Building2Icon className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">
                    Global Solutions Ltd
                  </h3>
                  <p className="text-sm text-gray-600">Customer • Consulting</p>
                </div>
              </div>
              <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-sm">
                Active
              </span>
            </div>

            <div className="flex items-center justify-between py-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                  <Building2Icon className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">
                    Tech Partners Inc
                  </h3>
                  <p className="text-sm text-gray-600">Partner • Software</p>
                </div>
              </div>
              <span className="bg-gray-100 text-gray-800 px-2 py-1 rounded text-sm">
                Pending
              </span>
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Actions</h2>
          <div className="flex flex-wrap gap-3">
            <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
              Add Counterpart
            </button>
            <button className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">
              Import Contacts
            </button>
            <button className="bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600">
              Manage Categories
            </button>
            <button className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600">
              Export List
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
