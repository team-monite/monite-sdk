/**
 * Utility functions for generating random data in tests and mocks.
 * No dependencies here to avoid circular dependency issues.
 */

export const generateRandomId = () =>
  (Math.random() + 1).toString(36).substring(2);

export const generateRandomDate = () =>
  new Date(new Date().getDate() - Math.random() * 1e12).toString();

export function getRandomProperty<T = unknown>(obj: Record<string, T>): T {
  const keys = Object.keys(obj);

  return obj[keys[(keys.length * Math.random()) << 0]];
}

export function getRandomItemFromArray<T = unknown>(array: Array<T>): T {
  const randomIndex = Math.floor(Math.random() * array.length);

  return array[randomIndex];
}

export function getSampleFromArray<T = unknown>(array: Array<T>): Array<T> {
  const sampleSize = getRandomNumber(0, array.length - 1);

  return array.slice(0, sampleSize);
}

export function getRandomBoolean(): boolean {
  return Math.random() < 0.5;
}

export function getRandomNumber(min = 0, max = 100) {
  return Math.floor(Math.random() * (max - min)) + min;
}
