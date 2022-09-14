import React from 'react';
import styled from '@emotion/styled';

import { Global, useTheme } from '@emotion/react';

const Wrapper = styled.div`
  background: ${({ theme }) => theme.colors.lightGrey3};
  min-height: 100vh;
`;

type LayoutProps = {
  children: React.ReactNode;
};

const Layout = ({ children }: LayoutProps) => {
  const theme = useTheme();

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
