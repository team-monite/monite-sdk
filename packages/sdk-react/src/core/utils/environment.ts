/**
 * Environment detection utilities
 *
 * These constants provide a way to detect the runtime environment,
 * handling SSR, browser, and testing environments
 */

export const isServer = typeof window === 'undefined';
export const isBrowser = !isServer;

export const hasDocument = () => typeof document !== 'undefined';
export const hasLocalStorage = () =>
  isBrowser && typeof localStorage !== 'undefined';

export const hasMatchMedia = () =>
  isBrowser && typeof window.matchMedia === 'function';
