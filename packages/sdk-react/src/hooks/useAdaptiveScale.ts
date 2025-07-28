import { useState, useRef, useEffect, RefObject, useCallback } from 'react';
import { useResizeObserver } from './useResizeObserver';
import { useWindowResize } from './useWindowResize';
import { useIsMounted } from '@/core/hooks';
import { useA4Dimensions } from './useA4Dimensions';

interface UseAdaptiveScaleOptions {
  minWidth?: number;
  minHeight?: number;
  containerPadding?: number;
  minScale?: number;
  initialDelay?: number;
  useAdaptiveDimensions?: boolean;
}

/**
 * Custom hook for adaptive scaling of preview components
 * Combines ResizeObserver and window resize handling
 * NextJS-safe with proper SSR handling
 */
export const useAdaptiveScale = (
  containerRef: RefObject<HTMLElement>,
  previewRef: RefObject<HTMLElement>,
  options: UseAdaptiveScaleOptions = {}
) => {
  const {
    minWidth: overrideWidth,
    minHeight: overrideHeight,
    containerPadding = 96,
    minScale = 1,
    initialDelay = 100,
    useAdaptiveDimensions = true,
  } = options;

  const [scale, setScale] = useState(1);
  const initialCalculationDone = useRef(false);
  const isMountedRef = useIsMounted();
  const a4Dimensions = useA4Dimensions();

  const minWidth = overrideWidth ?? (useAdaptiveDimensions ? a4Dimensions.width : 794);
  const minHeight = overrideHeight ?? (useAdaptiveDimensions ? a4Dimensions.height : 1123);

  const calculateScale = useCallback(() => {
    if (
      !containerRef.current || 
      !previewRef.current || 
      typeof window === 'undefined' ||
      !isMountedRef.current
    ) {
      return;
    }

    const container = containerRef.current;

    const containerWidth = container.clientWidth - containerPadding;
    const containerHeight = container.clientHeight - containerPadding;

    if (containerWidth <= 0 || containerHeight <= 0 || minWidth <= 0 || minHeight <= 0) {
      setScale(minScale);

      return;
    }

    const scaleX = containerWidth / minWidth;
    const scaleY = containerHeight / minHeight;

    // Scale logic:
    // - Minimum scale is defined by minScale (default 100%)
    // - Can grow larger if container allows
    // - If container is smaller, use scrollbars instead of scaling down
    const newScale = Math.max(Math.min(scaleX, scaleY), minScale);

    setScale(newScale);
  }, [containerRef, previewRef, isMountedRef, containerPadding, minWidth, minHeight, minScale]);

  useWindowResize(calculateScale, 100);

  const { observe, disconnect } = useResizeObserver(calculateScale, 50);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const timeoutId = setTimeout(() => {
      calculateScale();
      initialCalculationDone.current = true;
    }, initialDelay);

    if (containerRef.current) {
      observe(containerRef.current);
    }

    return () => {
      clearTimeout(timeoutId);
      disconnect();
    };
  }, [observe, disconnect, initialDelay, calculateScale, containerRef]);

  // Re-observe if container ref changes
  useEffect(() => {
    if (containerRef.current && initialCalculationDone.current) {
      observe(containerRef.current);
    }
  }, [containerRef, observe]);

  return scale;
};