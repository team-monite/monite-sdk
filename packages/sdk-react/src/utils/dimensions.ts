/**
 * Utility functions for handling responsive dimensions
 * Provides CSS-based solutions for different screen densities
*/

/**
 * CSS media queries for different DPI ranges
 * These can be used with CSS-in-JS or Tailwind arbitrary values
*/

/* eslint-disable lingui/no-unlocalized-strings */
export const DPI_MEDIA_QUERIES = {
  low: '(resolution <= 120dpi)',
  standard: '(resolution > 120dpi) and (resolution <= 192dpi)', 
  high: '(resolution > 192dpi) and (resolution <= 288dpi)',
  ultraHigh: '(resolution > 288dpi)',
  
  devicePixelRatio1: '(-webkit-device-pixel-ratio: 1)',
  devicePixelRatio1_5: '(-webkit-device-pixel-ratio: 1.5)',
  devicePixelRatio2: '(-webkit-device-pixel-ratio: 2)',
  devicePixelRatio3: '(-webkit-device-pixel-ratio: 3)',
} as const;

/**
 * A4 dimensions in CSS units for different DPI scenarios
 * Using CSS physical units ensures consistent sizing across devices
 */
export const A4_CSS_DIMENSIONS = {
  css: {
    width: '21cm',
    height: '29.7cm',
    minWidth: '21cm',
    minHeight: '29.7cm',
  },
  
  responsive: {
    // Standard (96-120 DPI)
    standard: {
      width: '794px',
      height: '1123px',
      containerMinWidth: '890px', // 794px + 96px padding
      containerMinHeight: '1219px', // 1123px + 96px padding
    },
    
    // High DPI (144-192 DPI)
    highDpi: {
      width: '1191px',
      height: '1684px',
      containerMinWidth: '1335px', // (794 * 1.5) + (96 * 1.5)
      containerMinHeight: '1828px', // (1123 * 1.5) + (96 * 1.5)
    },
    
    // Retina (192+ DPI)
    retina: {
      width: '1588px',
      height: '2246px',
      containerMinWidth: '1780px', // (794 * 2) + (96 * 2)
      containerMinHeight: '2438px', // (1123 * 2) + (96 * 2)
    },
  },
} as const;

/**
 * Generates CSS classes for A4 dimensions with DPI-aware responsive behavior
 * For use with CSS-in-JS solutions
 */
export const generateResponsiveA4CSS = () => {
  return `
    /* Base A4 dimensions using CSS physical units */
    width: ${A4_CSS_DIMENSIONS.css.width};
    min-width: ${A4_CSS_DIMENSIONS.css.minWidth};
    min-height: ${A4_CSS_DIMENSIONS.css.minHeight};
    
    /* Fallback for browsers that don't support CSS physical units well */
    @media ${DPI_MEDIA_QUERIES.low} {
      width: ${A4_CSS_DIMENSIONS.responsive.standard.width};
      min-height: ${A4_CSS_DIMENSIONS.responsive.standard.height};
    }
    
    @media ${DPI_MEDIA_QUERIES.high} {
      width: ${A4_CSS_DIMENSIONS.responsive.highDpi.width};
      min-height: ${A4_CSS_DIMENSIONS.responsive.highDpi.height};
    }
    
    @media ${DPI_MEDIA_QUERIES.ultraHigh} {
      width: ${A4_CSS_DIMENSIONS.responsive.retina.width};
      min-height: ${A4_CSS_DIMENSIONS.responsive.retina.height};
    }
  `;
};

/**
 * Tailwind CSS classes for A4 dimensions
 * Uses arbitrary values with CSS physical units
 */
export const TAILWIND_A4_CLASSES = {
  preview: [
    'mtw:w-[21cm]',       // A4 width
    'mtw:min-w-[21cm]',   // Minimum A4 width
    'mtw:min-h-[29.7cm]', // Minimum A4 height
  ].join(' '),
  
  container: [
    'mtw:min-w-[890px]',  // Base container width (794px + 96px padding)
    'mtw:min-h-[1219px]', // Base container height (1123px + 96px padding)
    
    'mtw:[@media(resolution>192dpi)]:min-w-[1335px]',
    'mtw:[@media(resolution>192dpi)]:min-h-[1828px]',
    'mtw:[@media(resolution>288dpi)]:min-w-[1780px]',
    'mtw:[@media(resolution>288dpi)]:min-h-[2438px]',
  ].join(' '),
} as const;
