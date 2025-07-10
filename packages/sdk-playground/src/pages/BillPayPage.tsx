import { ReceiptIcon } from 'lucide-react';

export function BillPayPage() {
  return (
    <div className="p-6">
      <div className="flex items-center gap-3 mb-6">
        <ReceiptIcon className="w-8 h-8 text-blue-600" />
        <h1 className="text-3xl font-bold text-gray-900">Bill Pay</h1>
      </div>

      <div className="space-y-6">
        <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Payable Management
          </h2>
          <p className="text-gray-600 mb-4">
            Manage and process your bills and payables efficiently.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="font-medium text-blue-900 mb-2">Pending Bills</h3>
              <p className="text-2xl font-bold text-blue-600">12</p>
            </div>

            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <h3 className="font-medium text-green-900 mb-2">
                Paid This Month
              </h3>
              <p className="text-2xl font-bold text-green-600">$24,350</p>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <h3 className="font-medium text-yellow-900 mb-2">Due Soon</h3>
              <p className="text-2xl font-bold text-yellow-600">5</p>
            </div>

            <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
              <h3 className="font-medium text-purple-900 mb-2">
                Total Vendors
              </h3>
              <p className="text-2xl font-bold text-purple-600">38</p>
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Quick Actions
          </h2>
          <div className="flex flex-wrap gap-3">
            <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
              Create New Bill
            </button>
            <button className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">
              Bulk Payment
            </button>
            <button className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600">
              Export Report
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
