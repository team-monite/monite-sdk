import styled from 'styled-components';
import React from 'react';

import { Box, BoxProps } from '../Box';

type StyledProps = {
  $size?: number;
  hasHover?: boolean;
};

const Wrapper = styled(Box)<StyledProps>`
  text-decoration: none;
  display: flex;
  align-items: center;
  flex-wrap: nowrap;
  height: ${({ $size }) => $size || 32}px;

  ${({ hasHover, theme }) =>
    hasHover
      ? `
    border: none;
    outline: none;
    background: none;
    cursor: pointer;

    span:hover {
      color: ${theme.colors.blue};
    }
  `
      : ''}
`;

const Icon = styled.i<AvatarProps & StyledProps>`
  position: relative;
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center center;
  background-color: ${({ theme }) => theme.colors.grey};
  display: inline-flex;
  justify-content: center;
  align-items: center;
  width: ${({ $size }) => $size || 32}px;
  height: ${({ $size }) => $size || 32}px;
  flex-shrink: 0;
  font-style: normal;
  font-weight: 500;
  font-size: 16px;
  border-radius: 100%;
  color: white;
  text-transform: uppercase;

  span {
    width: ${({ $size }) => $size || 32}px;
    border-radius: 100%;
    display: block;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    font-size: ${({ $size }) => Math.ceil(($size || 32) / 2)}px;
    color: white;
    text-transform: uppercase;
    text-align: center;
  }

  ${({ inactive }) => (inactive ? 'opacity: 50%;' : '')}
`;

const Name = styled.span`
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  margin-left: 10px;

  font-size: 16px;
  font-weight: 500;
  line-height: 24px;
`;

type AvatarProps = {
  url?: string;
  name?: string;
  to?: string;
  inactive?: boolean;
  size?: number;
  onlyLetter?: boolean;
} & BoxProps;

const Avatar = ({
  url,
  name,
  inactive,
  size,
  onlyLetter,
  onClick,
  ...rest
}: AvatarProps) => {
  if (!name && !url) {
    return null;
  }

  return (
    <Wrapper $size={size} hasHover={!!onClick} onClick={onClick} {...rest}>
      <Icon
        $size={size}
        url={url}
        inactive={inactive}
        style={url ? { backgroundImage: `url(${url})` } : {}}
      >
        {url ? null : <span>{name![0] || '?'}</span>}
      </Icon>
      {name && !onlyLetter ? <Name>{name}</Name> : null}
    </Wrapper>
  );
};

export default Avatar;
