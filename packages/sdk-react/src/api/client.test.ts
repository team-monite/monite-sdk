import { isMoniteEntityIdPath } from '@/api/client';

describe('moniteEntityIdPathsRegExp', () => {
  test('should not match paths that are not in the list of paths that require', () => {
    expect(isMoniteEntityIdPath('/auth')).toBe(false);
    expect(isMoniteEntityIdPath('/entities')).toBe(false);
    expect(isMoniteEntityIdPath('/entity_users/foo/bar')).toBe(false);
    expect(isMoniteEntityIdPath('/receivables/variables')).toBe(false);
  });

  test('should match paths that are in the list of paths that require', () => {
    expect(isMoniteEntityIdPath('/foo')).toBe(true);
    expect(isMoniteEntityIdPath('/bar')).toBe(true);
    expect(isMoniteEntityIdPath('/foo/bar')).toBe(true);
    expect(isMoniteEntityIdPath('/foo/bar/baz')).toBe(true);
  });
});
