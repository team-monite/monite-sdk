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
  let color = theme.colors.lightGrey2;
  if ($checked) {
    color = theme.colors.black;
  }

  if ($invalid) {
    color = theme.colors.red;
  }

  if ($checked && $disabled) {
    color = theme.colors.lightGrey2;
  }

  if (!$checked && $disabled) {
    color = theme.colors.lightGrey2;
  }

  return `
    border-color: ${color};

    ${
      !$disabled && !$invalid
        ? `
      &:hover {
        border-color: ${theme.colors.blue};
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
    return `box-shadow: 0px 0px 0px 4px ${theme.colors.red}33;`;
  }

  return `
    &:hover {
      box-shadow: 0px 0px 0px 4px ${theme.colors.blue}33;
    }
  `;
};

const getColor = ({
  theme,
  $disabled,
  $invalid,
}: ThemedStyledProps<StyledProps>) => {
  if ($disabled) {
    return `color: ${theme.colors.lightGrey2};`;
  }

  if ($invalid) {
    return `color: ${theme.colors.red};`;
  }

  return `
    &:hover {
      color: ${$invalid ? theme.colors.red : theme.colors.blue};
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
    $disabled && !$checked ? `background: ${theme.colors.lightGrey3};` : ''}
`;

const Wrapper = styled.label<StyledProps>`
  display: flex;
  flex-direction: row;
  align-items: center;
  cursor: pointer;

  span {
    display: inline-block;
    margin-left: 12px;

    font-size: 14px;
    font-weight: 400;
    line-height: 20px;
  }

  input {
    position: absolute;
    width: 1px;
    height: 1px;
    opacity: 0;
    outline: none;
  }
`;

type RadioProps = {
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
}: RadioProps) => {
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
      {label ? <span>{label}</span> : null}
    </Wrapper>
  );
};

export default Checkbox;
