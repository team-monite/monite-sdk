import React from 'react';
import styled from '@emotion/styled';

import { UCheck } from 'unicons';

import type { TooltipProps, ThemedStyledProps } from '../types';

type StyledProps = {
  $checked?: boolean;
  $disabled?: boolean;
  $invalid?: boolean;
};
const getBorderColor = ({
  $checked,
  theme,
  $disabled,
  $invalid,
}: ThemedStyledProps<StyledProps>) => {
  let color = theme.checkbox.borderColor;

  if ($checked) {
    color = theme.checkbox.borderColorChecked;
  }

  if ($invalid) {
    color = theme.checkbox.borderColorInvalid;
  }

  if ($checked && $disabled) {
    color = theme.checkbox.borderColorCheckedDisabled;
  }

  if (!$checked && $disabled) {
    color = theme.checkbox.borderColorDisabled;
  }

  return `
    border-color: ${color};

    ${
      !$disabled && !$invalid
        ? `
      &:hover {
        border-color: ${theme.checkbox.borderColorHover};
      }
    `
        : ''
    }
  `;
};

const getOutlineColor = ({
  theme,
  $disabled,
  $invalid,
}: ThemedStyledProps<StyledProps>) => {
  if ($disabled) {
    return '';
  }

  if ($invalid) {
    return `box-shadow: 0px 0px 0px 4px ${theme.checkbox.borderColorInvalid}33;`;
  }

  return `
    &:hover {
      box-shadow: 0px 0px 0px 4px ${theme.checkbox.borderColorHover}33;
    }
  `;
};

const getColor = ({
  theme,
  $disabled,
  $invalid,
}: ThemedStyledProps<StyledProps>) => {
  if ($disabled) {
    return `color: ${theme.checkbox.checkMarkColor};`;
  }

  if ($invalid) {
    return `color: ${theme.checkbox.checkMarkColorError};`;
  }

  return `
    &:hover {
      color: ${
        $invalid
          ? theme.checkbox.checkMarkColorErrorHover
          : theme.checkbox.checkMarkColorHover
      };
    }
  `;
};

const Checkmark = styled.i<StyledProps>`
  position: relative;
  box-sizing: border-box;

  width: 20px;
  height: 20px;

  border-width: 2px;
  border-style: solid;
  border-radius: 4px;
  ${getBorderColor};
  ${getOutlineColor};
  ${getColor};

  transition: border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;

  ${({ $disabled, theme, $checked }) =>
    $disabled && !$checked
      ? `background: ${theme.checkbox.checkMarkBackgroundColorDisabled};`
      : ''}
`;

const Wrapper = styled.label<StyledProps>`
  display: flex;
  flex-direction: row;
  align-items: center;
  cursor: pointer;

  span {
    display: inline-block;
    margin-left: 12px;

    font-family: ${({ theme }) => theme.checkbox.fontFamily};
    font-size: ${({ theme }) => theme.checkbox.fontSize};
    font-weight: ${({ theme }) => theme.checkbox.fontWeight};
    line-height: 20px;

    color: ${({ theme }) => theme.checkbox.textColor};
  }

  input {
    position: absolute;
    width: 1px;
    height: 1px;
    opacity: 0;
    outline: none;
  }

  &:hover {
    span {
      color: ${({ theme }) => theme.checkbox.textColorHover};
    }
  }
`;

type CheckboxProps = {
  label?: string;
  name: string;
  id: string;
  value: string | number;
  checked?: boolean;
  disabled?: boolean;
  tooltip?: TooltipProps;
  isInvalid?: boolean;
  onChange?: (e: React.BaseSyntheticEvent) => void;
};

const Checkbox = ({
  label,
  name,
  id,
  value,
  checked,
  disabled,
  tooltip,
  isInvalid,
  onChange,
}: CheckboxProps) => {
  const tooltipAttributes = tooltip
    ? Object.keys(tooltip).reduce<Record<string, any>>((acc, key) => {
        acc[`data-${key}`] = tooltip[key];
        return acc;
      }, {})
    : {};

  return (
    <Wrapper
      htmlFor={id}
      $disabled={disabled}
      $invalid={isInvalid}
      {...tooltipAttributes}
    >
      <Checkmark $checked={checked} $disabled={disabled} $invalid={isInvalid}>
        {checked && <UCheck />}
      </Checkmark>
      <input
        type="checkbox"
        name={name}
        id={id}
        value={value}
        checked={checked}
        onChange={onChange}
        disabled={disabled}
      />
      {label && <span>{label}</span>}
    </Wrapper>
  );
};

export default Checkbox;
