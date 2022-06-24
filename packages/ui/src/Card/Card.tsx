import React, { ReactNode } from 'react';
import { Box, Flex } from '../Box';
import styled from '@emotion/styled';

type CardProps = {
  content: ReactNode;
  actions?: ReactNode;
};

const CardRoot = styled(Box)`
  border: 1px solid #dddddd;
  border-radius: 17px;
`;

const Content = styled(Box)`
  padding: 27px 23px 32px;
`;

const Actions = styled(Flex)`
  padding: 0 23px;
  border-top: 1px solid #dddddd;
  height: 64px;
  align-items: center;
  gap: 25px;
`;

const Card = ({ content, actions }: CardProps) => {
  return (
    <CardRoot>
      <Content>{content}</Content>
      {actions && <Actions>{actions}</Actions>}
    </CardRoot>
  );
};

export default Card;
