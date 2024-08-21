// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import { ReactNode } from 'react';

import type { createAPIClient } from '@/api/client';
import type { DataGridProps } from '@mui/x-data-grid';
import { mergeHeaders, requestFn } from '@openapi-qraft/react';
import '@testing-library/jest-dom';
import '@testing-library/jest-dom/extend-expect';

import 'jest-fetch-mock';

import { server } from './mocks/server';

jest.retryTimes(process.env.CI ? 3 : 0);

/**
 * We have to disable virtualization for all data-tables
 *  and only for tests.
 * For production, we would like to have
 *  more performant tables
 *
 * @see {@link https://github.com/mui/mui-x/issues/1151#issuecomment-1108349639} Stackoverflow discussion
 * @see {@link https://mui.com/x/react-data-grid/virtualization/#disable-virtualization} MUI Documentation
 */
jest.mock('@mui/x-data-grid', () => {
  const { DataGrid } = jest.requireActual('@mui/x-data-grid');

  return {
    ...jest.requireActual('@mui/x-data-grid'),
    DataGrid: (props: DataGridProps) => {
      // Assert that column filter is disabled: DataGrid filtering
      // isn't compatible with our datasources.
      expect(props.disableColumnFilter).toBe(true);
      return <DataGrid {...props} disableVirtualization />;
    },
  };
});

/**
 * We have to disable the CacheProvider for all tests
 * as its usage slows down the tests.
 */
jest.mock('@emotion/react', () => {
  const originalModule = jest.requireActual('@emotion/react');

  return {
    ...originalModule,
    CacheProvider: ({ children }: { children: ReactNode }) => <>{children}</>,
  };
});

/**
 * Mock the `requestFn` to allow usage of `requestFn.mock.*` methods
 */
jest.mock('@openapi-qraft/react', () => {
  const module = jest.requireActual('@openapi-qraft/react');
  return {
    ...module,
    requestFn: jest.fn(module.requestFn),
    __esModule: true,
  };
});

jest.mock('@/api/client', () => {
  const originalModule = jest.requireActual('@/api/client');

  const createAPIClientMocked: typeof createAPIClient = (options) => {
    const apiClient = originalModule.createAPIClient(options);

    /**
     * Mock implementation of `requestFn` for testing purposes.
     *
     * Note: The '/me' and '/my_role' endpoints do not accept the 'x-monite-entity-id' header by type (just as the real API).
     * However, the internal implementation of handlers for MSW (Mock Service Worker) uses this header to determine permissions (full, low, empty).
     */
    const requestFnMocked: typeof requestFn = (
      schema,
      requestInfo,
      requestOptions
    ) => {
      return apiClient.requestFn(
        schema,
        {
          ...requestInfo,
          headers:
            options?.entityId && ['/me', '/my_role'].includes(schema.url)
              ? mergeHeaders(requestInfo.headers, {
                  'x-monite-entity-id': options?.entityId,
                })
              : requestInfo.headers,
        },
        requestOptions
      );
    };

    return {
      ...apiClient,
      requestFn: requestFnMocked,
    };
  };

  //Mock the default export and named export 'foo'
  return {
    __esModule: true,
    ...originalModule,
    createAPIClient: createAPIClientMocked,
  };
});

beforeAll(() => {
  // Enable the mocking in tests.
  server.listen();
});

afterEach(() => {
  // Reset any runtime handlers tests may use.
  server.resetHandlers();
});

afterAll(() => {
  // Clean up once the tests are done.
  server.close();
});

Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(), // Deprecated
    removeListener: jest.fn(), // Deprecated
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});
