/**
 * Mock for CSS imports in Storybook
 * This prevents "does not provide an export named 'default'" errors
 * when CSS files are imported as modules.
 */

// Mock default export for CSS files
const cssDefaultExport = '';

export default cssDefaultExport;

// Also export as named export in case some imports expect it
export const css = cssDefaultExport;
