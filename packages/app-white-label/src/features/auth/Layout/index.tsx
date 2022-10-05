import React from 'react';
import { Link } from 'react-router-dom';
import { Global } from '@emotion/react';
import { useTheme } from 'emotion-theming';
import { Theme } from '@team-monite/ui-widgets-react';

import logo from 'assets/logo/logo2x.png';
import * as Styled from './styles';

type AuthLayoutProps = {
  children: React.ReactNode;
};

const AuthLayout = ({ children }: AuthLayoutProps) => {
  const theme = useTheme<Theme>();

  return (
    <Styled.Wrapper>
      <Global
        styles={() => ({
          body: {
            backgroundColor: theme.colors.lightGrey3,
          },
        })}
      />
      <Styled.Logo>
        <Link to="/">
          <img src={logo} alt="monite" />
        </Link>
      </Styled.Logo>
      <Styled.Content>{children}</Styled.Content>
    </Styled.Wrapper>
  );
};

export default AuthLayout;
