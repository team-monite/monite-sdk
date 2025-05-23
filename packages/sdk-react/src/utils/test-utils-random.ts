/**
 * Utility functions for generating random data in tests and mocks.
 * No dependencies here to avoid circular dependency issues.
 */
import { faker } from '@faker-js/faker';

export const generateRandomId = () => faker.string.alphanumeric(10);

export const generateRandomToken = (length: number = 7) =>
  faker.string.alphanumeric(length);

export const generateMeasureUnitId = () =>
  `unit-${faker.string.alphanumeric(9)}`;

export const generateRandomDate = () => faker.date.past().toString();

export function getRandomProperty<T = unknown>(obj: Record<string, T>): T {
  const keys = Object.keys(obj);
  const randomIndex = faker.number.int({ min: 0, max: keys.length - 1 });

  return obj[keys[randomIndex]];
}

export function getRandomItemFromArray<T = unknown>(
  array: Array<T>
): T | undefined {
  if (array.length === 0) {
    return undefined;
  }

  const randomIndex = faker.number.int({ min: 0, max: array.length - 1 });

  return array[randomIndex];
}

export function getSampleFromArray<T = unknown>(array: Array<T>): Array<T> {
  if (array.length === 0) {
    return [];
  }

  const sampleSize = getRandomNumber(0, array.length);

  return array.slice(0, sampleSize);
}

export function getRandomBoolean(): boolean {
  return faker.datatype.boolean();
}

export function getRandomNumber(min = 0, max = 100) {
  return faker.number.int({ min, max });
}
