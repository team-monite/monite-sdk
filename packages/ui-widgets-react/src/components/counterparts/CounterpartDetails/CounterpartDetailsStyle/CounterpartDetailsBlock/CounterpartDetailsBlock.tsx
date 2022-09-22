import React, { ReactNode } from 'react';
import { Card, Text } from '@monite/ui-kit-react';
import styled from '@emotion/styled';

type CounterpartDetailsBlockProps = {
  title: string;
  children: ReactNode;
};

export const CounterpartBlockRoot = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  margin-top: 24px;
`;

export const CounterpartBlock = styled(Card)`
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 24px;
`;

export const CounterpartDetailsBlock = ({
  title,
  children,
}: CounterpartDetailsBlockProps) => {
  return (
    <CounterpartBlockRoot>
      <Text textSize={'h4'}>{title}</Text>
      <CounterpartBlock>{children}</CounterpartBlock>
    </CounterpartBlockRoot>
  );
};
