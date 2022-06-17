import React from 'react';
import styled, { ThemedStyledProps } from 'styled-components';

import type { TooltipProps } from '../types';

type StyledProps = {
  $checked?: boolean;
  $disabled?: boolean;
};
const getBorderColor = ({
  $checked,
  theme,
  $disabled,
}: ThemedStyledProps<StyledProps, any>) => {
  if ($checked && $disabled) {
    return theme.colors.lightGrey2;
  }

  if (!$checked && $disabled) {
    return theme.colors.lightGrey1;
  }

  if ($checked) {
    return theme.colors.black;
  }

  return theme.colors.lightGrey2;
};
const Checkmark = styled.i<StyledProps>`
  display: inline-block;
  position: relative;

  width: 20px;
  height: 20px;
  border: 2px solid ${getBorderColor};
  border-radius: 50%;
  ${({ $disabled, theme, $checked }) =>
    $disabled && !$checked ? `background: ${theme.colors.lightGrey2};` : ''}

  &:after {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;

    width: 8px;
    height: 8px;
    background: ${({ theme }) => theme.colors.black};
    border-radius: 50%;

    transform: translate(-50%, -50%);

    ${({ $checked }) => `display: ${$checked ? 'block' : 'none'};`}
    ${({ $disabled, theme }) =>
      `background: ${
        $disabled ? theme.colors.lightGrey2 : theme.colors.black
      };`}
  }
`;

const Wrapper = styled.label<StyledProps>`
  display: flex;
  flex-direction: row;
  align-items: center;
  cursor: pointer;

  transition: border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;

  span {
    display: inline-block;
    margin-left: 12px;
  }

  input {
    position: absolute;
    width: 1px;
    height: 1px;
    opacity: 0;
    outline: none;
  }

  ${({ $disabled, theme }) =>
    !$disabled
      ? `
  &:hover ${Checkmark} {
    box-shadow: 0px 0px 0px 2px ${theme.colors.blue}33;
  }
  `
      : ''}
`;

type RadioProps = {
  label?: string;
  name: string;
  id: string;
  value: string | number;
  checked?: boolean;
  isDisabled?: boolean;
  tooltip?: TooltipProps;
  onChange?: (e: React.BaseSyntheticEvent) => void;
};

const Radio = ({
  label,
  name,
  id,
  value,
  checked,
  isDisabled,
  tooltip,
  onChange,
}: RadioProps) => {
  const tooltipAttributes = tooltip
    ? Object.keys(tooltip).reduce<Record<string, any>>((acc, key) => {
        acc[`data-${key}`] = tooltip[key];
        return acc;
      }, {})
    : {};

  return (
    <Wrapper htmlFor={id} $disabled={isDisabled} {...tooltipAttributes}>
      <Checkmark $checked={checked} $disabled={isDisabled} />
      <input
        type="radio"
        name={name}
        id={id}
        value={value}
        checked={checked}
        onChange={onChange}
        disabled={isDisabled}
      />
      {label ? <span>{label}</span> : null}
    </Wrapper>
  );
};

export default Radio;
