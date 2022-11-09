import React from 'react';
import styled from '@emotion/styled';

import { Global, useTheme } from '@emotion/react';

const Wrapper = styled.div`
  background: '#F3F3F3';
  min-height: 100vh;
`;

type LayoutProps = {
  children: React.ReactNode;
};

const Layout = ({ children }: LayoutProps) => {
  const theme = useTheme();
  console.log('theme', theme);
  return (
    <Wrapper>
      <Global
        styles={() => ({
          body: {
            //TODO: remove
            //@ts-ignore
            backgroundColor: theme?.colors?.lightGrey3,
          },
        })}
      />
      {children}
    </Wrapper>
  );
};

export default Layout;
