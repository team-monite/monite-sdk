import React from 'react';
import styled from '@emotion/styled';

import Spinner from '../Spinner';
import { ReactComponent as UploadIcon } from './upload2.svg';

const Wrapper = styled.div<{ size: number } & Partial<AvatarInputProps>>`
  position: relative;
  width: ${({ size }) => size}px;
  height: ${({ size }) => size}px;
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center center;
  background-color: ${({ theme }) => theme.colors.grey};
  border-radius: 100%;

  input {
    position: absolute;
    opacity: 0;
    width: 1px;
    height: 1px;
  }

  label {
    visibility: ${({ isLoading }) => (isLoading ? 'visible' : 'hidden')};
    width: 100%;
    height: 100%;
    background: #246fffbf;
    border-radius: 100%;
    color: white;
    align-items: center;
    justify-content: center;
    display: inline-flex;
    cursor: pointer;
  }

  span {
    display: block;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    font-size: ${({ size }) => Math.ceil(size / 2)}px;
    color: white;
    text-transform: uppercase;
  }

  &:hover {
    label {
      visibility: visible;
    }
    span {
      display: none;
    }
  }
`;

type AvatarInputProps = {
  url?: string;
  onChange: (e: React.SyntheticEvent<HTMLInputElement>) => void;
  size?: number;
  name: string;
  isLoading?: boolean;
};

const AvatarInput = ({
  name,
  url,
  onChange,
  size = 80,
  isLoading,
}: AvatarInputProps) => {
  const iconSize = size / 2;
  return (
    <Wrapper
      isLoading={isLoading}
      size={size}
      style={url ? { backgroundImage: `url(${url})` } : {}}
    >
      {url ? null : <span>{name[0] || '?'}</span>}
      <input type="file" id="avatar" onChange={onChange} />
      <label htmlFor="avatar">
        {isLoading ? (
          <Spinner pxSize={Math.min(24, iconSize)} />
        ) : (
          <UploadIcon width={iconSize} height={iconSize} />
        )}
      </label>
    </Wrapper>
  );
};

export default AvatarInput;
