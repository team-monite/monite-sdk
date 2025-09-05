/* eslint-disable lingui/no-unlocalized-strings */
import { useState, useEffect } from 'react';

/**
 * A4 paper dimensions in different units
 */
const A4_DIMENSIONS = {
  mm: { width: 210, height: 297 },
  cm: { width: 21, height: 29.7 },
  inches: { width: 8.27, height: 11.69 },
};

/**
 * Custom hook to calculate A4 dimensions in pixels based on screen DPI
 * Handles different screen densities and provides adaptive sizing
 */
export const useA4Dimensions = () => {
  const [dimensions, setDimensions] = useState({
    width: 794,
    height: 1123,
    dpi: 96,
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const calculateDimensions = () => {
      // Method 1: Try to get actual DPI using matchMedia
      // This checks common DPI values
      const dpiValues = [72, 96, 120, 144, 192, 240, 288, 384];
      let detectedDpi = 96; // Default fallback

      for (const dpi of dpiValues) {
        if (window.matchMedia(`(resolution: ${dpi}dpi)`).matches) {
          detectedDpi = dpi;
          break;
        }
      }

      // Method 2: Alternative approach using devicePixelRatio
      // This is more reliable but gives us the CSS pixel ratio, not true DPI
      const pixelRatio = window.devicePixelRatio || 1;
      
      // For high-DPI displays (Retina, etc.), we need to account for pixel ratio
      // Standard displays: ratio = 1, Retina: ratio = 2, etc.
      const effectiveDpi = detectedDpi * pixelRatio;

      // Method 3: Use CSS inches to pixels conversion
      // Create a temporary element to measure 1 inch in pixels
      const testElement = document.createElement('div');
      testElement.style.width = '1in';
      testElement.style.height = '1in';
      testElement.style.position = 'absolute';
      testElement.style.left = '-9999px';
      document.body.appendChild(testElement);
      
      const rect = testElement.getBoundingClientRect();
      const measuredDpi = Math.round(rect.width);
      
      document.body.removeChild(testElement);

      const finalDpi = measuredDpi > 0 ? measuredDpi : effectiveDpi;
      const pixelWidth = Math.round(A4_DIMENSIONS.inches.width * finalDpi);
      const pixelHeight = Math.round(A4_DIMENSIONS.inches.height * finalDpi);

      setDimensions({
        width: pixelWidth,
        height: pixelHeight,
        dpi: finalDpi,
      });
    };

    calculateDimensions();

    // Recalculate on window resize (DPI might change on external monitors)
    window.addEventListener('resize', calculateDimensions);

    return () => {
      window.removeEventListener('resize', calculateDimensions);
    };
  }, []);

  return dimensions;
};