import React, { ReactNode } from 'react';
import { Text, Flex } from '@team-monite/ui-kit-react';
import styled from '@emotion/styled';

type CounterpartDetailsBlockProps = {
  title?: string;
  children?: ReactNode;
  action?: ReactNode;
  sx?: any;
};

const Root = styled(Flex)`
  flex-direction: column;
  gap: 20px;
  position: relative;
`;

export const CounterpartDetailsBlock = ({
  title,
  children,
  action,
  sx,
}: CounterpartDetailsBlockProps) => {
  return (
    <Root sx={sx}>
      {title && <Text textSize={'h4'}>{title}</Text>}
      {children}
      {action}
    </Root>
  );
};
