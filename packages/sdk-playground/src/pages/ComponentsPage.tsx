export function ComponentsPage() {
  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-gray-900 mb-4">Components</h1>
      <p className="text-gray-600 mb-6">
        Explore and test different SDK components here.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Button Component
          </h3>
          <p className="text-gray-600 mb-3">
            Interactive button elements with various styles
          </p>
          <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
            Example Button
          </button>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Input Component
          </h3>
          <p className="text-gray-600 mb-3">
            Form input elements with validation
          </p>
          <input
            type="text"
            placeholder="Example input"
            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Card Component
          </h3>
          <p className="text-gray-600 mb-3">Flexible content containers</p>
          <div className="bg-gray-50 p-3 rounded text-sm text-gray-700">
            This is an example card content
          </div>
        </div>
      </div>
    </div>
  );
}
