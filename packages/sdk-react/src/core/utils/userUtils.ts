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
 * Gets the display name for a user with fallback priority:
 * 1. First + last name
 * 2. Email (unless ignoreEmail is true)
 * 3. Login (unless ignoreLogin is true)
 *
 * @param user - User object with name, email, and login properties
 * @param ignoreEmail - If true, skip email fallback and go directly to login
 * @param ignoreLogin - If true, skip login fallback and return empty string if no name/email
 * @returns Display name based on priority order with fallbacks
 */
export function getUserDisplayName(
  user: {
    first_name?: string | null;
    last_name?: string | null;
    email?: string | null;
    login?: string | null;
  },
  ignoreEmail?: boolean,
  ignoreLogin?: boolean
): string {
  // 1. Try first + last name
  const fullName = getIndividualName(
    user.first_name || '',
    user.last_name || ''
  );
  if (fullName) {
    return fullName;
  }

  // 2. Try email
  if (user.email && !ignoreEmail) {
    return user.email;
  }

  // 3. Try login
  if (user.login && !ignoreLogin) {
    return user.login;
  }

  // Fallback to empty string
  return '';
}
