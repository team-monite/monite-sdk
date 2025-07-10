import { TagIcon } from 'lucide-react';

export function TagsPage() {
  return (
    <div className="p-6">
      <div className="flex items-center gap-3 mb-6">
        <TagIcon className="w-8 h-8 text-pink-600" />
        <h1 className="text-3xl font-bold text-gray-900">Tags</h1>
      </div>

      <div className="space-y-6">
        <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Tag Management
          </h2>
          <p className="text-gray-600 mb-4">
            Organize and categorize your transactions, invoices, and records
            with custom tags.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="font-medium text-blue-900 mb-2">Total Tags</h3>
              <p className="text-2xl font-bold text-blue-600">24</p>
            </div>

            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <h3 className="font-medium text-green-900 mb-2">Active Tags</h3>
              <p className="text-2xl font-bold text-green-600">18</p>
            </div>

            <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
              <h3 className="font-medium text-purple-900 mb-2">Tagged Items</h3>
              <p className="text-2xl font-bold text-purple-600">456</p>
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Popular Tags
          </h2>
          <div className="flex flex-wrap gap-2">
            <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
              #Office-Supplies
            </span>
            <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">
              #Travel
            </span>
            <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm">
              #Software
            </span>
            <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm">
              #Marketing
            </span>
            <span className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm">
              #Equipment
            </span>
            <span className="bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full text-sm">
              #Consulting
            </span>
            <span className="bg-pink-100 text-pink-800 px-3 py-1 rounded-full text-sm">
              #Utilities
            </span>
            <span className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm">
              #Maintenance
            </span>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Tag Categories
          </h2>
          <div className="space-y-3">
            <div className="flex items-center justify-between py-2 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                <span className="text-gray-700">Expenses</span>
              </div>
              <span className="text-sm text-gray-500">8 tags</span>
            </div>

            <div className="flex items-center justify-between py-2 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="text-gray-700">Revenue</span>
              </div>
              <span className="text-sm text-gray-500">5 tags</span>
            </div>

            <div className="flex items-center justify-between py-2 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                <span className="text-gray-700">Projects</span>
              </div>
              <span className="text-sm text-gray-500">6 tags</span>
            </div>

            <div className="flex items-center justify-between py-2">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                <span className="text-gray-700">Departments</span>
              </div>
              <span className="text-sm text-gray-500">5 tags</span>
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Tag Actions
          </h2>
          <div className="flex flex-wrap gap-3">
            <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
              Create Tag
            </button>
            <button className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">
              Bulk Apply
            </button>
            <button className="bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600">
              Manage Categories
            </button>
            <button className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600">
              Usage Report
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
