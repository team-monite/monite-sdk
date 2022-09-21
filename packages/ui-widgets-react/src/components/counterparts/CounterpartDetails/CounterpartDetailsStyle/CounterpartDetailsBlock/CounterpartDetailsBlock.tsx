import React, { ReactNode } from 'react';
import { Card, Text } from '@monite/ui-kit-react';
import styled from '@emotion/styled';

type CounterpartDetailsBlockProps = {
  title: string;
  children: ReactNode;
};

const Root = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  margin-top: 24px;
`;

const Block = styled(Card)`
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 24px;
`;

const CounterpartDetailsBlock = ({
  title,
  children,
}: CounterpartDetailsBlockProps) => {
  return (
    <Root>
      <Text textSize={'h4'}>{title}</Text>
      <Block>{children}</Block>
    </Root>
  );
};

export default CounterpartDetailsBlock;
