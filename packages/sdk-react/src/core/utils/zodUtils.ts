/**
 * Coerce a string to a number, returning undefined if the string is empty.
 * @param input - The string to coerce.
 * @returns The coerced number, or undefined if the string is empty.
 */
export function coerceNumber(input: unknown): number | undefined | unknown {
  if (typeof input !== 'string') {
    return input;
  }
  if (input.trim() === '') {
    return undefined;
  }
  const number = Number(input);
  return Number.isNaN(number) ? input : number;
}
