import React, { ReactNode } from 'react';
import { Box, Flex } from '@monite/ui';
import styled from '@emotion/styled';

type DetailsCardProps = {
  children: ReactNode;
  actions?: ReactNode;
};

const Card = styled(Box)`
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

const DetailsCard = ({ children, actions }: DetailsCardProps) => {
  return (
    <Card>
      <Content>{children}</Content>
      {actions && <Actions>{actions}</Actions>}
    </Card>
  );
};

export default DetailsCard;
