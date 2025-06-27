export const kebabToCamelCase = (s: string): string =>
  s.replace(/-([a-z])/g, (g) => g[1].toUpperCase());
