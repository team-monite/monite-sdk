import { PackageIcon } from 'lucide-react';

export function ProductsPage() {
  return (
    <div className="p-6">
      <div className="flex items-center gap-3 mb-6">
        <PackageIcon className="w-8 h-8 text-indigo-600" />
        <h1 className="text-3xl font-bold text-gray-900">Products</h1>
      </div>

      <div className="space-y-6">
        <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Product Catalog
          </h2>
          <p className="text-gray-600 mb-4">
            Manage your product and service catalog for invoicing and sales.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="font-medium text-blue-900 mb-2">Total Products</h3>
              <p className="text-2xl font-bold text-blue-600">89</p>
            </div>

            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <h3 className="font-medium text-green-900 mb-2">Active</h3>
              <p className="text-2xl font-bold text-green-600">76</p>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <h3 className="font-medium text-yellow-900 mb-2">Categories</h3>
              <p className="text-2xl font-bold text-yellow-600">12</p>
            </div>

            <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
              <h3 className="font-medium text-purple-900 mb-2">Services</h3>
              <p className="text-2xl font-bold text-purple-600">23</p>
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Featured Products
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="border border-gray-200 rounded-lg p-4">
              <h3 className="font-medium text-gray-900 mb-2">
                Premium Consulting
              </h3>
              <p className="text-gray-600 mb-2">
                Professional consulting services
              </p>
              <p className="text-lg font-bold text-green-600">$150/hour</p>
              <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-sm">
                Active
              </span>
            </div>

            <div className="border border-gray-200 rounded-lg p-4">
              <h3 className="font-medium text-gray-900 mb-2">
                Software License
              </h3>
              <p className="text-gray-600 mb-2">Annual software subscription</p>
              <p className="text-lg font-bold text-blue-600">$1,200/year</p>
              <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm">
                Recurring
              </span>
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Product Management
          </h2>
          <div className="flex flex-wrap gap-3">
            <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
              Add Product
            </button>
            <button className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">
              Import Catalog
            </button>
            <button className="bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600">
              Manage Categories
            </button>
            <button className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600">
              Export Data
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
