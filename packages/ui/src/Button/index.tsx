import React from 'react';
import styled from '@emotion/styled';

import Spinner from '../Spinner';
import Text, { STYLES as TEXT_STYLES } from '../Text';
import { Box, BoxProps } from '../Box';

import { THEMES } from '../consts';

import type { TooltipProps, ThemedStyledProps } from '../types';

type StyledButtonProps = {
  $isLoading: boolean;
  $isIcon: boolean;
  $hasLeftIcon: boolean;
  $noPadding: boolean;
  $block: boolean;
  $textSize?: string;
  $color?: string;
  $hover?: string;
};

type ButtonSize = 'md';
const Size: Record<ButtonSize, string> = {
  md: `
    height: 48px;
    font-size: 16px;
    font-weight: 500;
    line-height: 24px;
    padding: 11px 15px 11px 15px;
  `,
};
const Width: Record<string, number> = {
  md: 48,
};
const getSize = ({ $textSize, size = 'md' }: ButtonProps & StyledButtonProps) =>
  $textSize ? TEXT_STYLES[$textSize] : Size[size];

const Themes: Record<string, any> = {
  primary: `
    background: ${THEMES.default.colors.primary};
    color: ${THEMES.default.colors.white};
    border-color: ${THEMES.default.colors.primary};
  `,
  secondary: `
    background: ${THEMES.default.colors.secondary};
    color: ${THEMES.default.colors.black};
    border-color: ${THEMES.default.colors.secondary};
  `,
  danger: `
    background: ${THEMES.default.colors.white};
    color: ${THEMES.default.colors.danger};
    border-color: ${THEMES.default.colors.lightGrey2};
  `,
  link: `
    color: ${THEMES.default.colors.blue};
  `,
};

const Hover: Record<string, any> = {
  primary: `
    &:hover {
      background: ${THEMES.default.colors.black};
      border-color: ${THEMES.default.colors.black};
    }
  `,
  secondary: `
    &:hover {
      background:${THEMES.default.colors.grey};
      border-color: ${THEMES.default.colors.grey};
      color: ${THEMES.default.colors.white};
    }
  `,
  danger: `
    &:hover {
      border-color: ${THEMES.default.colors.danger};
      background: ${THEMES.default.colors.danger};
      color: ${THEMES.default.colors.white};
    }
  `,
};

const getColor = ({
  $color = 'primary',
  theme,
}: ThemedStyledProps<StyledButtonProps>) => {
  if (!$color) {
    return '';
  }

  if (Themes[$color]) {
    return Themes[$color];
  }

  if (theme.colors[$color]) {
    return `color: ${theme.colors[$color]};`;
  }

  return '';
};

const getHoverColor = ({
  $color = 'primary',
  $hover,
  theme,
  disabled,
  $isLoading,
}: ThemedStyledProps<ButtonProps & StyledButtonProps>) => {
  if (disabled || $isLoading) {
    return '';
  }

  if ($color && Hover[$color]) {
    return Hover[$color];
  }

  if ($hover && theme.colors[$hover]) {
    return `&:hover { color: ${theme.colors[$hover]}; }`;
  }

  return '';
};

