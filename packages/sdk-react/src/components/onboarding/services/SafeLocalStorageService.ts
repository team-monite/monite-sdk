export interface StorageService {
  get(key: string): string | null;
  set(key: string, value: string): void;
  remove(key: string): void;
  clear(): void;
}

/**
 * Safe localStorage implementation that handles SSR and storage errors gracefully.
 *
 * This service provides a resilient wrapper around browser localStorage that:
 * - Works in server-side rendering environments (returns null/no-op)
 * - Handles storage quota exceeded errors silently
 * - Handles localStorage being disabled/blocked by user settings
 * - Handles privacy mode where localStorage might throw
 *
 * @example
 * ```typescript
 * const storage = new SafeLocalStorageService();
 * storage.set('key', 'value');
 * const value = storage.get('key'); // Returns 'value' or null
 * ```
 */
export class SafeLocalStorageService implements StorageService {
  /**
   * Check if localStorage is available in the current environment
   */
  private isAvailable(): boolean {
    try {
      return typeof window !== 'undefined' && 'localStorage' in window;
    } catch {
      return false;
    }
  }

  /**
   * Get a value from localStorage
   * @returns The stored value or null if not found/unavailable
   */
  get(key: string): string | null {
    if (!this.isAvailable()) return null;

    try {
      return localStorage.getItem(key);
    } catch {
      return null;
    }
  }

  /**
   * Set a value in localStorage
   * Fails silently if storage is unavailable or quota is exceeded
   */
  set(key: string, value: string): void {
    if (!this.isAvailable()) return;

    try {
      localStorage.setItem(key, value);
    } catch {
      // Silently fail - localStorage might be full or disabled
    }
  }

  /**
   * Remove a value from localStorage
   * Fails silently if storage is unavailable
   */
  remove(key: string): void {
    if (!this.isAvailable()) return;

    try {
      localStorage.removeItem(key);
    } catch {
      // Silently fail
    }
  }

  /**
   * Clear all values from localStorage
   * Fails silently if storage is unavailable
   */
  clear(): void {
    if (!this.isAvailable()) return;

    try {
      localStorage.clear();
    } catch {
      // Silently fail
    }
  }
}
