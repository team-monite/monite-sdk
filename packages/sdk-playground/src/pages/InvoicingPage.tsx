import { FileIcon } from 'lucide-react';

export function InvoicingPage() {
  return (
    <div className="p-6">
      <div className="flex items-center gap-3 mb-6">
        <FileIcon className="w-8 h-8 text-green-600" />
        <h1 className="text-3xl font-bold text-gray-900">Invoicing</h1>
      </div>

      <div className="space-y-6">
        <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Invoice Overview
          </h2>
          <p className="text-gray-600 mb-4">
            Create, send, and manage invoices for your business.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="font-medium text-blue-900 mb-2">Draft</h3>
              <p className="text-2xl font-bold text-blue-600">8</p>
            </div>

            <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
              <h3 className="font-medium text-orange-900 mb-2">Sent</h3>
              <p className="text-2xl font-bold text-orange-600">15</p>
            </div>

            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <h3 className="font-medium text-green-900 mb-2">Paid</h3>
              <p className="text-2xl font-bold text-green-600">42</p>
            </div>

            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <h3 className="font-medium text-red-900 mb-2">Overdue</h3>
              <p className="text-2xl font-bold text-red-600">3</p>
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Recent Activity
          </h2>
          <div className="space-y-3">
            <div className="flex items-center justify-between py-2 border-b border-gray-100">
              <span className="text-gray-700">
                Invoice #INV-001 sent to Acme Corp
              </span>
              <span className="text-sm text-gray-500">2 hours ago</span>
            </div>
            <div className="flex items-center justify-between py-2 border-b border-gray-100">
              <span className="text-gray-700">
                Payment received for Invoice #INV-042
              </span>
              <span className="text-sm text-gray-500">1 day ago</span>
            </div>
            <div className="flex items-center justify-between py-2">
              <span className="text-gray-700">
                Invoice #INV-038 marked as overdue
              </span>
              <span className="text-sm text-gray-500">2 days ago</span>
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Quick Actions
          </h2>
          <div className="flex flex-wrap gap-3">
            <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
              Create Invoice
            </button>
            <button className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">
              Send Reminders
            </button>
            <button className="bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600">
              Generate Report
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
