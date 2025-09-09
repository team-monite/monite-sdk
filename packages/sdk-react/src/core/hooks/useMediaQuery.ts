/* eslint-disable lingui/no-unlocalized-strings */
import { useEffect, useState } from 'react';

// shadcn/ui standard breakpoints (Tailwind CSS defaults)
const breakpoints = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536,
} as const;

type Breakpoint = keyof typeof breakpoints;

/**
 * Hook for responsive design using shadcn/ui standard breakpoints
 *
 * @param query - Media query string or breakpoint key
 * @returns boolean indicating if the media query matches
 *
 * @example
 * ```tsx
 * // Using breakpoint keys
 * const isMobile = useMediaQuery('sm'); // true when width < 640px
 * const isTablet = useMediaQuery('md'); // true when width >= 768px
 * const isDesktop = useMediaQuery('lg'); // true when width >= 1024px
 *
 * // Using custom media queries
 * const isLandscape = useMediaQuery('(orientation: landscape)');
 * const isHighDpi = useMediaQuery('(min-resolution: 2dppx)');
 *
 * // Using min/max width queries
 * const isMediumUp = useMediaQuery('(min-width: 768px)');
 * const isLargeDown = useMediaQuery('(max-width: 1023px)');
 * ```
 */
export function useMediaQuery(query: Breakpoint | string): boolean {
  const [matches, setMatches] = useState<boolean>(false);

  useEffect(() => {
    // Handle breakpoint keys
    let mediaQuery: string;

    if (query in breakpoints) {
      // For breakpoint keys, we want to match when screen is at least that size
      const breakpoint = breakpoints[query as Breakpoint];
      mediaQuery = `(min-width: ${breakpoint}px)`;
    } else {
      // For custom queries, use as-is
      mediaQuery = query;
    }

    const mediaQueryList = window.matchMedia(mediaQuery);

    // Set initial value
    setMatches(mediaQueryList.matches);

    // Create event listener
    const handleChange = (event: MediaQueryListEvent) => {
      setMatches(event.matches);
    };

    // Add event listener
    mediaQueryList.addEventListener('change', handleChange);

    // Cleanup
    return () => {
      mediaQueryList.removeEventListener('change', handleChange);
    };
  }, [query]);

  return matches;
}

/**
 * Convenience hooks for common breakpoints
 */
export const useIsMobileScreen = () => useIsSmallerThan('md'); // < 768px
export const useIsTabletScreen = () => {
  const isMd = useMediaQuery('md');
  const isLg = useMediaQuery('lg');
  return isMd && !isLg; // >= 768px and < 1024px
};
export const useIsDesktopScreen = () => useMediaQuery('lg'); // >= 1024px
export const useIsLargeDesktopScreen = () => useMediaQuery('xl'); // >= 1280px
export const useIsExtraLargeDesktopScreen = () => useMediaQuery('2xl'); // >= 1536px

/**
 * Hook for checking if screen is smaller than a breakpoint
 *
 * @param breakpoint - The breakpoint to check against
 * @returns boolean indicating if screen is smaller than the breakpoint
 *
 * @example
 * ```tsx
 * const isSmallerThanLg = useIsSmallerThan('lg'); // true when width < 1024px
 * ```
 */
export function useIsSmallerThan(breakpoint: Breakpoint): boolean {
  const [matches, setMatches] = useState<boolean>(false);

  useEffect(() => {
    const mediaQuery = `(max-width: ${breakpoints[breakpoint] - 1}px)`;
    const mediaQueryList = window.matchMedia(mediaQuery);

    setMatches(mediaQueryList.matches);

    const handleChange = (event: MediaQueryListEvent) => {
      setMatches(event.matches);
    };

    mediaQueryList.addEventListener('change', handleChange);
    return () => {
      mediaQueryList.removeEventListener('change', handleChange);
    };
  }, [breakpoint]);

  return matches;
}

/**
 * Hook for checking if screen is larger than a breakpoint
 *
 * @param breakpoint - The breakpoint to check against
 * @returns boolean indicating if screen is larger than the breakpoint
 *
 * @example
 * ```tsx
 * const isLargerThanMd = useIsLargerThan('md'); // true when width > 768px
 * ```
 */
export function useIsLargerThan(breakpoint: Breakpoint): boolean {
  const [matches, setMatches] = useState<boolean>(false);

  useEffect(() => {
    const mediaQuery = `(min-width: ${breakpoints[breakpoint] + 1}px)`;
    const mediaQueryList = window.matchMedia(mediaQuery);

    setMatches(mediaQueryList.matches);

    const handleChange = (event: MediaQueryListEvent) => {
      setMatches(event.matches);
    };

    mediaQueryList.addEventListener('change', handleChange);
    return () => {
      mediaQueryList.removeEventListener('change', handleChange);
    };
  }, [breakpoint]);

  return matches;
}

// Export breakpoints for external use
export { breakpoints };
