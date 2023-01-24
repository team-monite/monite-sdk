import React from 'react';
import styled from '@emotion/styled';

import { Global, useTheme } from '@emotion/react';

import Footer from './Footer';

const Wrapper = styled.div`
  background: ${({ theme }) => theme.neutral90};
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
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
            backgroundColor: theme?.colors?.lightGrey3,
          },
        })}
      />
      {children}
      <Footer />
    </Wrapper>
  );
};

export default Layout;
