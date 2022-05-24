import { renderHook } from '@testing-library/react';

import { RootElementsProvider, useRootElements } from './RootElementsProvider';

describe('RootElementsProvider', () => {
  const mockRootElements = {
    styles: document.createElement('div'),
    root: document.createElement('div'),
  };

  it('has default `styles` as `undefined`', async () => {
    const { result } = renderHook(() => useRootElements(), {
      wrapper: ({ children }) => (
        <RootElementsProvider>{children}</RootElementsProvider>
      ),
    });

    expect(result.current.styles).toEqual(undefined);
  });

  it('has default `root` as `undefined`', async () => {
    const { result } = renderHook(() => useRootElements(), {
      wrapper: ({ children }) => (
        <RootElementsProvider>{children}</RootElementsProvider>
      ),
    });

    expect(result.current.root).toEqual(undefined);
  });

  it('uses `elements` property if specified', async () => {
    const { result } = renderHook(() => useRootElements(), {
      wrapper: ({ children }) => (
        <RootElementsProvider elements={mockRootElements}>
          {children}
        </RootElementsProvider>
      ),
    });

    expect(result.current).toEqual(mockRootElements);
  });

  it('could be overridden by parent context if no value specified', async () => {
    const { result } = renderHook(() => useRootElements(), {
      wrapper: ({ children }) => (
        <RootElementsProvider elements={mockRootElements}>
          <RootElementsProvider>{children}</RootElementsProvider>
        </RootElementsProvider>
      ),
    });

    expect(result.current).toEqual(mockRootElements);
  });

  it('could not be overridden by parent context if `element` property specified', async () => {
    const { result } = renderHook(() => useRootElements(), {
      wrapper: ({ children }) => (
        <RootElementsProvider elements={mockRootElements}>
          <RootElementsProvider
            elements={{ root: document.body, styles: document.head }}
          >
            {children}
          </RootElementsProvider>
        </RootElementsProvider>
      ),
    });

    expect(result.current).toEqual({
      root: document.body,
      styles: document.head,
    });
  });
});
