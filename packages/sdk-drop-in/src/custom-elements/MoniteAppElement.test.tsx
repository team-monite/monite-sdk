import { vi } from 'vitest';

import { kebabToCamelCase } from './MoniteAppElement';

// Mock the problematic sdk-react import to avoid ES module issues
vi.mock('@monite/sdk-react', () => ({
  default: {},
  APISchema: {},
}));

// Mock the MoniteApp import to avoid dependency issues
vi.mock('@/apps/MoniteApp', () => ({
  MoniteApp: () => null,
}));

describe('kebabToCamel', () => {
  it('converts kebab-case to camelCase', () => {
    expect(kebabToCamelCase('one-two-three')).toBe('oneTwoThree');
    expect(kebabToCamelCase('hello-world')).toBe('helloWorld');
    expect(kebabToCamelCase('foo-bar-baz')).toBe('fooBarBaz');
    expect(kebabToCamelCase('kebab-case')).toBe('kebabCase');
  });

  it('returns the original string if there are no hyphens', () => {
    expect(kebabToCamelCase('camelCase')).toBe('camelCase');
  });
});
