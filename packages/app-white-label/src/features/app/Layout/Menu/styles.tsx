import { Flex } from '@monite/ui-widgets-react';
import styled from '@emotion/styled';

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
