import { Flex } from '@team-monite/ui-kit-react';
import styled from '@emotion/styled';

export const Menu = styled(Flex)`
  flex-direction: column;
  margin-top: 24px;

  > * + * {
    margin-top: 8px;
  }

  a {
    color: ${({ theme }) => theme.black};
    text-decoration: none;
  }
`;
