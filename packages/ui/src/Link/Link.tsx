import React, {
  BaseSyntheticEvent,
  FC,
  forwardRef,
  ReactNode,
  Ref,
} from 'react';
import styled from '@emotion/styled';

import { Box, BoxProps } from '../Box';
import { Themes } from '../Button';

import type { ThemedStyledProps } from '../types';

type StyledLinkProps = {
  $hasLeftIcon: boolean;
  $size?: string;
  $color?: string;
};

type LinkSize = 'md';

const Size: Record<LinkSize, string> = {
  md: `
    font-size: 14px;
    font-weight: 500;
    line-height: 20px;
  `,
};

const getSize = ({ size = 'md' }: LinkProps & StyledLinkProps) => Size[size];

const getColor = ({
  $color = 'link',
  theme,
}: ThemedStyledProps<StyledLinkProps>) => {
  if (!$color) {
    return '';
  }

  if (Themes[$color]) {
    return Themes[$color];
  }

  if (theme.colors[$color]) {
    return `color: ${theme.colors[$color]};`;
  }
};

const LeftIcon = styled.span`
  margin-right: 9px;
  display: flex;
`;

const StyledLink = styled(Box)<LinkProps & StyledLinkProps>`
  border-radius: 6px;
  text-align: center;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  position: relative;
  white-space: nowrap;
  cursor: pointer;
  background: transparent;
  border: none transparent;

  width: max-content;
  text-decoration: none;

  ${getSize}
  ${getColor}

  ${({ disabled }) =>
    disabled &&
    `
    opacity: 0.5;
    pointer-events: none;
    cursor: default;
    `}

  ${({ $hasLeftIcon }) =>
    $hasLeftIcon &&
    `
  * {
    vertical-align: top;
  }
  `}
`;

export interface LinkProps extends BoxProps {
  children: ReactNode;
  href: string;
  leftIcon?: ReactNode;
  ref?: Ref<any>;
  size?: LinkSize;
  className?: string;
  color?: string;
  onClick?: (e: BaseSyntheticEvent) => void;
}

const Link: FC<LinkProps> = forwardRef<any, LinkProps>(
  (
    {
      disabled,
      children,
      leftIcon,
      onClick,
      color,
      className,
      ...props
    }: LinkProps,
    ref
  ) => {
    return (
      <StyledLink
        {...props}
        disabled={disabled}
        onClick={onClick}
        $hasLeftIcon={!!leftIcon}
        $color={color}
        ref={ref}
        as={'a'}
      >
        {leftIcon && <LeftIcon>{leftIcon}</LeftIcon>}
        {children}
      </StyledLink>
    );
  }
);

export default Link;
