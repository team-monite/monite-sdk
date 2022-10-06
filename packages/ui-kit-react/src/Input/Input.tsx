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
      color: ${theme.input.isInvalidColor};
      background-color: ${theme.input.isInvalidBackgroundColor};
      border-color: ${theme.input.isInvalidBorderColor};
      box-shadow: 0px 0px 0px 4px ${theme.input.isInvalidBorderColor}33;
    `;
  }

  if (readOnly) {
    if (value) {
      return `
        border-color: ${theme.input.isReadonlyBorderColor};
        background-color: ${theme.input.isReadonlyBackgroundColor};
        color: ${theme.input.isReadonlyTextColor};
      `;
    }
    return `
      &:hover, &:focus {
        box-shadow: none;
      }
    `;
  }

  if (value && !isFilter) {
    return `
      border-color: ${theme.input.withValueBorderColor};
      background-color: ${theme.input.withValueBackgroundColor};

      &:hover, &:focus {
        border-color: ${theme.input.borderColorHover};
        box-shadow: 0px 0px 0px 4px ${theme.input.borderShadowHover}33;
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

      &:hover, &:focus {
        background-color: ${theme.input.filterBackgroundColorHover};
        color: ${theme.input.filterTextColorHover};
        border-color: ${theme.input.filterBorderColorHover};
        box-shadow: none;

        &::placeholder {
          color: ${theme.input.filterTextColorHover};
        }
      }
    `;
  }

  return `
    &:hover, &:focus {
      color: ${theme.input.textColorHover};
      background-color: ${theme.input.backgroundColorHover};
      border-color: ${theme.input.borderColorHover};
      box-shadow: 0px 0px 0px 4px ${theme.input.borderShadowHover}33;
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
    isFilter ? theme.input.filterBorderRadius : theme.input.borderRadius};
  border: 1px solid ${({ theme }) => theme.input.borderColor};
  padding: 11px 16px;
  background-color: ${({ theme }) => theme.input.backgroundColor};

  font-family: ${({ theme }) => theme.input.fontFamily};
  font-size: ${({ theme }) => theme.input.fontSize};
  font-weight: ${({ theme }) => theme.input.fontWeight};
  line-height: 24px;

  color: ${({ theme }) => theme.input.textColor};

  cursor: ${({ readOnly }) => (readOnly ? 'not-allowed' : 'auto')};

  ${getBg};
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
  border: 1px solid ${({ theme }) => theme.input.borderColor};
  padding: 11px 16px;
  background-color: ${({ theme }) => theme.input.backgroundColor};

  font-family: ${({ theme }) => theme.input.fontFamily};
  font-size: ${({ theme }) => theme.input.fontSize};
  font-weight: ${({ theme }) => theme.input.fontWeight};
  line-height: 24px;

  color: ${({ theme }) => theme.input.textColor};

  cursor: ${({ readOnly }) => (readOnly ? 'not-allowed' : 'auto')};

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
