import React, {
  forwardRef,
  ReactNode,
  useId,
  useLayoutEffect,
  useMemo,
  useState,
} from 'react';

import { ShadowRootCssBaseline } from '@/components/CssBaseline';
import createCache from '@emotion/cache';
import { CacheProvider } from '@emotion/react';
import type { PortalProps } from '@mui/base/Portal/Portal.types';
import { Portal } from '@mui/material';

export const ShadowDomPortal = forwardRef<
  Element,
  Omit<PortalProps, 'container'>
>(function CustomPortal(props, ref) {
  const shadowRootContainers = useShadowDomContainers();

  // eslint-disable-next-line @team-monite/mui-require-container-property
  if (props.disablePortal) return <Portal {...props} ref={ref} />;

  return (
    <>
      {shadowRootContainers?.root && (
        <PortalCacheProvider container={shadowRootContainers.styles}>
          <ShadowRootCssBaseline enableColorScheme />
          <Portal {...props} ref={ref} container={shadowRootContainers.root} />
        </PortalCacheProvider>
      )}
    </>
  );
});

const useShadowDomContainers = () => {
  const monitePortalNodeId = `monite-portal-${useId()}`;

  const [shadowRootElements, setShadowRootElements] = useState<{
    root: Element;
    styles: Element;
  } | null>(null);

  useLayoutEffect(() => {
    if (typeof document === 'undefined') return;

    const portalNode = document.createElement('div');
    portalNode.setAttribute('id', monitePortalNodeId);

    const shadowRoot = portalNode.attachShadow({
      mode: 'open',
      delegatesFocus: true,
    });

    const rootNode = document.createElement('div');
    rootNode.setAttribute('id', 'monite-app-root');
    shadowRoot.appendChild(rootNode);

    const stylesNode = document.createElement('div');
    stylesNode.setAttribute('id', 'monite-app-styles');
    shadowRoot.appendChild(stylesNode);

    document.body.appendChild(portalNode);

    setShadowRootElements({
      root: rootNode,
      styles: stylesNode,
    });

    return () => {
      document.body.removeChild(portalNode);
    };
  }, [monitePortalNodeId]);

  return shadowRootElements;
};

const PortalCacheProvider = ({
  children,
  container,
}: {
  children: ReactNode;
  container: Node;
}) => {
  return (
    <CacheProvider
      value={useMemo(
        () =>
          createCache({
            key: 'css-monite-portal',
            container,
          }),
        [container]
      )}
    >
      {children}
    </CacheProvider>
  );
};
