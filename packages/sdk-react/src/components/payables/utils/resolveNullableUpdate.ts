/**
 * Resolve how to propagate a possibly-nullable field.
 *
 * Behavior:
 * - If current is provided (including null), return current
 * - Else if previous exists, return null (explicit unset)
 * - Else return undefined (omit)
 */
export function resolveNullableUpdate<T>(
  current: T | null | undefined,
  previous?: T | null | undefined
): T | null | undefined {
  if (current !== undefined) return current;
  if (previous !== undefined) return null;
  return undefined;
}
