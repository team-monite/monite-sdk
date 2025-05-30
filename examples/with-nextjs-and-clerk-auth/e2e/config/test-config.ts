// Test configuration data
export const testConfig = {
  // Auth credentials - in real usage, these should come from environment variables
  auth: {
    email: process.env.TEST_USER_EMAIL || 'test@monite.com',
    password: process.env.TEST_USER_PASSWORD || 'test',
  },

  // API endpoints
  api: {
    baseUrl: process.env.NEXT_PUBLIC_API_URL || 'https://dev.demo.monite.com',
  },

  // Test data
  testData: {
    organizationName: 'Test Organization',
    // Add more test data as needed
  },
};
