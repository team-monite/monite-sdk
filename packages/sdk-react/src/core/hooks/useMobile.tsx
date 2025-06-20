import { useState, useEffect } from 'react';

import { isBrowser, hasMatchMedia } from '@/core/utils';

const MOBILE_BREAKPOINT = 768;

export function useIsMobile() {
  const [isMobile, setIsMobile] = useState<boolean | undefined>(undefined);

  useEffect(() => {
    if (!hasMatchMedia) {
      setIsMobile(false);
      return;
    }

    // eslint-disable-next-line lingui/no-unlocalized-strings
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`);
    const onChange = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    };

    mql.addEventListener('change', onChange);
    setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);

    return () => mql.removeEventListener('change', onChange);
  }, []);

  return isBrowser ? !!isMobile : false;
}
