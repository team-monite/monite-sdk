export function HomePage() {
  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-gray-900 mb-4">
        Welcome to SDK Playground
      </h1>
      <p className="text-gray-600 mb-6">
        This is the home page of the SDK Playground. Navigate using the sidebar
        to explore different sections.
      </p>
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h2 className="text-lg font-semibold text-blue-900 mb-2">
          Getting Started
        </h2>
        <p className="text-blue-700">
          Use the sidebar to navigate to different sections like Components,
          Documentation, and Settings.
        </p>
      </div>
    </div>
  );
}
