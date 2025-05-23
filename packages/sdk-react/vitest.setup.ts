import '@testing-library/jest-dom/vitest';
import { cleanup } from '@testing-library/react';

import { afterEach, vi } from 'vitest';

vi.mock('@lingui/macro', () => ({
  t: (template: TemplateStringsArray | any, ...substitutions: any[]) => {
    if (typeof template === 'object' && template && !template.raw) {
      return (
        messageTemplate: TemplateStringsArray,
        ...messageSubstitutions: any[]
      ) => {
        if (messageTemplate && messageTemplate.raw) {
          let result = messageTemplate.raw[0];
          for (let i = 0; i < messageSubstitutions.length; i++) {
            result +=
              String(messageSubstitutions[i]) + messageTemplate.raw[i + 1];
          }
          return result;
        }
        return '';
      };
    }

    if (typeof template === 'string') {
      return template;
    }
    if (template && template.raw) {
      let result = template.raw[0];
      for (let i = 0; i < substitutions.length; i++) {
        result += String(substitutions[i]) + template.raw[i + 1];
      }
      return result;
    }
    return '';
  },
  Trans: ({ children }: { children: React.ReactNode }) => children,
  defineMessage: (obj: { message: string }) => obj.message,
  msg: (template: TemplateStringsArray | string, ...substitutions: any[]) => {
    if (typeof template === 'string') {
      return template;
    }
    if (template && template.raw) {
      let result = template.raw[0];
      for (let i = 0; i < substitutions.length; i++) {
        result += String(substitutions[i]) + template.raw[i + 1];
      }
      return result;
    }
    return '';
  },
}));

afterEach(() => {
  cleanup();
});
