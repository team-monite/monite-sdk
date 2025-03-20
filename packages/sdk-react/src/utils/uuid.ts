/**
 * Generates a unique ID, using crypto.randomUUID() when available
 * or falling back to a combination of timestamp and random number
 *
 * @returns A string representing a unique identifier
 */
export const generateUniqueId = (): string => {
  if (
    typeof crypto !== 'undefined' &&
    typeof crypto.randomUUID === 'function'
  ) {
    return crypto.randomUUID();
  }

  return `${Date.now().toString(36)}-${Math.random()
    .toString(36)
    .substring(2, 9)}`;
};
