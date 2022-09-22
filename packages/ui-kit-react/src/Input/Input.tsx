// TODO refactor component, split to two: Input & Textarea
import React, { ForwardedRef, forwardRef } from 'react';
import styled from '@emotion/styled';
import {
  Input as RebassInput,
  InputProps as RebassInputProps,
  Textarea as RebassTextarea,
  TextareaProps as RebassTextareaProps,
} from '@rebass/forms';

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
  isFilter,
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

  if (value && !isFilter) {
    return `
      border-color: ${theme.colors.lightGrey2};
      background-color: ${theme.colors.white};

      &:hover, &:focus {
        border-color: ${theme.colors.blue};
        box-shadow: 0px 0px 0px 4px ${theme.colors.blue}33;
      }
    `;
  }

  if (isFilter) {
    return `
      color: ${
        value ? theme.input.filterWithValueColor : theme.input.filterTextColor
      };
      border-color: ${theme.input.filterBorderColor};
      background-color: ${
        value
          ? theme.input.filterWithValueBackgroundColor
          : theme.input.filterBackgroundColor
      };
      box-shadow: none;

      &:hover {
        background-color: ${theme.input.filterBackgroundColorHover};
        color: ${theme.input.filterTextColorHover};
        border-color: ${theme.input.filterBorderColorHover};

        &::placeholder {
          color: ${theme.input.filterTextColorHover};
        }
      }

      &:hover, &:focus {
        border-color: ${theme.colors.lightGrey2};
        box-shadow: none;
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

const Input = styled(RebassInput)`
  display: block;
  flex: 1;
  width: 100%;

  outline: none;
  box-shadow: none;
  transition: border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;

  border-radius: ${({ theme, isFilter }) =>
    isFilter ? theme.input.filterBorderRadius : '8px'};
  border: 1px solid ${({ theme }) => theme.colors.lightGrey3};
  padding: 11px 16px;
  background-color: ${({ theme }) => theme.colors.lightGrey3};

  font-size: 16px;
  font-weight: 400;
  line-height: 24px;

  color: ${({ theme }) => theme.colors.black};

  ${getBg}
`;

const Textarea = styled(RebassTextarea)`
  display: block;
  flex: 1;
  width: 100%;

  outline: none;
  box-shadow: none;
  transition: border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;

  border-radius: ${({ theme, isFilter }) =>
    isFilter ? theme.input.filterBorderRadius : '8px'};
  border: 1px solid ${({ theme }) => theme.colors.lightGrey3};
  padding: 11px 16px;
  background-color: ${({ theme }) => theme.colors.lightGrey3};

  font-size: 16px;
  font-weight: 400;
  line-height: 24px;

  color: ${({ theme }) => theme.colors.black};

  ${getBg}
`;

export interface InputProps extends RebassInputProps {
  value?: string | number;
  onChange?: (event: React.ChangeEvent<any>) => void;
  error?: string;
  isInvalid?: boolean;
  isFilter?: boolean;
  hasAddonIcon?: boolean;
  renderAddon?: () => React.ReactNode;
  renderAddonIcon?: () => React.ReactNode;
  externalRef?: ForwardedRef<HTMLInputElement>;
  textarea?: boolean;
}

export interface TextareaProps extends RebassTextareaProps {
  value?: string | number;
  onChange?: (event: React.ChangeEvent<any>) => void;
  error?: string;
  isInvalid?: boolean;
  isFilter?: boolean;
  hasAddonIcon?: boolean;
  renderAddon?: () => React.ReactNode;
  renderAddonIcon?: () => React.ReactNode;
  externalRef?: ForwardedRef<HTMLInputElement>;
  textarea?: boolean;
}
// TODO fix typings for forward ref
const InputField = forwardRef<any, any>(
  (
    {
      className,
      error,
      renderAddon,
      renderAddonIcon,
      type = 'text',
      isFilter,
      externalRef,
      textarea,
      ...props
    },
    ref
  ) => {
    const RenderedInput = textarea ? Textarea : Input;

    return (
      <InputGroup className={className} hasAddonIcon={!!renderAddonIcon}>
        <RenderedInput
          {...props}
          ref={externalRef || ref}
          type={type}
          isFilter={isFilter}
        />
        {renderAddon && renderAddon()}
        {renderAddonIcon && <i>{renderAddonIcon()}</i>}
      </InputGroup>
    );
  }
);

export default InputField;
