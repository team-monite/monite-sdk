/**
 * Safely accesses nested object properties using dot notation
 * @param obj - The object to access
 * @param path - The dot-separated path to the property (e.g., 'address.city')
 * @returns The value at the path, or undefined if the path doesn't exist
 */
export const getNestedValue = (obj: any, path: string): any => {
  return path.split('.').reduce((acc, key) => acc?.[key], obj);
};
