/**
 * Utility functions for handling user names and display logic
 */

/**
 * Combines first and last name into a full name string.
 * Handles both object and separate parameter formats.
 *
 * @param firstName - First name string or object with first_name and last_name properties
 * @param lastName - Last name string (only used when firstName is a string)
 * @returns Combined full name with proper spacing and trimming
 */
export function getIndividualName(name: {
  first_name: string | undefined;
  last_name: string | undefined;
}): string;
export function getIndividualName(
  firstName: string | undefined,
  lastName: string | undefined
): string;
export function getIndividualName(
  firstName:
    | string
    | undefined
    | {
        first_name: string | undefined;
        last_name: string | undefined;
      },
  lastName?: string
): string {
  const { first_name, last_name } =
    firstName && typeof firstName === 'object'
      ? firstName
      : {
          first_name: firstName,
          last_name: lastName,
        };

  return `${first_name?.trim() ?? ''} ${last_name?.trim() ?? ''}`.trim();
}

/**
 * Gets individual name with fallback to login if name is empty.
 * Useful for user display components that need to show something meaningful.
 *
 * @param user - User object with name and login properties
 * @returns Full name if available, otherwise login, or empty string
 */
export function getIndividualNameWithFallback(user: {
  first_name?: string | null;
  last_name?: string | null;
  login?: string | null;
}): string {
  const fullName = getIndividualName(
    user.first_name || '',
    user.last_name || ''
  );

  return fullName || user.login || '';
}

/**
 * Gets the display name for a user based on preferences.
 * Shows email if requested, otherwise shows full name with login fallback.
 *
 * @param user - User object with name, email, and login properties
 * @param showEmail - Whether to prioritize email over name
 * @returns Appropriate display name based on preferences
 */
export function getUserDisplayName(
  user: {
    first_name?: string | null;
    last_name?: string | null;
    email?: string | null;
    login?: string | null;
  },
  showEmail: boolean = false
): string {
  if (showEmail && user.email) {
    return user.email;
  }

  return getIndividualNameWithFallback(user);
}
