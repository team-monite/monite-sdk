import { ZapIcon } from 'lucide-react';

export function IntegrationsPage() {
  return (
    <div className="p-6">
      <div className="flex items-center gap-3 mb-6">
        <ZapIcon className="w-8 h-8 text-amber-600" />
        <h1 className="text-3xl font-bold text-gray-900">Integrations</h1>
      </div>

      <div className="space-y-6">
        <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Integration Overview
          </h2>
          <p className="text-gray-600 mb-4">
            Connect your platform with third-party services and tools to
            streamline your workflow.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="font-medium text-blue-900 mb-2">Available</h3>
              <p className="text-2xl font-bold text-blue-600">25</p>
            </div>

            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <h3 className="font-medium text-green-900 mb-2">Connected</h3>
              <p className="text-2xl font-bold text-green-600">8</p>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <h3 className="font-medium text-yellow-900 mb-2">Pending</h3>
              <p className="text-2xl font-bold text-yellow-600">3</p>
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Popular Integrations
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <ZapIcon className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">QuickBooks</h3>
                  <p className="text-sm text-gray-600">Accounting Software</p>
                </div>
              </div>
              <p className="text-sm text-gray-600 mb-3">
                Sync your financial data with QuickBooks for seamless
                accounting.
              </p>
              <div className="flex items-center justify-between">
                <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-sm">
                  Connected
                </span>
                <button className="text-blue-500 hover:text-blue-600 text-sm">
                  Configure
                </button>
              </div>
            </div>

            <div className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <ZapIcon className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">Slack</h3>
                  <p className="text-sm text-gray-600">Team Communication</p>
                </div>
              </div>
              <p className="text-sm text-gray-600 mb-3">
                Get notifications and updates directly in your Slack channels.
              </p>
              <div className="flex items-center justify-between">
                <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-sm">
                  Connected
                </span>
                <button className="text-blue-500 hover:text-blue-600 text-sm">
                  Configure
                </button>
              </div>
            </div>

            <div className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                  <ZapIcon className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">Zapier</h3>
                  <p className="text-sm text-gray-600">Automation Platform</p>
                </div>
              </div>
              <p className="text-sm text-gray-600 mb-3">
                Create automated workflows with thousands of apps.
              </p>
              <div className="flex items-center justify-between">
                <span className="bg-gray-100 text-gray-800 px-2 py-1 rounded text-sm">
                  Available
                </span>
                <button className="bg-blue-500 text-white px-3 py-1 rounded text-sm hover:bg-blue-600">
                  Connect
                </button>
              </div>
            </div>

            <div className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                  <ZapIcon className="w-5 h-5 text-orange-600" />
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">Salesforce</h3>
                  <p className="text-sm text-gray-600">CRM Platform</p>
                </div>
              </div>
              <p className="text-sm text-gray-600 mb-3">
                Sync customer data and streamline your sales process.
              </p>
              <div className="flex items-center justify-between">
                <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-sm">
                  Pending
                </span>
                <button className="text-blue-500 hover:text-blue-600 text-sm">
                  Setup
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Integration Categories
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="text-center p-4 border border-gray-200 rounded-lg">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                <ZapIcon className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="font-medium text-gray-900 mb-2">Accounting</h3>
              <p className="text-sm text-gray-600">5 integrations</p>
            </div>

            <div className="text-center p-4 border border-gray-200 rounded-lg">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                <ZapIcon className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="font-medium text-gray-900 mb-2">Communication</h3>
              <p className="text-sm text-gray-600">3 integrations</p>
            </div>

            <div className="text-center p-4 border border-gray-200 rounded-lg">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                <ZapIcon className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="font-medium text-gray-900 mb-2">CRM</h3>
              <p className="text-sm text-gray-600">4 integrations</p>
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Integration Management
          </h2>
          <div className="flex flex-wrap gap-3">
            <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
              Browse All
            </button>
            <button className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">
              API Documentation
            </button>
            <button className="bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600">
              Webhook Settings
            </button>
            <button className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600">
              Usage Analytics
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