const getPadding = ({ $hasLeftIcon }: ButtonProps & StyledButtonProps) => {
  if ($hasLeftIcon) {
    return 'padding-left: 11px;';
  }

  return '';
};
const StyledButton = styled(Box)<ButtonProps & StyledButtonProps>`
  border-radius: 6px;
  text-align: center;
  display: inline-block;
  border: none;
  position: relative;

  white-space: nowrap;

  cursor: pointer;

  background: transparent;
  border-color: transparent;

  width: max-content;
  vertical-align: middle;

  ${({ $block }) =>
    $block
      ? `
  display: block;
  width: 100%;
  `
      : ''};

  ${getSize}
  ${getColor}
  ${getHoverColor}
  ${getPadding}

  ${({ $block, $isIcon, $isLoading, $noPadding, size = 'md' }) =>
    ($isIcon || $isLoading) && !$noPadding && !$block
      ? `
      width: ${Width[size]}px;
      padding: 0;
    `
      : ''};

  ${({ $noPadding }) =>
    $noPadding
      ? `
      border: none;
      height: auto;
    `
      : `
      border-width: 1px;
      border-style: solid;
    `}

  ${({ disabled }) => (disabled ? `opacity: 0.5;` : '')}

  > svg + span {
    margin-left: 12px;
  }

  i {
    display: flex;
    align-content: center;
    align-items: center;
    justify-content: center;
    height: 100%;
  }

  ${({ $isLoading }) =>
    !$isLoading
      ? `
  * {
    display: inline-block;
  }
  `
      : ''}

  ${({ $hasLeftIcon }) =>
    $hasLeftIcon
      ? `
  * {
    vertical-align: top;
  }
  `
      : ''}

  ${({ $isIcon }) =>
    $isIcon
      ? `
    svg {
      display: block;
    }
  `
      : ''}

  ${({ disabled, $color, $isLoading }) =>
    !disabled && !$isLoading && $color !== 'link' && (!$color || Themes[$color])
      ? `
    &:active {
      top: 2px;
    }
  `
      : ''}

  ${({ $noPadding }) => ($noPadding ? 'padding: 0;' : '')}
`;

const StyledDisabledTooltip = styled.span`
  top: 0;
  left: 0;
  position: absolute;
  display: block;
  width: 100%;
  height: 100%;
  z-index: 5;
`;

export interface ButtonProps extends BoxProps {
  text?: string;
  icon?: React.ReactNode;
  leftIcon?: React.ReactNode;
  disabled?: boolean;
  isLoading?: boolean;
  tooltip?: TooltipProps;
  link?: string;
  to?: string;
  href?: string;
  noPadding?: boolean;
  ref?: React.Ref<any>;
  size?: ButtonSize;
  block?: boolean;
  className?: string;
  textSize?: string;
  color?: string;
  hover?: string;
  onClick?: (e: React.BaseSyntheticEvent) => void;
}

const Button: React.FC<ButtonProps> = React.forwardRef<any, ButtonProps>(
  (
    {
      tooltip,
      disabled,
      isLoading,
      text,
      icon,
      leftIcon,
      noPadding,
      onClick,
      block,
      textSize,
      color,
      hover,
      as,
      className,
      ...props
    }: ButtonProps,
    ref
  ) => {
    const tooltipAttributes = tooltip
      ? Object.keys(tooltip).reduce<Record<string, any>>((acc, key) => {
          acc[`data-${key}`] = tooltip[key];
          return acc;
        }, {})
      : {};

    let textContent = null;
    if (text) {
      textContent = textSize ? (
        <Text as="span" size={textSize}>
          {text}
        </Text>
      ) : (
        <span>{text}</span>
      );
    }

    return (
      <StyledButton
        disabled={disabled}
        onClick={onClick}
        $isLoading={!!isLoading}
        $isIcon={!!icon}
        $hasLeftIcon={!!leftIcon}
        $noPadding={!!noPadding}
        $block={!!block}
        $textSize={textSize}
        $color={color}
        $hover={hover}
        ref={ref}
        as={as || 'button'}
        {...(!disabled && tooltip ? tooltipAttributes : {})}
        {...(!as ? { type: 'button' } : {})}
        {...props}
      >
        {isLoading ? (
          <i>
            <Spinner pxSize={16} />
          </i>
        ) : (
          <>
            {disabled && tooltip ? ( // react-tooltip workaround for disabled non-interactive elements
              <StyledDisabledTooltip {...tooltipAttributes} />
            ) : null}
            {leftIcon}
            {icon ? <i>{icon}</i> : null}
            {text ? textContent : null}
          </>
        )}
      </StyledButton>
    );
  }
);

export default Button;
