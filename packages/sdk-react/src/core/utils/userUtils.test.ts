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
    const user = {
      first_name: 'John',
      last_name: 'Doe',
      email: 'john.doe@example.com',
      login: 'john.doe',
    };

    test('returns email when showEmail is true', () => {
      expect(getUserDisplayName(user, true)).toBe('john.doe@example.com');
    });

    test('returns full name when showEmail is false', () => {
      expect(getUserDisplayName(user, false)).toBe('John Doe');
    });

    test('falls back to login when name is empty and showEmail is false', () => {
      const userWithoutName = {
        first_name: '',
        last_name: '',
        email: 'john.doe@example.com',
        login: 'john.doe',
      };
      expect(getUserDisplayName(userWithoutName, false)).toBe('john.doe');
    });

    test('returns login when email is empty and showEmail is true', () => {
      const userWithoutEmail = {
        first_name: 'John',
        last_name: 'Doe',
        email: '',
        login: 'john.doe',
      };
      expect(getUserDisplayName(userWithoutEmail, true)).toBe('John Doe');
    });
  });
});
