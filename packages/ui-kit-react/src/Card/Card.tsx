import React, { ReactNode } from 'react';

import styled from '@emotion/styled';
import { Box, BoxProps, Flex } from '../Box';

type CardProps = {
  children: React.ReactNode;
  className?: string;
  ref?: React.Ref<HTMLDivElement>;
  shadow?: boolean;
  actions?: ReactNode;
} & BoxProps;

const CardRoot = styled(Box)<CardProps>`
  ${({ shadow }) =>
    shadow
      ? `
        box-shadow: 0 4px 8px 0 #1111110f;
        background: white;
        border-radius: 8px;
  `
      : `
        border: 1px solid #dddddd;
        border-radius: 17px;
  `};
`;

const Actions = styled(Flex)`
  padding: 0 24px;
  border-top: 1px solid #dddddd;
  height: 64px;
  align-items: center;
  gap: 24px;
`;

const Card: React.FC<CardProps> = ({
  children,
  actions,
  ...props
}: CardProps) => {
  return (
    <CardRoot {...props}>
      {children}
      {actions && <Actions>{actions}</Actions>}
    </CardRoot>
  );
};

export default Card;
