import { Link } from 'react-router-dom';
import { Flex, Text } from '@monite/react-kit';
import styled from '@emotion/styled';

export const MenuLink = styled(Link)`
  display: flex;
  align-items: center;

  padding: 8px 12px 8px 12px;
  border-radius: 4px;

  &:hover {
    background: ${({ theme }) => theme.colors.lightGrey2};
  }
`;

export const LinkText = styled(Text)``;

export const LinkIcon = styled.i`
  line-height: 0px;
`;

export const Menu = styled(Flex)`
  flex-direction: column;
  margin-top: 24px;

  > * + * {
    margin-top: 8px;
  }

  a {
    color: ${({ theme }) => theme.colors.black};
    text-decoration: none;
  }
`;
