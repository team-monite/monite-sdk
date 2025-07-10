import { CheckCircleIcon } from 'lucide-react';

export function ApprovalRequestsPage() {
  return (
    <div className="p-6">
      <div className="flex items-center gap-3 mb-6">
        <CheckCircleIcon className="w-8 h-8 text-orange-600" />
        <h1 className="text-3xl font-bold text-gray-900">Approval Requests</h1>
      </div>

      <div className="space-y-6">
        <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Approval Queue
          </h2>
          <p className="text-gray-600 mb-4">
            Review and approve pending requests across your organization.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <h3 className="font-medium text-yellow-900 mb-2">Pending</h3>
              <p className="text-2xl font-bold text-yellow-600">7</p>
            </div>

            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <h3 className="font-medium text-green-900 mb-2">Approved</h3>
              <p className="text-2xl font-bold text-green-600">156</p>
            </div>

            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <h3 className="font-medium text-red-900 mb-2">Rejected</h3>
              <p className="text-2xl font-bold text-red-600">8</p>
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Pending Approvals
          </h2>
          <div className="space-y-4">
            <div className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-medium text-gray-900">
                  Purchase Order #PO-1024
                </h3>
                <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-sm">
                  Pending
                </span>
              </div>
              <p className="text-gray-600 mb-3">
                Amount: $2,450.00 | Vendor: Office Supplies Co.
              </p>
              <div className="flex gap-2">
                <button className="bg-green-500 text-white px-3 py-1 rounded text-sm hover:bg-green-600">
                  Approve
                </button>
                <button className="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600">
                  Reject
                </button>
                <button className="bg-gray-500 text-white px-3 py-1 rounded text-sm hover:bg-gray-600">
                  Details
                </button>
              </div>
            </div>

            <div className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-medium text-gray-900">
                  Expense Report #EXP-0789
                </h3>
                <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-sm">
                  Pending
                </span>
              </div>
              <p className="text-gray-600 mb-3">
                Amount: $567.89 | Employee: John Smith
              </p>
              <div className="flex gap-2">
                <button className="bg-green-500 text-white px-3 py-1 rounded text-sm hover:bg-green-600">
                  Approve
                </button>
                <button className="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600">
                  Reject
                </button>
                <button className="bg-gray-500 text-white px-3 py-1 rounded text-sm hover:bg-gray-600">
                  Details
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Approval Settings
          </h2>
          <div className="flex flex-wrap gap-3">
            <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
              Configure Policies
            </button>
            <button className="bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600">
              Approval History
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
