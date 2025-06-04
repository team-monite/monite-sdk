import { type ReactNode, forwardRef, createElement } from 'react';

import { Trans as ReactTrans } from '@lingui/react';
import type { DataGridProps } from '@mui/x-data-grid';
import * as Sentry from '@sentry/react';
import '@testing-library/jest-dom/vitest';
import { cleanup } from '@testing-library/react';

// Vitest imports grouped together
import { afterAll, afterEach, beforeAll, vi, expect } from 'vitest';

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
 * We have to disable virtualization for all data-tables
 *  and only for tests.
 * For production, we would like to have
 *  more performant tables
 *
 * @see {@link https://github.com/mui/mui-x/issues/1151#issuecomment-1108349639} Stackoverflow discussion
 * @see {@link https://mui.com/x/react-data-grid/virtualization/#disable-virtualization} MUI Documentation
 */
vi.mock('@mui/x-data-grid', async (importActual) => {
  const actual = await importActual<typeof import('@mui/x-data-grid')>();

  return {
    ...actual,
    DataGrid: forwardRef<HTMLDivElement, DataGridProps>((props, ref) => {
      // Assert that column filter is disabled: DataGrid filtering
      // isn't compatible with our datasources.
      expect(props.disableColumnFilter).toBe(true);

      return createElement(actual.DataGrid, {
        ...props,
        disableVirtualization: true,
        ref,
      });
    }),
  };
});

/**
 * We have to disable the CacheProvider for all tests
 * as its usage slows down the tests.
 */
vi.mock('@emotion/react', async (importActual) => {
  const actual = await importActual<typeof import('@emotion/react')>();

  return {
    ...actual,
    CacheProvider: ({ children }: { children: ReactNode }) => children,
  };
});

/**
 * Mock the `requestFn` to allow usage of `requestFn.mock.*` methods
 */
vi.mock('@openapi-qraft/react', async (importActual) => {
  const module = await importActual<typeof import('@openapi-qraft/react')>();
  return {
    ...module,
    requestFn: vi.fn(module.requestFn),
    __esModule: true,
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

    /**
     * Mock implementation of `requestFn` for testing purposes.
     *
     * Note: The '/me' and '/my_role' endpoints do not accept the 'x-monite-entity-id' header by type (just as the real API).
     * However, the internal implementation of handlers for MSW (Mock Service Worker) uses this header to determine permissions (full, low, empty).
     */
    const requestFnMocked: RequestFn = (
      schema,
      requestInfo,
      requestOptions
    ) => {
      const headers =
        options?.entityId && ['/me', '/my_role'].includes(schema.url)
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
    __esModule: true,
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

// Store original console.error for restoration
const originalConsoleError = console.error;

beforeAll(() => {
  Sentry.init({});
  server.listen({
    onUnhandledRequest: 'warn',
  });

  // Suppress 'An update to ... inside a test was not wrapped in act(...)' errors in the console
  console.error = (...args) => {
    if (typeof args[0] === 'string' && /act/.test(args[0])) return;
    originalConsoleError(...args);
  };
});

afterEach(() => {
  cleanup();
  server.resetHandlers();
});

afterAll(() => {
  server.close();

  // Restore console.error function
  console.error = originalConsoleError;
});
