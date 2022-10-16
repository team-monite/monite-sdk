import React, {
  BaseSyntheticEvent,
  FC,
  forwardRef,
  ReactNode,
  Ref,
} from 'react';

import styled from '@emotion/styled';

import Spinner from '../Spinner';
import { Box, BoxProps } from '../Box';
import { Theme } from '../index';
import type { TooltipProps, ThemedStyledProps } from '../types';

type ButtonSize = 'sm' | 'md';
export type ButtonVariant = 'contained' | 'outlined' | 'text' | 'link' | 'icon';
type ButtonType = 'button' | 'submit' | 'reset';
type ButtonTextSize = keyof Theme['typographyStyles'];
export type ButtonColor =
  | 'primary'
  | 'secondary'
  | 'success'
  | 'danger'
  | 'warning'
  | 'special'
  | 'inherit'
  | string;

export interface ButtonProps extends BoxProps {
  theme?: Theme;
  onClick?: (e: BaseSyntheticEvent) => void;
  children: ReactNode;
  variant?: ButtonVariant;
  color?: ButtonColor;
  hover?: ButtonColor;
  type?: ButtonType;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  tooltip?: TooltipProps;
  size?: ButtonSize;
  textSize?: ButtonTextSize;
  ref?: Ref<ReactNode>;
  disabled?: boolean;
  isIcon?: boolean;
  isLoading?: boolean;
  block?: boolean;
  href?: string;
  className?: string;
  to?: string;
}

type StyledButtonProps = {
  theme?: Theme;
  $size?: ButtonSize;
  $textSize?: ButtonTextSize;
  $color?: ButtonColor;
  $hover?: ButtonColor;
  $variant?: ButtonVariant;
  $isIcon?: boolean;
  $isLoading?: boolean;
  $isLink?: boolean;
  $hasLeftIcon?: boolean;
  $hasRightIcon?: boolean;
  $block?: boolean;
};

const Dimensions: Record<ButtonSize, number> = {
  sm: 36,
  md: 48,
};

export const TextSize = (theme: Theme): Record<ButtonSize, string> => ({
  sm: `
    font-size: ${theme.button.fontSizeSm};
    font-weight: ${theme.button.fontWeightSm};
    line-height: 24px;
  `,
  md: `
    font-size: ${theme.button.fontSizeMd};
    font-weight: ${theme.button.fontWeightMd};
    line-height: 24px;
  `,
});

export const Themes = [
  'primary',
  'secondary',
  'success',
  'danger',
  'warning',
  'special',
] as const;

const getSize = ({ $size = 'md', $variant }: StyledButtonProps) => {
  if ($variant === 'text') return '';
  return `height: ${Dimensions[$size]}px;`;
};

const getTextSize = ({ theme, $textSize, $size = 'md' }: StyledButtonProps) => {
  if (!$textSize) {
    if (theme) return TextSize(theme)[$size];
  } else if (theme?.typographyStyles[$textSize])
    return theme?.typographyStyles[$textSize];
};

const getColor = ({ $color, theme }: ThemedStyledProps<StyledButtonProps>) => {
  if (!$color) return '';

  if ($color === 'inherit') return 'inherit';

  if (theme.button[`${$color as typeof Themes[number]}Color`]) {
    return theme.button[`${$color as typeof Themes[number]}Color`];
  }

  return $color;
};

const getVariant = ({
  $variant,
  $color,
  theme,
}: ThemedStyledProps<ButtonProps & StyledButtonProps>) => {
  const color = getColor({ $color, theme });

  if ($variant === 'contained') {
    return `
      background-color: ${color};
      color: ${theme.button.textColorContained};
      border-color: ${color};
    `;
  }

  if ($variant === 'outlined') {
    return `
      background-color: ${theme.button.backgroundColorOutlined};
      color: ${color};
      border-color: ${theme.button.borderColorOutlined};
    `;
  }

  if ($variant === 'link') {
    return `
      background-color: ${theme.button.backgroundColorLink};
      color: ${color};
    `;
  }

  if ($variant === 'text') {
    return `
      background-color: transparent;
      color: ${color};
    `;
  }

  return `
    background-color: transparent;
    color: ${color};
  `;
};

const getHover = ({
  $color,
  $variant,
  $isLoading,
  $hover,
  theme,
  disabled,
}: ThemedStyledProps<ButtonProps & StyledButtonProps>) => {
  const color = $hover ? $hover : getColor({ $color, theme });

  if (disabled || $isLoading) return '';

  if ($variant === 'contained') {
    return `
      &:hover {
        background-color: ${theme.button.backgroundContainedHover};
        border-color: ${theme.button.borderColorContainedHover};
      }
    `;
  }

  if ($variant === 'outlined') {
    return `
      &:hover {
        background-color: ${color};
        color: ${theme.button.textColorOutlinedHover};
        border-color: ${color};
      }
    `;
  }

  if ($variant === 'link') {
    return `
      &:hover {
        border-color: ${color};
      }
    `;
  }

  if ($variant === 'text') {
    return `
      &:hover {
        filter: brightness(0.6);
      }
    `;
  }

  return '';
};

