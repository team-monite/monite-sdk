// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import type { ReactNode } from 'react';

import { DataGridProps } from '@mui/x-data-grid';
import '@testing-library/jest-dom';
import '@testing-library/jest-dom/extend-expect';

import 'jest-fetch-mock';

import { server } from './mocks/server';

jest.retryTimes(3);

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
    DataGrid: (props: DataGridProps) => (
      <DataGrid {...props} disableVirtualization />
    ),
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
