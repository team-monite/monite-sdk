import { type ReactNode, forwardRef, createElement } from 'react';

import { Trans as ReactTrans } from '@lingui/react';
import type { DataGridProps } from '@mui/x-data-grid';
import '@testing-library/jest-dom/vitest';
import { cleanup } from '@testing-library/react';
import * as Sentry from '@sentry/react';

import { afterAll, afterEach, beforeAll, vi } from 'vitest';

import { server } from './src/mocks/server';

/**
 * Mock for Lingui's macro functions
 * Simplifies internationalization for testing by returning the template strings directly
 */
vi.mock('@lingui/macro', async (importOriginal) => {
  const originalMacroModule = await importOriginal<
    typeof import('@lingui/macro')
  >();

  const processTemplate = (
    template: TemplateStringsArray | string,
    substitutions: unknown[]
  ): string => {
    if (typeof template === 'string') {
      return template;
    }

    if (template?.raw) {
      let result = template.raw[0];
      for (let i = 0; i < substitutions.length; i++) {
        result += String(substitutions[i]) + (template.raw[i + 1] || '');
      }
      return result;
    }

    return '';
  };

  return {
    ...originalMacroModule,
    Trans: ReactTrans,
    t: (
      template: TemplateStringsArray | string | Record<string, unknown>,
      ...substitutions: unknown[]
    ) => {
      if (typeof template === 'object' && template && !('raw' in template)) {
        return (
          messageTemplate: TemplateStringsArray,
          ...messageSubstitutions: unknown[]
        ) => processTemplate(messageTemplate, messageSubstitutions);
      }

      return processTemplate(
        template as TemplateStringsArray | string,
        substitutions
      );
    },
    defineMessage: (obj: { message: string }) => obj.message,
    msg: processTemplate,
  };
});

/**
 * Mock for MUI DataGrid to disable virtualization in tests
 * This prevents issues with virtual scrolling in testing environments
 */
vi.mock('@mui/x-data-grid', async (importActual) => {
  const actual = await importActual<typeof import('@mui/x-data-grid')>();

  return {
    ...actual,
    DataGrid: forwardRef<HTMLDivElement, DataGridProps>((props, ref) => {
      return createElement(actual.DataGrid, {
        ...props,
        disableVirtualization: true,
        ref,
      });
    }),
  };
});

/**
 * Mock for Emotion's CacheProvider to simplify CSS-in-JS handling in tests
 */
vi.mock('@emotion/react', async (importActual) => {
  const actual = await importActual<typeof import('@emotion/react')>();

  return {
    ...actual,
    CacheProvider: ({ children }: { children: ReactNode }) => children,
  };
});

/**
 * Mock for API client to handle entity ID headers in tests
 */
vi.mock('./src/api/client', async (importActual) => {
  const actual = await importActual<typeof import('./src/api/client')>();
  const { mergeHeaders } = await vi.importActual<
    typeof import('@openapi-qraft/react')
  >('@openapi-qraft/react');

  type CreateAPIClientOptions = Parameters<typeof actual.createAPIClient>[0];
  type RequestFn = ReturnType<typeof actual.createAPIClient>['requestFn'];

  const createAPIClientMocked = (options: CreateAPIClientOptions = {}) => {
    const apiClient = actual.createAPIClient(options);

    const requestFnMocked: RequestFn = (
      schema,
      requestInfo,
      requestOptions
    ) => {
      const shouldAddEntityId =
        options?.entityId && actual.isMoniteEntityIdPath(schema.url);

      const headers = shouldAddEntityId
        ? mergeHeaders(requestInfo.headers, {
            'x-monite-entity-id': options.entityId,
          })
        : requestInfo.headers;

      return apiClient.requestFn(
        schema,
        { ...requestInfo, headers },
        requestOptions
      );
    };

    return {
      ...apiClient,
      requestFn: requestFnMocked,
    };
  };

  return {
    ...actual,
    createAPIClient: createAPIClientMocked,
  };
});

/**
 * Global DOM API mocks
 */
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation((query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

// Mock IntersectionObserver for components with infinite scrolling or lazy loading
global.IntersectionObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
  root: null,
  rootMargin: '',
  thresholds: [],
}));

beforeAll(() => {
  Sentry.init({});
  server.listen({
    onUnhandledRequest: 'warn',
  });
});

afterEach(() => {
  cleanup();
  server.resetHandlers();
});

afterAll(() => {
  server.close();
});