// todo this is a hack to style secondary button
const getSecondaryColor = ({
  theme,
  $color,
  $variant,
  $isLoading,
}: ThemedStyledProps<ButtonProps & StyledButtonProps>) => {
  if ($color !== 'secondary') return '';

  const secondaryColor = `color: ${theme.button.textColorContainedSecondary};`;
  const getHover = (style: string) => (!$isLoading ? `&:hover {${style}}` : '');

  if ($variant === 'contained') {
    return `
      ${secondaryColor}

      ${getHover(`
        background-color: ${theme.button.backgroundContainedSecondaryHover};
        border-color: ${theme.button.borderColorContainedSecondaryHover};
        color: ${theme.button.textColorContainedSecondaryHover};
      `)}
    `;
  }

  if ($variant === 'link') {
    return `
      ${secondaryColor}

      ${getHover(`
        border-color: ${theme.button.borderColorLinkHover};
      `)}
    `;
  }

  return `
      ${secondaryColor}

      ${getHover(`
        ${secondaryColor}
      `)}
    `;
};

const getPadding = ({
  $variant,
  $hasLeftIcon,
  $hasRightIcon,
  $isIcon,
}: ThemedStyledProps<StyledButtonProps>) => {
  if ($variant === 'text') return 'padding: 0;';

  if (($hasLeftIcon && $hasRightIcon) || $isIcon) return 'padding: 11px;';
  if ($hasLeftIcon) return 'padding: 11px 15px 11px 11px;';
  if ($hasRightIcon) return 'padding: 11px 11px 11px 15px;';

  return 'padding: 11px 15px;';
};

const getBlock = ({
  $isLoading,
  $block,
  size,
}: ThemedStyledProps<ButtonProps & StyledButtonProps>) => {
  if ($block) {
    return `
      display: flex;
      width: 100%;
    `;
  }

  if ($isLoading && size) {
    return `
      width: ${Dimensions[size]}px;
      padding: 0;
    `;
  }
};

const getDisabled = ({ disabled }: ThemedStyledProps<ButtonProps>) => {
  if (disabled) {
    return `
      opacity: 0.5;
      pointer-events: none;
      cursor: default;
    `;
  }
};

const StyledButton = styled(Box)<ButtonProps & StyledButtonProps>`
  font-family: ${({ theme }) => theme.button.fontFamily};
  border-radius: ${({ theme }) => theme.button.borderRadius};
  display: inline-flex;
  text-align: center;
  align-items: center;
  justify-content: center;
  position: relative;
  white-space: nowrap;
  cursor: pointer;
  background: transparent;
  width: max-content;
  border: 1px solid transparent;
  text-decoration: none;
  transition: color 110ms, background-color 110ms, border-color 110ms;

  ${getSize}
  ${getTextSize}
  ${getVariant}
  ${getHover}
  ${getSecondaryColor}
  ${getPadding}
  ${getBlock}
  ${getDisabled}
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

const StyledIcon = styled.i`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;

  svg {
    width: 20px;
  }
`;

const StyledSecondaryIcon = styled(StyledIcon)<ButtonProps & StyledButtonProps>`
  ${({ $variant, $hasLeftIcon, $hasRightIcon }) => {
    const margin = $variant === 'text' ? '6' : '8';

    if ($hasLeftIcon) return `margin-right: ${margin}px;`;
    if ($hasRightIcon) return `margin-left: ${margin}px;`;
  }}
`;

const Button: FC<ButtonProps> = forwardRef<any, ButtonProps>(
  (
    {
      children,
      variant = 'contained',
      color = 'primary',
      type = 'button',
      size = 'md',
      tooltip,
      disabled,
      isLoading,
      isIcon,
      leftIcon,
      rightIcon,
      onClick,
      block,
      textSize,
      hover,
      className,
      href,
      to,
      ...props
    }: ButtonProps,
    ref
  ) => {
    const isLink = !!(href || to);

    const tooltipAttributes =
      tooltip &&
      Object.keys(tooltip).reduce<Record<string, any>>((acc, key) => {
        acc[`data-${key}`] = tooltip[key];
        return acc;
      }, {});

    const renderContent = () => {
      if (isLoading) {
        return (
          <StyledIcon>
            <Spinner pxSize={16} />
          </StyledIcon>
        );
      }

      if (isIcon) {
        return <StyledIcon>{children}</StyledIcon>;
      }

      return (
        <>
          {disabled && tooltip && (
            // react-tooltip workaround for disabled non-interactive elements
            <StyledDisabledTooltip {...tooltipAttributes} />
          )}

          {leftIcon && (
            <StyledSecondaryIcon $hasLeftIcon $variant={variant}>
              {leftIcon}
            </StyledSecondaryIcon>
          )}

          {children}

          {rightIcon && (
            <StyledSecondaryIcon $hasRightIcon $variant={variant}>
              {rightIcon}
            </StyledSecondaryIcon>
          )}
        </>
      );
    };

    return (
      <StyledButton
        {...props}
        {...(!disabled && tooltip && tooltipAttributes)}
        $variant={variant}
        $isLoading={isLoading}
        $isIcon={isIcon}
        $isLink={isLink}
        $hasLeftIcon={!!leftIcon}
        $hasRightIcon={!!rightIcon}
        $block={block}
        $size={size}
        $textSize={textSize}
        $color={color}
        $hover={hover}
        disabled={disabled}
        onClick={onClick}
        ref={ref}
        href={href || to}
        to={to}
        type={isLink ? undefined : type}
        as={isLink ? 'a' : 'button'}
      >
        {renderContent()}
      </StyledButton>
    );
  }
);

export default Button;
