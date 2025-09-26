import {
  getIndividualName,
  getIndividualNameWithFallback,
  getUserDisplayName,
} from './userUtils';

describe('userUtils', () => {
  describe('getIndividualName', () => {
    test('handles separate parameters correctly', () => {
      expect(getIndividualName(' ', ' ')).toBe('');
      expect(getIndividualName(undefined, undefined)).toBe('');
      expect(getIndividualName(undefined, ' Last ')).toBe('Last');
      expect(getIndividualName(' First ', undefined)).toBe('First');
      expect(getIndividualName(' First ', ' Last ')).toBe('First Last');
    });

    test('handles object parameter correctly', () => {
      expect(
        getIndividualName({
          first_name: ' First ',
          last_name: ' Last ',
        })
      ).toBe('First Last');
      expect(
        getIndividualName({
          first_name: ' First ',
          last_name: undefined,
        })
      ).toBe('First');
      expect(
        getIndividualName({
          first_name: undefined,
          last_name: ' Last ',
        })
      ).toBe('Last');
      expect(
        getIndividualName({
          first_name: undefined,
          last_name: undefined,
        })
      ).toBe('');
    });
  });

  describe('getIndividualNameWithFallback', () => {
    test('returns full name when available', () => {
      const user = {
        first_name: 'John',
        last_name: 'Doe',
        login: 'john.doe',
      };
      expect(getIndividualNameWithFallback(user)).toBe('John Doe');
    });

    test('falls back to login when name is empty', () => {
      const user = {
        first_name: '',
        last_name: '',
        login: 'john.doe',
      };
      expect(getIndividualNameWithFallback(user)).toBe('john.doe');
    });

    test('returns empty string when both name and login are empty', () => {
      const user = {
        first_name: '',
        last_name: '',
        login: '',
      };
      expect(getIndividualNameWithFallback(user)).toBe('');
    });

    test('handles null values', () => {
      const user = {
        first_name: null,
        last_name: null,
        login: 'john.doe',
      };
      expect(getIndividualNameWithFallback(user)).toBe('john.doe');
    });
  });

  describe('getUserDisplayName', () => {
    test('returns full name when available (priority 1)', () => {
      const user = {
        first_name: 'John',
        last_name: 'Doe',
        email: 'john.doe@example.com',
        login: 'john.doe',
      };
      expect(getUserDisplayName(user)).toBe('John Doe');
    });

    test('falls back to email when name is empty (priority 2)', () => {
      const userWithoutName = {
        first_name: '',
        last_name: '',
        email: 'john.doe@example.com',
        login: 'john.doe',
      };
      expect(getUserDisplayName(userWithoutName)).toBe('john.doe@example.com');
    });

    test('falls back to login when name and email are empty (priority 3)', () => {
      const userWithoutNameAndEmail = {
        first_name: '',
        last_name: '',
        email: '',
        login: 'john.doe',
      };
      expect(getUserDisplayName(userWithoutNameAndEmail)).toBe('john.doe');
    });

    test('returns empty string when all options are empty', () => {
      const userWithNothing = {
        first_name: '',
        last_name: '',
        email: '',
        login: '',
      };
      expect(getUserDisplayName(userWithNothing)).toBe('');
    });

    test('handles null values correctly', () => {
      const userWithNulls = {
        first_name: null,
        last_name: null,
        email: 'john.doe@example.com',
        login: 'john.doe',
      };
      expect(getUserDisplayName(userWithNulls)).toBe('john.doe@example.com');
    });

    test('handles partial name correctly', () => {
      const userWithOnlyFirstName = {
        first_name: 'John',
        last_name: '',
        email: 'john.doe@example.com',
        login: 'john.doe',
      };
      expect(getUserDisplayName(userWithOnlyFirstName)).toBe('John');
    });

    test('ignores email when ignoreEmail is true', () => {
      const userWithoutName = {
        first_name: '',
        last_name: '',
        email: 'john.doe@example.com',
        login: 'john.doe',
      };
      expect(getUserDisplayName(userWithoutName, true)).toBe('john.doe');
    });

    test('ignores login when ignoreLogin is true', () => {
      const userWithoutNameAndEmail = {
        first_name: '',
        last_name: '',
        email: '',
        login: 'john.doe',
      };
      expect(getUserDisplayName(userWithoutNameAndEmail, false, true)).toBe('');
    });

    test('ignores both email and login when both flags are true', () => {
      const userWithoutName = {
        first_name: '',
        last_name: '',
        email: 'john.doe@example.com',
        login: 'john.doe',
      };
      expect(getUserDisplayName(userWithoutName, true, true)).toBe('');
    });

    test('ignores email but allows login when only ignoreEmail is true', () => {
      const userWithoutName = {
        first_name: '',
        last_name: '',
        email: 'john.doe@example.com',
        login: 'john.doe',
      };
      expect(getUserDisplayName(userWithoutName, true, false)).toBe('john.doe');
    });

    test('ignores login but allows email when only ignoreLogin is true', () => {
      const userWithoutName = {
        first_name: '',
        last_name: '',
        email: 'john.doe@example.com',
        login: 'john.doe',
      };
      expect(getUserDisplayName(userWithoutName, false, true)).toBe(
        'john.doe@example.com'
      );
    });

    test('ignores email and falls back to login when name is available but ignoreEmail is true', () => {
      const userWithName = {
        first_name: 'John',
        last_name: 'Doe',
        email: 'john.doe@example.com',
        login: 'john.doe',
      };
      // Should still return name since it has highest priority
      expect(getUserDisplayName(userWithName, true)).toBe('John Doe');
    });

    test('ignores login and falls back to email when name is available but ignoreLogin is true', () => {
      const userWithName = {
        first_name: 'John',
        last_name: 'Doe',
        email: 'john.doe@example.com',
        login: 'john.doe',
      };
      // Should still return name since it has highest priority
      expect(getUserDisplayName(userWithName, false, true)).toBe('John Doe');
    });

    test('ignores email when user has no name and ignoreEmail is true', () => {
      const userWithoutName = {
        first_name: '',
        last_name: '',
        email: 'john.doe@example.com',
        login: 'john.doe',
      };
      expect(getUserDisplayName(userWithoutName, true, false)).toBe('john.doe');
    });

    test('ignores login when user has no name or email and ignoreLogin is true', () => {
      const userWithoutNameAndEmail = {
        first_name: '',
        last_name: '',
        email: '',
        login: 'john.doe',
      };
      expect(getUserDisplayName(userWithoutNameAndEmail, false, true)).toBe('');
    });

    test('handles null values with ignore flags', () => {
      const userWithNulls = {
        first_name: null,
        last_name: null,
        email: null,
        login: 'john.doe',
      };
      expect(getUserDisplayName(userWithNulls, false, true)).toBe('');
    });

    test('handles partial name with ignore flags', () => {
      const userWithOnlyFirstName = {
        first_name: 'John',
        last_name: '',
        email: 'john.doe@example.com',
        login: 'john.doe',
      };
      // Should still return name since it has highest priority
      expect(getUserDisplayName(userWithOnlyFirstName, true, true)).toBe(
        'John'
      );
    });
  });
});
