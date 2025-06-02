import { Buffer } from 'buffer';

if (typeof window !== 'undefined' && typeof window.Buffer === 'undefined') {
  window.Buffer = Buffer;
  console.log('[Storybook buffer-polyfill.js] Manually set window.Buffer');
} 