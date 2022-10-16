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
  font-family: ${({ theme }) => theme.card.fontFamily};
  font-size: ${({ theme }) => theme.card.fontSize};
  font-weight: ${({ theme }) => theme.card.fontWeight};

  background-color: ${({ theme }) => theme.card.backgroundColor};

  ${({ shadow, theme }) =>
    shadow
      ? `
        box-shadow: 0 4px 8px 0 ${theme.card.borderColorShadow}0f;
        border-radius: ${theme.card.borderRadiusShadow};
  `
      : `
        border: 1px solid ${theme.card.borderColor};
        border-radius: ${theme.card.borderRadius};
  `};
`;

const Actions = styled(Flex)`
  padding: 0 24px;
  border-top: 1px solid ${({ theme }) => theme.card.borderColor};
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
