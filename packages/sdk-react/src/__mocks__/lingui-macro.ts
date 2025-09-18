/**
 * Mock implementation of @lingui/macro for Storybook
 * Since Lingui macros require compile-time transformation, we provide
 * runtime mocks that return the message ID for development.
 */

// Mock the `t` macro - handles both direct calls and tagged template literals
export const t = (i18nOrStrings: any, ...values: any[]): any => {
  // If first argument looks like i18n object, return a function for tagged template literal
  if (
    i18nOrStrings &&
    typeof i18nOrStrings === 'object' &&
    !i18nOrStrings.raw
  ) {
    return (
      strings: TemplateStringsArray,
      ...templateValues: any[]
    ): string => {
      if (strings?.raw) {
        return strings.raw.join('');
      }
      return 'missing-translation';
    };
  }

  // Direct call with strings
  if (typeof i18nOrStrings === 'string') {
    return i18nOrStrings;
  }

  if (i18nOrStrings?.raw) {
    return i18nOrStrings.raw.join('');
  }

  return 'missing-translation';
};

// Mock the `plural` macro
export const plural = (
  value: number,
  options: Record<string, string>
): string => {
  if (value === 0 && options.zero) return options.zero;
  if (value === 1 && options.one) return options.one;
  if (options.other) return options.other;
  return options.many || options.other || String(value);
};

// Mock the `select` macro
export const select = (
  value: string,
  options: Record<string, string>
): string => {
  return options[value] || options.other || value;
};

// Mock the `selectOrdinal` macro
export const selectOrdinal = (
  value: number,
  options: Record<string, string>
): string => {
  return options.other || String(value);
};

// Mock the `msg` macro
export const msg = (
  strings: TemplateStringsArray | any,
  ...values: any[]
): { id: string } => {
  const id =
    typeof strings === 'string'
      ? strings
      : strings?.raw?.join('') || 'missing-id';
  return { id };
};

// Mock defineMessage
export const defineMessage = (descriptor: {
  id?: string;
  message?: string;
  comment?: string;
}) => {
  return {
    id: descriptor.id || descriptor.message || 'missing-message',
    message: descriptor.message || descriptor.id || 'missing-message',
    comment: descriptor.comment,
  };
};

// Mock Trans component - a simple React component that renders children
export const Trans = ({ children, id, message, ...props }: any) => {
  // For development, just return the children or the message/id
  if (children) return children;
  if (message) return message;
  if (id) return id;
  return 'Trans component';
};

// Default export for convenience
export default { t, plural, select, selectOrdinal, msg, defineMessage, Trans };
