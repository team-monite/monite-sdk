import { ReactNode, useState } from 'react';

import { useRootElements } from '@/core/context/RootElementsProvider';
import createCache from '@emotion/cache';
import { CacheProvider } from '@emotion/react';

/**
 * Creates an Emotion cache which is mounted to the `root` element
 * of the Drop In Component if it exists, or to the `document.head` otherwise.
 */
export const EmotionCacheProvider = ({
  cacheKey,
  children,
}: {
  cacheKey: string;
  children: ReactNode;
}) => {
  const rootElements = useRootElements();
  const [emotionCache] = useState(() =>
    createCache({
      key: cacheKey,
      container: rootElements.styles,
    })
  );

  return <CacheProvider value={emotionCache}>{children}</CacheProvider>;
};
