import { useState, useEffect } from 'react';

import { hasLocalStorage } from '@/core/utils';

/**
 * Hook for persistent storage of form fields with SSR safety
 * @param componentPrefix - Prefix to avoid key collisions between different components
 * @param key - The key to store the value under
 * @param initialValue - The initial value to use if none is stored
 */
export const useLocalStorageFields = <T>(
  componentPrefix: string,
  key: string,
  initialValue: T
): [T, (value: T) => void, boolean, (checked: boolean) => void] => {
  const [storedValue, setStoredValue] = useState<T>(initialValue);
  const [isRemembered, setIsRemembered] = useState(false);

  const prefixedKey = `${componentPrefix}:${key}`;
  const rememberKey = `${componentPrefix}:${key}:remembered`;

  useEffect(() => {
    try {
      if (hasLocalStorage) {
        const remembered = window.localStorage.getItem(rememberKey) === 'true';
        setIsRemembered(remembered);

        if (remembered) {
          const item = window.localStorage.getItem(prefixedKey);
          setStoredValue(item ? JSON.parse(item) : initialValue);
        }
      }
    } catch (error) {
      console.error('Error accessing localStorage:', error);
      setStoredValue(initialValue);
    }
  }, [prefixedKey, rememberKey, initialValue]);

  const setValue = (value: T) => {
    try {
      const valueToStore =
        value instanceof Function ? value(storedValue) : value;

      setStoredValue(valueToStore);

      if (hasLocalStorage && isRemembered) {
        window.localStorage.setItem(prefixedKey, JSON.stringify(valueToStore));
      }
    } catch (error) {
      console.error('Error saving to localStorage:', error);
    }
  };

  const setRemembered = (checked: boolean) => {
    try {
      setIsRemembered(checked);

      if (hasLocalStorage) {
        window.localStorage.setItem(rememberKey, String(checked));

        if (checked) {
          window.localStorage.setItem(prefixedKey, JSON.stringify(storedValue));
        } else {
          window.localStorage.removeItem(prefixedKey);
        }
      }
    } catch (error) {
      console.error('Error updating remembered state:', error);
    }
  };

  return [storedValue, setValue, isRemembered, setRemembered];
};
