import React, { BaseSyntheticEvent, FC, ReactNode } from 'react';
import styled from '@emotion/styled';
import { UClockThree, UCheck, UExclamationTriangle } from 'unicons';
import { ThemeColors } from '../consts';
import { STYLES as TEXT_STYLES } from '../Text';
import { ThemedStyledProps } from '../types';

export type AlertVariant = 'info' | 'success' | 'error';

export const AlertIcons: Record<AlertVariant, ReactNode> = {
  info: <UClockThree size={20} />,
  success: <UCheck size={20} />,
  error: <UExclamationTriangle size={20} />,
};

export interface AlertProps {
  children: ReactNode;
  onClick?: (e: BaseSyntheticEvent) => void;
  variant?: AlertVariant;
  hasLeftIcon?: boolean;
  link?: ReactNode;
  action?: ReactNode;
  color?: ThemeColors;
  backgroundColor?: ThemeColors;
}

type StyledAlertProps = {
  $variant: AlertVariant;
  $color?: ThemeColors;
  $backgroundColor?: ThemeColors;
};

const getColor = ({
  $variant,
  $color,
  theme,
}: ThemedStyledProps<StyledAlertProps>) => {
  if ($color) return theme.colors[$color];
  if ($variant === 'info') return theme.colors.primary;
  if ($variant === 'success') return theme.colors.successDarker;
  if ($variant === 'error') return theme.colors.danger;
};

const getBackgroundColor = ({
  $variant,
  $backgroundColor,
  theme,
}: ThemedStyledProps<StyledAlertProps>) => {
  if ($backgroundColor) return theme.colors[$backgroundColor];
  if ($variant === 'info') return theme.colors.alertInfo;
  if ($variant === 'success') return theme.colors.alertSuccess;
  if ($variant === 'error') return theme.colors.alertError;
};

const StyledAlert = styled.div<StyledAlertProps>`
  border-radius: 8px;
  display: flex;
  width: 100%;
  align-items: center;
  justify-content: space-between;
  padding: 17px;
  gap: 16px;
  background: ${getBackgroundColor};
  color: ${getColor};
`;

const StyledText = styled.div<AlertProps>`
  display: flex;
  align-items: center;
  flex-grow: 1;
  ${TEXT_STYLES['small']}
`;

const StyledIcon = styled.i`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
`;

const StyledLink = styled.div`
  flex-grow: 2;
`;

const Alert: FC<AlertProps> = ({
  children,
  variant = 'info',
  color,
  backgroundColor,
  hasLeftIcon,
  link,
  action,
  ...props
}) => {
  return (
    <StyledAlert
      $variant={variant}
      $color={color}
      $backgroundColor={backgroundColor}
      {...props}
    >
      {hasLeftIcon && <StyledIcon>{AlertIcons[variant]}</StyledIcon>}
      <StyledText>{children}</StyledText>
      {link && <StyledLink>{link}</StyledLink>}
      {action}
    </StyledAlert>
  );
};

export default Alert;
