import React from 'react';
import styled from '@emotion/styled';
import { ThemedStyledProps } from 'types';

type StyledProps = {
  $checked?: boolean;
  $disabled?: boolean;
};

const getBackgroundColor = ({
  $checked,
  theme,
  $disabled,
}: ThemedStyledProps<StyledProps>) => {
  if ($checked && $disabled) {
    return theme.colors.grey;
  }

  if (!$checked && $disabled) {
    return theme.colors.lightGrey3;
  }

  if ($checked) {
    return theme.colors.black;
  }

  return theme.colors.lightGrey2;
};

const Slider = styled.i<StyledProps>`
  position: absolute;
  cursor: pointer;
  border-radius: 100px;

  top: 0;
  left: 0;
  right: 0;
  bottom: 0;

  background: ${getBackgroundColor};

  &:before {
    position: absolute;
    content: '';
    width: 24px;
    height: 24px;
    left: 4px;
    bottom: 4px;
    background-color: ${({ theme }) => theme.colors.white};
    border-radius: 100px;
    ${({ $checked }) => `transform: ${$checked ? 'translateX(24px)' : 'none'};`}
  }
  &:hover {
    background: ${({ theme, $disabled }) => !$disabled && theme.colors.blue};
  }
`;
const Wrapper = styled.label<StyledProps>`
  position: relative;
  display: flex;
  width: 56px;
  height: 32px;
  margin: 24px;

  input {
    opacity: 0;
    width: 0;
    height: 0;
  }

  span {
    display: block;
    margin-left: 60px;
    margin-top: 6px;
    min-width: 200px;
  }
`;

type SwitchProps = {
  label?: string;
  name: string;
  id: string;
  value: string | number;
  checked?: boolean;
  isDisabled?: boolean;
  onChange?: (e: React.BaseSyntheticEvent) => void;
};

const Switch = ({
  label,
  name,
  id,
  value,
  checked,
  isDisabled,
  onChange,
}: SwitchProps) => {
  return (
    <Wrapper>
      <Slider $checked={checked} $disabled={isDisabled}></Slider>
      <input
        type="checkbox"
        name={name}
        id={id}
        value={value}
        checked={checked}
        onChange={onChange}
        disabled={isDisabled}
      />
      {label && <span>{label}</span>}
    </Wrapper>
  );
};

export default Switch;
