import React, { forwardRef } from 'react';
import styled from '@emotion/styled';

import type { ThemedStyledProps } from '../types';

const InputGroup = styled.div<{ hasAddonIcon: boolean }>`
  position: relative;
  display: flex;

  > i {
    position: absolute;
    right: 0;
    top: 0;
    height: 100%;
    cursor: pointer;
    user-select: none;
  }

  ${({ hasAddonIcon }) =>
    hasAddonIcon ? `${Input} { padding-right: 48px; }` : ''}
`;

const getBg = ({
  isInvalid,
  theme,
  readOnly,
  value,
}: ThemedStyledProps<InputProps>) => {
  if (isInvalid) {
    return `
      background-color: ${theme.colors.white};
      border-color: ${theme.colors.red};
      box-shadow: 0px 0px 0px 4px ${theme.colors.red}33;
    `;
  }

  if (readOnly) {
    if (value) {
      return `
        border-color: ${theme.colors.lightGrey2};
        background-color: ${theme.colors.white};
        color: ${theme.colors.lightGrey1};
      `;
    }
    return `
      &:hover, &:focus {
        border-color: ${theme.colors.lightGrey3};
        box-shadow: none;
      }
    `;
  }

  if (value) {
    return `
      border-color: ${theme.colors.lightGrey2};
      background-color: ${theme.colors.white};

      &:hover, &:focus {
        border-color: ${theme.colors.blue};
        box-shadow: 0px 0px 0px 4px ${theme.colors.blue}33;
      }
    `;
  }

  return `
    &:hover, &:focus {
      border-color: ${theme.colors.blue};
      background-color: ${theme.colors.white};
      box-shadow: 0px 0px 0px 4px ${theme.colors.blue}33;
    }
  `;
};

const Input = styled.input<InputProps>`
  display: block;
  flex: 1;
  width: 100%;

  outline: none;
  box-shadow: none;
  transition: border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;

  border-radius: 8px;
  border: 1px solid ${({ theme }) => theme.colors.lightGrey3};
  padding: 11px 16px;
  background-color: ${({ theme }) => theme.colors.lightGrey3};

  font-size: 16px;
  font-weight: 400;
  line-height: 24px;

  color: ${({ theme }) => theme.colors.black};

  ${getBg}
`;

export interface InputProps
  extends React.AllHTMLAttributes<HTMLInputElement | HTMLTextAreaElement> {
  as?: string;
  value?: string | number;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
  isInvalid?: boolean;
  renderAddon?: () => React.ReactNode;
  renderAddonIcon?: () => React.ReactNode;
}

const InputField = forwardRef<HTMLInputElement, InputProps>(
  (
    { id, className, error, renderAddon, renderAddonIcon, type, ...props },
    ref
  ) => {
    return (
      <InputGroup className={className} hasAddonIcon={!!renderAddonIcon}>
        <Input ref={ref} id={id} type={type || 'text'} {...props} />
        {renderAddon && renderAddon()}
        {renderAddonIcon && <i>{renderAddonIcon()}</i>}
      </InputGroup>
    );
  }
);

export default InputField;
