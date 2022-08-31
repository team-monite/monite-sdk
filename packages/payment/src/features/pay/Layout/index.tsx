import React from 'react';
import styled from '@emotion/styled';

import { useTheme } from 'emotion-theming';
import { Global } from '@emotion/react';

import type { Theme } from '@monite/ui-widgets-react';

const Wrapper = styled.div(
  ({ theme }) => `
  background: ${theme.colors.lightGrey3};
  min-height: 100vh;
`
);

type LayoutProps = {
  children: React.ReactNode;
};

const Layout = ({ children }: LayoutProps) => {
  const theme = useTheme<Theme>();

  return (
    <Wrapper>
      <Global
        styles={() => ({
          body: {
            backgroundColor: theme.colors.lightGrey3,
          },
        })}
      />
      {children}
    </Wrapper>
  );
};

export default Layout;
