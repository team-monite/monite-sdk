import styled from '@emotion/styled';
import React from 'react';

import { Box, BoxProps } from '../Box';
import { TextProps } from '../Text';
import { ThemeColors } from '../consts';
import { ThemedStyledProps } from '../types';

type AvatarProps = {
  src?: string;
  children?: string;
  to?: string;
  disabled?: boolean;
  color?: ThemeColors;
  size?: number;
  textSize?: TextProps['textSize'];
  onClick?: () => void;
  withStatus?: boolean;
} & BoxProps;

type StyledProps = {
  $size?: number;
  $hasHover?: boolean;
  $color: ThemeColors;
  $disabled?: boolean;
  $withStatus?: boolean;
};

const defaultSize = 32;

const getStatus = ({ $withStatus, theme }: ThemedStyledProps<StyledProps>) => {
  if (!$withStatus) return '';

  return `
      &:after {
        content: '';
        position: absolute;
        width: 15px;
        height: 15px;
        right: -3px;
        top: -3px;
        border-radius: 50%;
        background-color: ${theme.colors.primary};
        border: 3px solid ${theme.colors.white};
      }
    `;
};

const Icon = styled(Box)<StyledProps>`
  position: relative;
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center center;
  background-color: ${({ theme, $color }) => theme.colors[$color]};
  display: inline-flex;
  justify-content: center;
  align-items: center;
  width: ${({ $size }) => $size || defaultSize}px;
  height: ${({ $size }) => $size || defaultSize}px;
  flex-shrink: 0;
  font-style: normal;
  font-weight: 500;
  font-size: 16px;
  border-radius: 50%;
  color: white;
  text-transform: uppercase;
  cursor: default;

  ${getStatus}

  ${({ $disabled }) => ($disabled ? 'opacity: 50%;' : '')}
`;

const Avatar = ({
  src,
  children,
  disabled,
  size,
  textSize, // TODO unused prop
  onClick,
  color = 'grey',
  withStatus,
  ...rest
}: AvatarProps) => {
  if (!children && !src) {
    return null;
  }

  const avatarSrc = src
    ? {
        backgroundImage: `url(${src})`,
      }
    : undefined;

  return (
    <Icon
      $size={size}
      $color={color}
      $hasHover={!!onClick}
      $disabled={disabled}
      $withStatus={withStatus}
      onClick={onClick}
      src={src}
      style={avatarSrc}
      {...rest}
    >
      {!src && !!children && (children[0] || '?')}
    </Icon>
  );
};

export default Avatar;
