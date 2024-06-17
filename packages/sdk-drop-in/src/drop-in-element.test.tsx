import { kebabToCamelCase } from './common-app-element';

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
